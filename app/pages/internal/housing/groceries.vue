<script setup lang="ts">
import draggable from "vuedraggable";
import type { GroceriesData, GroceryItem, GroceryCategory } from "~~/server/db/schema"

definePageMeta({
    layout: "dashboard"
});

const toast = useToast();
const { data: groceries, refresh } = await useApi<GroceriesData>("/api/groceries");

// --- State ---
const newCategoryInput = ref("");
const newStoreInput = ref("");
const newItemName = ref<Record<string, string>>({});
const filterToBuy = ref(false);

// Modal state
const isItemModalOpen = ref(false);
const editingItem = ref<Partial<GroceryItem> & { catId?: string }>({});
const isEditing = ref(false);

const isStoreModalOpen = ref(false);

// Local categories for reordering
const localCategories = ref<GroceryCategory[]>([]);

watch(groceries, (newVal) => {
    if (newVal?.categories) {
        localCategories.value = JSON.parse(JSON.stringify(newVal.categories));
    }
}, { immediate: true, deep: true });

// --- Computed ---
const filteredCategories = computed(() => {
    if (!localCategories.value) return [];
    if (!filterToBuy.value) return localCategories.value;

    return localCategories.value.map(cat => ({
        ...cat,
        items: cat.items.filter(item => !item.isBought)
    })).filter(cat => cat.items.length > 0);
});

// --- Actions ---

async function addCategory() {
    if (!newCategoryInput.value) return;
    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "addCategory", name: newCategoryInput.value }
        });
        await refresh();
        newCategoryInput.value = "";
        toast.add({ title: "Category added", color: "success" });
    } catch (e) {
        toast.add({ title: "Failed to add category", color: "error" });
    }
}

async function deleteCategory(catId: string) {
    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "deleteCategory", catId }
        });
        await refresh();
        toast.add({ title: "Category deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete category", color: "error" });
    }
}

async function saveOrder() {
    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "reorderCategories", categories: localCategories.value }
        });
        if (groceries.value) {
            groceries.value.categories = JSON.parse(JSON.stringify(localCategories.value));
        }
    } catch (e) {
        await refresh();
        toast.add({ title: "Failed to save order", color: "error" });
    }
}

async function addStore() {
    if (!newStoreInput.value) return;
    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "addStore", name: newStoreInput.value }
        });
        await refresh();
        newStoreInput.value = "";
        toast.add({ title: "Store added", color: "success" });
    } catch (e) {
        toast.add({ title: "Failed to add store", color: "error" });
    }
}

async function deleteStore(storeId: string) {
    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "deleteStore", storeId }
        });
        await refresh();
        toast.add({ title: "Store deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete store", color: "error" });
    }
}

async function quickAddItem(catId: string) {
    const name = newItemName.value[catId];
    if (!name) return;

    try {
        await $api("/api/groceries", {
            method: "POST",
            body: {
                action: "addItem",
                catId,
                item: {
                    name,
                    amount: 1,
                    isBought: false,
                    stockStatus: 'out-of-stock'
                }
            }
        });
        await refresh();
        newItemName.value[catId] = "";
        toast.add({ title: "Item added", color: "success" });
    } catch (e) {
        toast.add({ title: "Failed to add item", color: "error" });
    }
}

async function toggleBought(catId: string, itemId: string) {
    // Optimistic update
    const cat = localCategories.value.find(c => c.id === catId);
    if (cat) {
        const item = cat.items.find(i => i.id === itemId);
        if (item) {
            item.isBought = !item.isBought;
            if (item.isBought) item.stockStatus = 'in-stock';
        }
    }

    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "toggleBought", catId, itemId }
        });
        // refresh to be safe though optimistic update handles UI
    } catch (e) {
        await refresh();
        toast.add({ title: "Failed to update item", color: "error" });
    }
}

async function deleteItem(catId: string, itemId: string) {
    try {
        await $api("/api/groceries", {
            method: "POST",
            body: { action: "deleteItem", catId, itemId }
        });
        await refresh();
        toast.add({ title: "Item deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete item", color: "error" });
    }
}

function openEditModal(catId: string, item: GroceryItem) {
    editingItem.value = JSON.parse(JSON.stringify({ ...item, catId }));
    isEditing.value = true;
    isItemModalOpen.value = true;
}

function openAddDetailedModal(catId: string) {
    editingItem.value = {
        catId,
        name: '',
        amount: 1,
        unit: 'unit',
        isBought: false,
        stockStatus: 'out-of-stock'
    };
    isEditing.value = false;
    isItemModalOpen.value = true;
}

