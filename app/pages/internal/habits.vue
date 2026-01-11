<script setup lang="ts">
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import draggable from "vuedraggable";
import type { HabitTrackerData, HabitCategory } from "~~/server/db/schema"

definePageMeta({
  layout: "dashboard"
});

const toast = useToast();

const { data: tracker, refresh } = await useApi<HabitTrackerData>("/api/habits");

// --- State ---
const selectedYearIndex = ref(0);
const selectedMonthIndex = ref(new Date().getMonth());
const newYearInput = ref("");
const newCategoryInput = ref("");
const newHabitInputs = ref<Record<string, string>>({});

// --- Computed ---
// Sort years ascending
const years = computed(() => {
    if (!tracker.value?.years) return [];
    return [...tracker.value.years].sort((a, b) => a.year - b.year);
});

// Auto-select current year on load if not set
watch(years, (newYears) => {
  if (newYears.length > 0) {
    const currentYearNum = new Date().getFullYear();
    const idx = newYears.findIndex(y => y.year === currentYearNum);

    nextTick(() => {
      if (idx !== -1) {
        selectedYearIndex.value = idx;
      } else if (selectedYearIndex.value >= newYears.length) {
        selectedYearIndex.value = 0;
      }
    });
  }
}, { immediate: true, deep: true })

const currentYear = computed(() => years.value[selectedYearIndex.value]);

const yearItems = computed(() => {
  return years.value.map((y, index) => ({
    label: String(y.year),
    year: y.year,
    value: index
  }));
});

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
].map((m, i) => ({
  label: m,
  value: i
}));

const daysInMonth = computed(() => {
    if (!currentYear.value) return [];
    const yearNum = currentYear.value.year;
    const monthNum = selectedMonthIndex.value;
    const start = startOfMonth(new Date(yearNum, monthNum));
    const end = endOfMonth(new Date(yearNum, monthNum));
    return eachDayOfInterval({ start, end });
});

// Local state for categories to support reordering
const localCategories = ref<HabitCategory[]>([]);

watch(
    () => currentYear.value?.categories,
    (newCats) => {
      if (newCats) {
        localCategories.value = JSON.parse(JSON.stringify(newCats));
      } else {
        localCategories.value = [];
      }
    },
    { immediate: true, deep: true }
);

// --- Actions ---
async function addYear(yearStr: string) {
    const year = parseInt(yearStr);
    if (!year || isNaN(year)) return;
    
    try {
        await $api("/api/habits", {
            method: "POST",
            body: { action: "addYear", year }
        });
        await refresh();
        toast.add({ title: "Year added" });
        newYearInput.value = "";
        nextTick(() => {
             const newIndex = years.value.findIndex(y => y.year === year);
             if (newIndex !== -1) selectedYearIndex.value = newIndex;
        });
    } catch (e) {
        toast.add({ title: "Failed to add year", color: "error" });
    }
}

async function addCategory(name: string) {
    if (!currentYear.value || !name) return;
    
    const yearNum = currentYear.value.year;
    try {
        await $api("/api/habits", {
            method: "POST",
            body: { 
                action: "addCategory", 
                year: yearNum,
                name 
            }
        });
        await refresh();
        toast.add({ title: "Category added" });
        newCategoryInput.value = "";
    } catch (e) {
        toast.add({ title: "Failed to add category", color: "error" });
    }
}

async function deleteCategory(catId: string) {
    if (!currentYear.value) return;
    const yearNum = currentYear.value.year;

    try {
        await $api("/api/habits", {
            method: "POST",
            body: {
                action: "deleteCategory",
                year: yearNum,
                catId
            }
        });
        await refresh();
        toast.add({ title: "Category deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete category", color: "error" });
    }
}

async function saveAllCategories() {
  if (!tracker.value || !currentYear.value) return;

  try {
    await $api("/api/habits", {
      method: "POST",
      body: {
        action: "reorderCategories",
        year: currentYear.value.year,
        categories: localCategories.value
      }
    });
    // Sync back to tracker to maintain reactivity without flicker
    const yearIdx = tracker.value.years.findIndex(y => y.year === currentYear.value!.year);
    if (yearIdx !== -1) {
        tracker.value.years[yearIdx]!.categories = JSON.parse(JSON.stringify(localCategories.value));
    }
  } catch (e) {
    await refresh();
    toast.add({ title: "Failed to save order", color: "error" });
  }
}

