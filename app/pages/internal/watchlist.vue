<script setup lang="ts">
import draggable from "vuedraggable";
import type { WatchlistData, WatchlistCategory, WatchlistItem } from "~~/server/db/schema"

definePageMeta({
    layout: "dashboard"
});

const toast = useToast();
const { data: watchlist, refresh } = await useApi<WatchlistData>("/api/watchlist");

// --- State ---
const sections = [
    { label: 'Movies', value: 'movies', icon: 'i-lucide-film' },
    { label: 'Series', value: 'series', icon: 'i-lucide-tv' },
    { label: 'Books', value: 'books', icon: 'i-lucide-book-open' }
];

type SectionKey = 'movies' | 'series' | 'books';

const newCategoryInput = ref<Record<SectionKey, string>>({
    movies: '',
    series: '',
    books: ''
});
const newItemTitle = ref<Record<string, string>>({});

// Modal for item details
const isItemModalOpen = ref(false);
const editingItem = ref<Partial<WatchlistItem> & { catId?: string; section?: SectionKey }>({});
const isEditing = ref(false);

// Local state for categories to support reordering
const localCategories = ref<Record<SectionKey, WatchlistCategory[]>>({
    movies: [],
    series: [],
    books: []
});

watch(
    watchlist,
    () => {
        if (watchlist.value) {
            localCategories.value.movies = JSON.parse(JSON.stringify(watchlist.value.movies || []));
            localCategories.value.series = JSON.parse(JSON.stringify(watchlist.value.series || []));
            localCategories.value.books = JSON.parse(JSON.stringify(watchlist.value.books || []));
        }
    },
    { immediate: true, deep: true }
);

// --- Actions ---

async function addCategory(section: SectionKey) {
    if (!newCategoryInput.value[section]) return;
    try {
        await $api("/api/watchlist", {
            method: "POST",
            body: {
                action: "addCategory",
                section,
                name: newCategoryInput.value[section]
            }
        });
        await refresh();
        newCategoryInput.value[section] = "";
        toast.add({ title: "Category added", color: "success" });
    } catch (e) {
        toast.add({ title: "Failed to add category", color: "error" });
    }
}

async function deleteCategory(section: SectionKey, catId: string) {
    try {
        await $api("/api/watchlist", {
            method: "POST",
            body: {
                action: "deleteCategory",
                section,
                catId
            }
        });
        await refresh();
        toast.add({ title: "Category deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete category", color: "error" });
    }
}

async function saveOrder(section: SectionKey) {
    try {
        await $api("/api/watchlist", {
            method: "POST",
            body: {
                action: "reorderCategories",
                section,
                categories: localCategories.value[section]
            }
        });
        // Update local cache to prevent flicker
        if (watchlist.value) {
            watchlist.value[section] = JSON.parse(JSON.stringify(localCategories.value[section]));
        }
    } catch (e) {
        await refresh();
        toast.add({ title: "Failed to save order", color: "error" });
    }
}

async function addItem(section: SectionKey, catId: string) {
    const title = newItemTitle.value[catId];
    if (!title) return;

    try {
        await $api("/api/watchlist", {
            method: "POST",
            body: {
                action: "addItem",
                section,
                catId,
                item: {
                    title,
                    status: 'planned'
                }
            }
        });
        await refresh();
        newItemTitle.value[catId] = "";
        toast.add({ title: "Item added", color: "success" });
    } catch (e) {
        toast.add({ title: "Failed to add item", color: "error" });
    }
}

async function deleteItem(section: SectionKey, catId: string, itemId: string) {
    try {
        await $api("/api/watchlist", {
            method: "POST",
            body: {
                action: "deleteItem",
                section,
                catId,
                itemId
            }
        });
        await refresh();
        toast.add({ title: "Item deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete item", color: "error" });
    }
}

function openEditModal(section: SectionKey, catId: string, item: WatchlistItem) {
    editingItem.value = JSON.parse(JSON.stringify({ ...item, catId, section }));
    isEditing.value = true;
    isItemModalOpen.value = true;
}

