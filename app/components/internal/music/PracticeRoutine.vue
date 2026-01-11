<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import draggable from "vuedraggable";
import type { RoutineCategory } from "~~/server/db/schema/music/music";

const props = defineProps<{
  initialData: RoutineCategory[];
  section: "piano" | "dj" | "guitar";
}>();

const emit = defineEmits<{
  (e: "update", data: RoutineCategory[]): void;
}>();

const categories = ref<RoutineCategory[]>([]);
// Local state for checkboxes - not persisted to DB
const checkedItems = ref<Set<string>>(new Set());

// Sync prop
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        categories.value = JSON.parse(JSON.stringify(newVal));
    }
}, { immediate: true, deep: true });

function updateParent() {
    emit("update", categories.value);
}

// Actions
function addCategory() {
    categories.value.push({
        id: uuidv4(),
        name: "",
        items: []
    });
    updateParent();
}

function removeCategory(catId: string) {
    categories.value = categories.value.filter(c => c.id !== catId);
    updateParent();
}

function updateCategoryName(catId: string, name: string) {
    const cat = categories.value.find(c => c.id === catId);
    if (cat) {
        cat.name = name;
        updateParent();
    }
}

function addItem(catId: string) {
    const cat = categories.value.find(c => c.id === catId);
    if (cat) {
        cat.items.push({
            id: uuidv4(),
            name: ""
        });
        updateParent();
    }
}

function removeItem(catId: string, itemId: string) {
    const cat = categories.value.find(c => c.id === catId);
    if (cat) {
        cat.items = cat.items.filter(i => i.id !== itemId);
        updateParent();
    }
}

function updateItemName(catId: string, itemId: string, name: string) {
    const cat = categories.value.find(c => c.id === catId);
    if (cat) {
        const item = cat.items.find(i => i.id === itemId);
        if (item) {
            item.name = name;
            updateParent();
        }
    }
}

function toggleCheck(itemId: string) {
    if (checkedItems.value.has(itemId)) {
        checkedItems.value.delete(itemId);
    } else {
        checkedItems.value.add(itemId);
    }
}
</script>

<template>
  <div class="flex flex-col gap-xl">
    <div class="flex flex-col gap-sm">
      <div class="flex items-center justify-between">
        <h3>Practice Routine</h3>
      </div>

      <USeparator />
    </div>

    <UEmpty v-if="categories.length === 0" title="No routine categories yet." description="Add one to get started." :actions="[ { icon: 'lucide:plus', label: 'Add Category', onClick: addCategory }]"/>

    <template v-else>
      <draggable 
          v-model="categories" 
          item-key="id" 
          handle=".category-drag-handle"
          :animation="200"
          @end="updateParent"
          class="flex flex-col gap-lg"
      >
          <template #item="{ element: category }">
              <UCard variant="soft" :ui="{ body: 'flex flex-col gap-md' }">
                <!-- Category Header -->
                <div class="flex items-center group">
                    <UButton size="sm" variant="ghost" icon="lucide:grip-vertical" class="category-drag-handle" />

                    <UInput 
                        v-model="category.name" 
                        variant="none" 
                        placeholder="Category Name"
                        class="w-full"
                        @blur="updateParent"
                        @keyup.enter="updateParent"
                    />

                    <UButton icon="i-lucide-trash" color="error" variant="ghost" size="xs" class="opacity-0 group-hover:opacity-100 transition-opacity" @click="removeCategory(category.id)" />
                </div>

                <!-- Items -->
                <draggable 
                    v-model="category.items" 
                    item-key="id" 
                    handle=".drag-handle"
                    :animation="200"
                    group="routine-items"
                    @end="updateParent"
                    class="flex flex-col gap-sm"
                >
                    <template #item="{ element: item }">
                        <div class="flex items-center gap-sm p-sm group bg-dimmed border border-muted rounded-lg">
                            <UButton size="sm" variant="ghost" icon="lucide:grip-vertical" class="drag-handle opacity-0 group-hover:opacity-100 transition-opacity" />

                            <UCheckbox 
                                :model-value="checkedItems.has(item.id)" 
                                @update:model-value="toggleCheck(item.id)"
                            />
                            
                            <UInput 
                                v-model="item.name" 
                                variant="none"
                                size="sm"
                                class="w-full"
                                :class="{ 'line-through opacity-50 text-muted': checkedItems.has(item.id) }"
                                @blur="updateParent"
                                @keyup.enter="updateParent"
                            />
                             <UButton icon="i-lucide-trash" color="error" variant="ghost" size="xs" class="opacity-0 group-hover:opacity-100 transition-opacity" @click="removeItem(category.id, item.id)" />
                        </div>
                    </template>
                </draggable>

                <div class="flex justify-start">
                    <UButton icon="lucide:plus" size="sm" variant="ghost" label="Add Item" @click="addItem(category.id)" />
                </div>
              </UCard>
          </template>
      </draggable>

      <div class="flex justify-start">
        <UButton icon="lucide:plus" size="sm" color="neutral" variant="soft" label="Add Category" @click="addCategory" />
      </div>
    </template>
  </div>
</template>