async function addHabit(catId: string, name: string) {
    if (!currentYear.value || !name) return;
    
    const yearNum = currentYear.value.year;
    try {
        await $api("/api/habits", {
            method: "POST",
            body: { 
                action: "addHabit", 
                year: yearNum,
                catId,
                name 
            }
        });
        await refresh();
        toast.add({ title: "Habit added" });
        newHabitInputs.value[catId] = "";
    } catch (e) {
        toast.add({ title: "Failed to add habit", color: "error" });
    }
}

async function deleteHabit(catId: string, habitId: string) {
    if (!currentYear.value) return;
    const yearNum = currentYear.value.year;

    try {
        await $api("/api/habits", {
             method: "POST",
             body: {
                 action: "deleteHabit",
                 year: yearNum,
                 catId,
                 habitId
             }
        });
        await refresh();
        toast.add({ title: "Habit deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete habit", color: "error" });
    }
}

async function toggleDate(catId: string, habitId: string, date: Date) {
    if (!tracker.value || !currentYear.value) return;
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Optimistic update - update localCategories which is what the UI renders
    const cat = localCategories.value.find(c => c.id === catId);
    if (cat) {
        const habit = cat.habits.find(h => h.id === habitId);
        if (habit) {
            const idx = habit.completedDates.indexOf(dateStr);
            if (idx > -1) {
                habit.completedDates.splice(idx, 1);
            } else {
                habit.completedDates.push(dateStr);
            }
        }
    }

    try {
        await $api("/api/habits", {
            method: "POST",
            body: {
                action: "toggleDate",
                year: currentYear.value.year,
                catId,
                habitId,
                date: dateStr
            }
        });
        // Sync the change back to tracker.value to keep it in sync
        const rawYear = tracker.value.years.find(y => y.year === currentYear.value!.year);
        if (rawYear) {
            const rawCat = rawYear.categories.find(c => c.id === catId);
            if (rawCat) {
                const rawHabit = rawCat.habits.find(h => h.id === habitId);
                if (rawHabit) {
                    const idx = rawHabit.completedDates.indexOf(dateStr);
                    if (idx > -1) {
                        rawHabit.completedDates.splice(idx, 1);
                    } else {
                        rawHabit.completedDates.push(dateStr);
                    }
                }
            }
        }
    } catch (e) {
        await refresh();
        toast.add({ title: "Failed to update", color: "error" });
    }
}

// Handlers
function handleAddYear() {
    addYear(newYearInput.value);
}

function handleAddCategory() {
    addCategory(newCategoryInput.value);
}

function handleAddHabit(catId: string) {
    addHabit(catId, newHabitInputs.value[catId] || "");
}