function openAddDetailedModal(section: SectionKey, catId: string) {
    editingItem.value = { catId, section, status: 'planned' };
    isEditing.value = false;
    isItemModalOpen.value = true;
}

async function saveItem() {
    if (!editingItem.value.title || !editingItem.value.catId || !editingItem.value.section) return;

    const { catId, section, id, ...itemData } = editingItem.value;

    try {
        if (isEditing.value && id) {
            await $api("/api/watchlist", {
                method: "POST",
                body: {
                    action: "updateItem",
                    section,
                    catId,
                    itemId: id,
                    item: itemData
                }
            });
            toast.add({ title: "Item updated" });
        } else {
            await $api("/api/watchlist", {
                method: "POST",
                body: {
                    action: "addItem",
                    section,
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

const statusOptions = [
    { label: 'Planned', value: 'planned' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Dropped', value: 'dropped' }
];

function getCategoryMenuItems(section: SectionKey, catId: string) {
    return [
        [{
            label: 'Delete Category',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deleteCategory(section, catId)
        }]
    ];
}

function getItemMenuItems(section: SectionKey, catId: string, item: WatchlistItem) {
    return [
        [{
            label: 'Edit Details',
            icon: 'i-lucide-edit-3',
            onSelect: () => openEditModal(section, catId, item)
        }],
        [{
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deleteItem(section, catId, item.id)
        }]
    ];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'planned': return 'neutral';
        case 'in-progress': return 'primary';
        case 'completed': return 'success';
        case 'dropped': return 'error';
        default: return 'neutral';
    }
};

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Watchlist">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="watchlist" class="space-y-12 pb-20">
          <!-- Loop through each section -->
          <div v-for="section in sections" :key="section.value" class="space-y-6">
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                      <UIcon :name="section.icon" class="w-6 h-6 text-primary-500" />
                      <h2 class="text-2xl font-bold">{{ section.label }}</h2>
                  </div>
                  <div class="flex items-center gap-2">
                      <UInput 
                          v-model="newCategoryInput[section.value]" 
                          placeholder="New Category..." 
                          size="sm" 
                          @keyup.enter="addCategory(section.value)" 
                      />
                      <UButton 
                          icon="i-lucide-plus" 
                          size="sm" 
                          @click="addCategory(section.value)" 
                      />
                  </div>
              </div>

              <!-- Categories Grid -->
              <draggable
                  v-model="localCategories[section.value]"
                  item-key="id"
                  handle=".category-drag-handle"
                  :animation="200"
                  @end="saveOrder(section.value)"
                  class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              >
                  <template #item="{ element: category }">
                      <UCard class="flex flex-col h-full group/card relative overflow-visible">
                          <template #header>
                              <div class="flex items-center justify-between">
                                  <div class="flex items-center gap-2">
                                      <div class="category-drag-handle cursor-move opacity-30 hover:opacity-100 transition-opacity">
                                          <UIcon name="i-lucide-grip-vertical" class="w-4 h-4" />
                                      </div>
                                      <h3 class="font-bold text-lg pointer-events-none">{{ category.name }}</h3>
                                  </div>
                                  <UDropdownMenu :items="getCategoryMenuItems(section.value, category.id)">
                                      <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" />
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
                                  group="items"
                                  @end="saveOrder(section.value)"
                                  class="min-h-10 space-y-2"
                              >
                                  <template #item="{ element: item }">
                                      <div class="group/item flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-primary-500/30 transition-all">
                                          <div class="flex items-center gap-3 overflow-hidden">
                                              <div class="item-drag-handle cursor-move opacity-0 group-hover/item:opacity-30 hover:opacity-100! transition-opacity">
                                                  <UIcon name="i-lucide-grip-vertical" class="w-3 h-3" />
                                              </div>
                                              <div class="flex flex-col overflow-hidden">
                                                  <span class="font-medium text-sm truncate">{{ item.title }}</span>
                                                  <div class="flex items-center gap-2 text-[10px] text-gray-500">
                                                      <UBadge :label="item.status" :color="getStatusColor(item.status)" size="xs" variant="soft" class="capitalize" />
                                                      <span v-if="item.director || item.author" class="truncate">• {{ item.director || item.author }}</span>
                                                      <span v-if="item.rating" class="flex items-center gap-0.5 text-yellow-500">
                                                          <UIcon name="i-lucide-star" class="w-2.5 h-2.5 fill-current" />
                                                          {{ item.rating }}
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>
                                          <UDropdownMenu :items="getItemMenuItems(section.value, category.id, item)">
                                              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" class="opacity-0 group-hover/item:opacity-100" />
                                          </UDropdownMenu>
                                      </div>
                                  </template>
                              </draggable>
                          </div>

                          <template #footer>
                              <div class="flex items-center gap-2">
                                  <UInput v-model="newItemTitle[category.id]" placeholder="Add quick item..." size="xs" class="flex-1" @keyup.enter="addItem(section.value, category.id)" />
                                  <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" @click="addItem(section.value, category.id)" />
                                  <UButton icon="i-lucide-file-text-plus" size="xs" color="neutral" variant="ghost" @click="openAddDetailedModal(section.value, category.id)" />
                              </div>
                          </template>
                      </UCard>
                  </template>
              </draggable>
          </div>
      </div>

      <!-- Item Detail Modal -->
      <UModal v-model="isItemModalOpen" :title="isEditing ? 'Edit Item' : 'Add Item'">
          <template #body>
            <div class="space-y-4">
                <UFormField label="Title" required>
                    <UInput v-model="editingItem.title" placeholder="Enter title..." />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Status">
                        <USelect v-model="editingItem.status" :items="statusOptions" />
                    </UFormField>
                    <UFormField label="Rating (1-10)">
                        <UInput v-model="editingItem.rating" type="number" min="0" max="10" />
                    </UFormField>
                </div>

                <div v-if="editingItem.section === 'movies' || editingItem.section === 'series'" class="grid grid-cols-2 gap-4">
                    <UFormField label="Director / Creator">
                        <UInput v-model="editingItem.director" placeholder="Name..." />
                    </UFormField>
                    <UFormField label="Genre">
                        <UInput v-model="editingItem.genre" placeholder="Action, Drama..." />
                    </UFormField>
                </div>

                <div v-if="editingItem.section === 'movies'" class="grid grid-cols-2 gap-4">
                    <UFormField label="Duration">
                        <UInput v-model="editingItem.duration" placeholder="e.g. 2h 15m" />
                    </UFormField>
                    <UFormField label="Release Year">
                        <UInput v-model="editingItem.year" type="number" />
                    </UFormField>
                </div>

                <div v-if="editingItem.section === 'series'" class="grid grid-cols-2 gap-4">
                    <UFormField label="Seasons">
                        <UInput v-model="editingItem.seasons" type="number" />
                    </UFormField>
                    <UFormField label="Episodes">
                        <UInput v-model="editingItem.episodes" type="number" />
                    </UFormField>
                </div>

                <div v-if="editingItem.section === 'books'" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Author">
                            <UInput v-model="editingItem.author" placeholder="Name..." />
                        </UFormField>
                        <UFormField label="Genre">
                            <UInput v-model="editingItem.genre" placeholder="Fantasy, Sci-Fi..." />
                        </UFormField>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Pages">
                            <UInput v-model="editingItem.pages" type="number" />
                        </UFormField>
                        <UFormField label="Publish Year">
                            <UInput v-model="editingItem.year" type="number" />
                        </UFormField>
                    </div>
                </div>

                <UFormField label="Notes">
                    <UTextarea v-model="editingItem.notes" placeholder="Write any thoughts..." />
                </UFormField>
            </div>
          </template>
          <template #footer>
              <div class="flex justify-end gap-3">
                  <UButton label="Cancel" color="neutral" variant="ghost" @click="isItemModalOpen = false" />
                  <UButton :label="isEditing ? 'Save Changes' : 'Add Item'" color="primary" @click="saveItem" />
              </div>
          </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<style scoped>
.category-drag-handle, .item-drag-handle {
    touch-action: none;
}
</style>