async function saveItem() {
    if (!editingItem.value.name || !editingItem.value.catId) return;

    const { catId, id, ...itemData } = editingItem.value;

    try {
        if (isEditing.value && id) {
            await $api("/api/groceries", {
                method: "POST",
                body: {
                    action: "updateItem",
                    catId,
                    itemId: id,
                    item: itemData
                }
            });
            toast.add({ title: "Item updated" });
        } else {
            await $api("/api/groceries", {
                method: "POST",
                body: {
                    action: "addItem",
                    catId,
                    item: itemData
                }
            });
            toast.add({ title: "Item added" });
        }
        await refresh();
        isItemModalOpen.value = false;
    } catch (e) {
        toast.add({ title: "Failed to save item", color: "error" });
    }
}

// --- Helpers ---

const getStockColor = (status: string) => {
    switch (status) {
        case 'in-stock': return 'success';
        case 'low': return 'warning';
        case 'out-of-stock': return 'error';
        default: return 'neutral';
    }
};

const getStoreName = (storeId?: string) => {
    return groceries.value?.stores.find(s => s.id === storeId)?.name || 'Any Store';
};

const storeOptions = computed(() => {
    const options = (groceries.value?.stores || []).map(s => ({
        label: s.name,
        value: s.id
    }));
    return [{ label: 'Any Store', value: '' }, ...options];
});

function getCategoryMenuItems(catId: string) {
    return [
        [{
            label: 'Delete Category',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deleteCategory(catId)
        }]
    ];
}