function getHabitMenuItems(catId: string, habitId: string) {
    return [
        [{
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deleteHabit(catId, habitId)
        }]
    ];
}

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

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Habits">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6">
          <!-- Top Bar: Years + Add Year -->
          <div class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 justify-between">
              <div class="flex-1 overflow-x-auto">
                <UTabs
                    v-if="yearItems.length"
                    :key="`years-${yearItems.length}`"
                    v-model="selectedYearIndex"
                    :default-value="selectedYearIndex"
                    :items="yearItems"
                />
                 <div v-else class="text-sm text-gray-500 py-2">No years tracked yet. Add one to start.</div>
              </div>
              
              <div class="flex items-center gap-2">
                  <UInput v-model="newYearInput" placeholder="Year (e.g. 2026)" type="number" class="w-32" @keyup.enter="handleAddYear" />
                  <UButton icon="i-lucide-plus" color="neutral" variant="ghost" @click="handleAddYear" />
              </div>
          </div>

          <div v-if="currentYear" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <!-- Month Tabs -->
              <div class="mb-6">
                <UTabs
                    v-model="selectedMonthIndex"
                    :items="months"
                    :key="`months-${currentYear.year}`"
                />
              </div>

              <!-- Habits Tracker -->
              <div class="space-y-8">
                   <!-- Header Row with Days -->
                   <div class="flex items-center sticky top-0 bg-white dark:bg-gray-900 z-10 py-2 border-b border-gray-100 dark:border-gray-800">
                       <div class="w-48 shrink-0 font-semibold text-xs uppercase tracking-wider text-gray-500">Habit</div>
                       <div class="flex flex-1 gap-1 overflow-x-auto pb-2 scrollbar-thin">
                           <div v-for="day in daysInMonth" :key="day.toString()" class="w-6 shrink-0 text-center text-[10px] text-gray-500 flex flex-col items-center">
                               <span>{{ format(day, "d") }}</span>
                               <span class="text-[8px] opacity-70 uppercase">{{ format(day, "eee")[0] }}</span>
                           </div>
                       </div>
                   </div>

                   <!-- Categories Loop -->
                   <draggable
                       v-model="localCategories"
                       item-key="id"
                       handle=".category-drag-handle"
                       :animation="200"
                       @end="saveAllCategories"
                       class="space-y-8"
                   >
                     <template #item="{ element: category }">
                       <div class="space-y-4">
                         <!-- Category Header -->
                         <div class="flex items-center group/cat pr-4">
                           <div class="category-drag-handle cursor-move opacity-0 group-hover/cat:opacity-50 hover:opacity-100! -ml-1 pr-1">
                             <UIcon name="i-lucide-grip-vertical" class="w-4 h-4 text-gray-400" />
                           </div>
                           <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex-1">{{ category.name }}</h3>
                           
                            <UDropdownMenu :items="getCategoryMenuItems(category.id)">
                              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" class="opacity-0 group-hover/cat:opacity-100 transition-opacity" />
                            </UDropdownMenu>
                         </div>

                         <!-- Habit Rows -->
                         <draggable
                             v-model="category.habits"
                             item-key="id"
                             handle=".habit-drag-handle"
                             :animation="200"
                             group="habits"
                             @end="saveAllCategories"
                             class="min-h-2 space-y-0"
                         >
                           <template #item="{ element: habit }">
                             <div class="flex items-center border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group pt-2 first:pt-0">
                               <div class="w-48 shrink-0 truncate pr-4 text-sm font-medium flex items-center justify-between gap-2">
                                 <div class="habit-drag-handle cursor-move opacity-0 group-hover:opacity-50 hover:opacity-100! -ml-1 pr-1">
                                   <UIcon name="i-lucide-grip-vertical" class="w-4 h-4 text-gray-400" />
                                 </div>

                                 <span :title="habit.name" class="truncate flex-1">{{ habit.name }}</span>

                                 <UDropdownMenu :items="getHabitMenuItems(category.id, habit.id)">
                                   <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" class="opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </UDropdownMenu>
                               </div>

                               <div class="flex flex-1 gap-1 overflow-x-auto scrollbar-thin">
                                 <div v-for="day in daysInMonth" :key="day.toString()" class="w-6 shrink-0 flex justify-center h-6 items-center">
                                   <UCheckbox
                                       :model-value="habit.completedDates.includes(format(day, 'yyyy-MM-dd'))"
                                       @update:model-value="toggleDate(category.id, habit.id, day)"
                                   />
                                 </div>
                               </div>
                             </div>
                           </template>
                         </draggable>

                         <!-- Add Habit to Category -->
                         <div class="flex items-center gap-2 max-w-sm ml-6 opacity-50 focus-within:opacity-100 transition-opacity">
                             <UInput v-model="newHabitInputs[category.id]" :placeholder="`Add habit to ${category.name}...`" size="xs" class="flex-1" @keyup.enter="handleAddHabit(category.id)" />
                             <UButton label="Add" icon="i-lucide-plus" color="neutral" size="xs" variant="ghost" @click="handleAddHabit(category.id)" />
                         </div>
                       </div>
                     </template>
                   </draggable>

                   <!-- Add Category -->
                   <div class="flex items-center gap-2 mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                       <UInput v-model="newCategoryInput" placeholder="New Category (e.g. Fitness, Work)..." class="w-64" @keyup.enter="handleAddCategory" />
                       <UButton label="Add Category" icon="i-lucide-plus" color="neutral" variant="soft" @click="handleAddCategory" />
                   </div>
              </div>
          </div>
          
      </div>
    </template>
  </UDashboardPanel>
</template>