function getItemMenuItems(catId: string, item: GroceryItem) {
    return [
        [{
            label: 'Edit Details',
            icon: 'i-lucide-edit-3',
            onSelect: () => openEditModal(catId, item)
        }],
        [{
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deleteItem(catId, item.id)
        }]
    ];
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Grocery List">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 mr-4">
              <span class="text-xs font-medium text-gray-500">To Buy Only</span>
              <USwitch v-model="filterToBuy" size="sm" />
            </div>
            <UButton
              label="Manage Stores"
              icon="i-lucide-store"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="isStoreModalOpen = true"
            />
            <UButton icon="i-lucide-plus" size="sm" color="primary" @click="addCategory" />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6">
        <!-- Add Category Top Bar -->
        <div class="flex items-center gap-2 max-w-md">
          <UInput
            v-model="newCategoryInput"
            placeholder="New Category (e.g. Fridge, Pantry)..."
            class="flex-1"
            @keyup.enter="addCategory"
          />
          <UButton
            label="Add"
            icon="i-lucide-plus"
            color="neutral"
            variant="soft"
            @click="addCategory"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="localCategories.length === 0"
          class="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <UIcon name="i-lucide-shopping-cart" class="w-16 h-16 mb-4 opacity-20" />
          <p>No categories yet. Add one to start tracking groceries.</p>
        </div>

        <!-- Categories Grid -->
        <div v-if="groceries" class="space-y-8 pb-20">
          <draggable
            v-model="localCategories"
            item-key="id"
            handle=".category-drag-handle"
            :animation="200"
            @end="saveOrder"
            class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          >
            <template #item="{ element: category }">
              <UCard class="flex flex-col h-full group/card relative overflow-visible">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="category-drag-handle cursor-move opacity-30 hover:opacity-100 transition-opacity"
                      >
                        <UIcon name="i-lucide-grip-vertical" class="w-4 h-4" />
                      </div>
                      <h3 class="font-bold text-lg">{{ category.name }}</h3>
                    </div>
                    <UDropdownMenu :items="getCategoryMenuItems(category.id)">
                      <UButton
                        icon="i-lucide-ellipsis-vertical"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                      />
                    </UDropdownMenu>
                  </div>
                </template>

                <!-- Items List -->
                <div class="flex-1 space-y-2">
                  <draggable
                    v-model="category.items"
                    item-key="id"
                    handle=".item-drag-handle"
                    :animation="200"
                    group="grocery-items"
                    @end="saveOrder"
                    class="min-h-10 space-y-2"
                  >
                    <template #item="{ element: item }">
                      <div
                        v-if="!filterToBuy || !item.isBought"
                        class="group/item flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-primary-500/30 transition-all"
                        :class="{'opacity-50 grayscale': item.isBought}"
                      >
                        <div class="flex items-center gap-3 overflow-hidden">
                          <UCheckbox
                            :model-value="item.isBought"
                            @update:model-value="toggleBought(category.id, item.id)"
                          />
                          <div class="flex flex-col overflow-hidden">
                            <span
                              class="font-medium text-sm truncate"
                              :class="{'line-through': item.isBought}"
                              >{{ item.name }}</span
                            >
                            <div class="flex items-center gap-2 text-[10px] text-gray-500">
                              <UBadge
                                :label="item.stockStatus.replace('-', ' ')"
                                :color="getStockColor(item.stockStatus)"
                                size="xs"
                                variant="soft"
                                class="capitalize"
                              />
                              <span>• {{ item.amount }} {{ item.unit || '' }}</span>
                              <span v-if="item.lastPrice" class="text-primary-500 font-semibold"
                                >${{ item.lastPrice }}</span
                              >
                              <span v-if="item.storeId" class="truncate opacity-70"
                                >• {{ getStoreName(item.storeId) }}</span
                              >
                            </div>
                          </div>
                        </div>
                        <div
                          class="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                          <UDropdownMenu :items="getItemMenuItems(category.id, item)">
                            <UButton
                              icon="i-lucide-ellipsis-vertical"
                              color="neutral"
                              variant="ghost"
                              size="xs"
                            />
                          </UDropdownMenu>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>

                <template #footer>
                  <div class="flex items-center gap-2">
                    <UInput
                      v-model="newItemName[category.id]"
                      placeholder="Add item..."
                      size="xs"
                      class="flex-1"
                      @keyup.enter="quickAddItem(category.id)"
                    />
                    <UButton
                      icon="i-lucide-plus"
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="quickAddItem(category.id)"
                    />
                    <UButton
                      icon="i-lucide-file-text-plus"
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="openAddDetailedModal(category.id)"
                    />
                  </div>
                </template>
              </UCard>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Item Detail Modal -->
      <UModal v-model:open="isItemModalOpen" :title="isEditing ? 'Edit Item' : 'Add Detailed Item'">
        <template #body>
          <div class="space-y-4 p-4">
            <UFormField label="Item Name" required>
              <UInput v-model="editingItem.name" placeholder="Milk, Eggs..." class="w-full" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Amount">
                <UInput v-model="editingItem.amount" type="number" class="w-full" />
              </UFormField>
              <UFormField label="Unit">
                <UInput v-model="editingItem.unit" placeholder="kg, lit, pack..." class="w-full" />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Brand">
                <UInput v-model="editingItem.brand" placeholder="Brand name..." class="w-full" />
              </UFormField>
              <UFormField label="Last Price">
                <UInput
                  v-model="editingItem.lastPrice"
                  type="number"
                  step="0.01"
                  icon="i-lucide-dollar-sign"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Preferred Store">
                <USelect v-model="editingItem.storeId" :items="storeOptions" class="w-full" />
              </UFormField>
              <UFormField label="Stock Status">
                <USelect
                  v-model="editingItem.stockStatus"
                  :items="[
                            { label: 'In Stock', value: 'in-stock' },
                            { label: 'Low Stock', value: 'low' },
                            { label: 'Out of Stock', value: 'out-of-stock' }
                        ]"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3 p-4">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="isItemModalOpen = false"
            />
            <UButton
              :label="isEditing ? 'Save Changes' : 'Add Item'"
              color="primary"
              @click="saveItem"
            />
          </div>
        </template>
      </UModal>

      <!-- Store Management Modal -->
      <UModal v-model:open="isStoreModalOpen" title="Manage Stores">
        <template #body>
          <div class="space-y-6 p-4">
            <div class="flex items-center gap-2">
              <UInput
                v-model="newStoreInput"
                placeholder="Add new store (e.g. Costco, Walmart)..."
                class="flex-1"
                @keyup.enter="addStore"
              />
              <UButton label="Add Store" color="primary" variant="soft" @click="addStore" />
            </div>

            <div class="space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500">
                Existing Stores
              </h4>
              <div
                v-for="store in (groceries?.stores || [])"
                :key="store.id"
                class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <span class="font-medium">{{ store.name }}</span>
                <UButton
                  icon="i-lucide-trash"
                  color="error"
                  variant="ghost"
                  size="xs"
                  @click="deleteStore(store.id)"
                />
              </div>
              <div
                v-if="(groceries?.stores || []).length === 0"
                class="text-center py-4 text-gray-400 text-sm italic"
              >
                No stores added yet.
              </div>
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<style scoped>
.category-drag-handle {
    touch-action: none;
}
</style>
