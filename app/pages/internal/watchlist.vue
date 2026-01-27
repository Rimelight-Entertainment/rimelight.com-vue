<script setup lang="ts">
import draggable from "vuedraggable";
import type { WatchlistCategory, WatchlistData, WatchlistItem } from "~~/server/db";

definePageMeta({
  layout: "dashboard",
});

const toast = useToast();
const { data: watchlist, refresh } = await useApi<WatchlistData>("/api/watchlist");

// --- Constants ---
type SectionKey = "movies" | "series" | "books"

const SECTIONS = [
  { label: "Movies", value: "movies", icon: "lucide:film" },
  { label: "Series", value: "series", icon: "lucide:tv" },
  { label: "Books", value: "books", icon: "lucide:book-open" },
] as const;

const STATUS_OPTIONS = [
  { label: "Planned", value: "planned" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Dropped", value: "dropped" },
]

const STATUS_COLORS: Record<string, any> = {
  planned: "neutral",
  "in-progress": "primary",
  completed: "success",
  dropped: "error",
}

// --- State ---
const localCategories = ref<Record<SectionKey, WatchlistCategory[]>>({
  movies: [],
  series: [],
  books: [],
});

const newCategoryInput = ref<Record<SectionKey, string>>({
  movies: "",
  series: "",
  books: "",
});

const newItemTitle = ref<Record<string, string>>({});

const modal = reactive({
  isOpen: false,
  isEditing: false,
  data: {} as Partial<WatchlistItem> & { catId?: string; section?: SectionKey },
})

// --- Computed ---
const archivedItemsBySection = computed(() => {
  return SECTIONS.reduce((acc, section) => {
    acc[section.value] = localCategories.value[section.value].map(cat => ({
      ...cat,
      items: cat.items.filter(i => i.completed)
    })).filter(cat => cat.items.length > 0);
    return acc;
  }, {} as Record<SectionKey, WatchlistCategory[]>);
});

const hasArchivedItems = computed(() =>
    Object.values(archivedItemsBySection.value).some(cats => cats.length > 0)
);

// --- Watchers ---
watch(
    watchlist,
    (next) => {
      if (next) {
        localCategories.value = structuredClone({
          movies: next.movies ?? [],
          series: next.series ?? [],
          books: next.books ?? [],
        });
      }
    },
    { immediate: true, deep: true },
)

// --- Core Logic ---
async function performAction(
    action: string,
    section: SectionKey,
    payload: object = {},
    successMsg?: string
) {
  try {
    await $api("/api/watchlist", {
      method: "POST",
      body: { action, section, ...payload },
    });
    await refresh();
    if (successMsg) toast.add({ title: successMsg, color: "success" });
    return true;
  } catch (e) {
    toast.add({ title: `Error: ${action}`, color: "error" });
    return false;
  }
}

// --- Handlers ---
const addCategory = async (section: SectionKey) => {
  const name = newCategoryInput.value[section]?.trim();
  if (!name) return;

  if (await performAction("addCategory", section, { name }, "Category added")) {
    newCategoryInput.value[section] = "";
  }
};

const handleAddAction = (section: SectionKey, catId: string) => {
  const title = newItemTitle.value[catId]?.trim();
  if (title) {
    performAction("addItem", section, { catId, item: { title, status: "planned" } }, "Item added");
    newItemTitle.value[catId] = "";
  } else {
    openModal(section, catId);
  }
};

function openModal(section: SectionKey, catId: string, item?: WatchlistItem) {
  modal.isEditing = !!item;
  modal.data = item ? structuredClone({ ...item, catId, section }) : { catId, section, status: "planned" };
  modal.isOpen = true;
}

const toggleItem = (section: SectionKey, catId: string, item: WatchlistItem) => {
  const completed = !item.completed;
  performAction(
      "updateItem",
      section,
      {
        catId,
        itemId: item.id,
        item: {
          completed,
          status: completed ? "completed" : item.status === "completed" ? "planned" : item.status,
        },
      },
      completed ? "Archived" : "Restored"
  );
};

async function saveItem() {
  const { catId, section, id, ...rawData } = modal.data;
  if (!catId || !section) return;

  const cleanItem = Object.fromEntries(Object.entries(rawData).map(([k, v]) => [k, v === "" ? null : v]));

  const success = await performAction(
      modal.isEditing ? "updateItem" : "addItem",
      section,
      { catId, itemId: id, item: cleanItem },
      `Item ${modal.isEditing ? "updated" : "added"}`,
  );

  if (success) modal.isOpen = false;
}

const saveOrder = (section: SectionKey) => performAction("reorderCategories", section, { categories: localCategories.value[section] });

// --- UI Helpers ---
const getCategoryMenuItems = (section: SectionKey, catId: string) => [
  [
    {
      label: "Delete Category",
      icon: "lucide:trash",
      color: "error" as const,
      onSelect: () => performAction("deleteCategory", section, { catId }, "Category deleted"),
    },
  ],
];

const getItemMenuItems = (section: SectionKey, catId: string, item: WatchlistItem) => [
  [
    {
      label: "Edit Details",
      icon: "lucide:edit-3",
      onSelect: () => openModal(section, catId, item),
    },
  ],
  [
    {
      label: "Delete",
      icon: "lucide:trash",
      color: "error" as const,
      onSelect: () => performAction("deleteItem", section, { catId, itemId: item.id }, "Item deleted"),
    },
  ],
]

const getStatusLabel = (status: string) =>
    STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Watchlist" />
    </template>

    <template #body>
      <div v-if="watchlist" class="flex flex-col gap-xl">
        <div v-for="section in SECTIONS" :key="section.value" class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-md">
              <UIcon :name="section.icon" class="w-6 h-6 text-primary-500" />
              <h2 class="text-2xl font-bold">{{ section.label }}</h2>
            </div>
            <div class="flex items-center gap-sm">
              <UInput
                v-model="newCategoryInput[section.value]"
                placeholder="New Category..."
                size="sm"
                @keyup.enter="addCategory(section.value)"
              />
              <UButton icon="lucide:plus" size="sm" @click="addCategory(section.value)" />
            </div>
          </div>

          <draggable
            v-model="localCategories[section.value]"
            item-key="id"
            handle=".category-drag-handle"
            :animation="200"
            @end="saveOrder(section.value)"
            class="grid gap-lg sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          >
            <template #item="{ element: category }">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-sm">
                      <div
                        class="category-drag-handle cursor-move opacity-30 hover:opacity-100 transition-opacity"
                      >
                        <UIcon name="lucide:grip-vertical" class="w-4 h-4" />
                      </div>
                      <h3 class="font-bold text-lg">{{ category.name }}</h3>
                    </div>
                    <UDropdownMenu :items="getCategoryMenuItems(section.value, category.id)">
                      <UButton
                        icon="lucide:ellipsis-vertical"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                      />
                    </UDropdownMenu>
                  </div>
                </template>

                <div class="flex flex-col gap-sm">
                  <draggable
                    v-model="category.items"
                    item-key="id"
                    handle=".item-drag-handle"
                    :animation="200"
                    group="items"
                    @end="saveOrder(section.value)"
                    class="min-h-12 flex flex-col gap-xs"
                  >
                    <template #item="{ element: item }">
                      <div v-if="!item.completed" class="group/item flex items-start gap-xs">
                        <UDropdownMenu :items="getItemMenuItems(section.value, category.id, item)">
                          <UButton
                            variant="ghost"
                            icon="lucide:grip-vertical"
                            class="item-drag-handle cursor-grab active:cursor-grabbing transition-colors"
                          />
                        </UDropdownMenu>

                        <div
                          class="flex-1 flex items-start justify-between p-sm rounded-lg bg-dimmed border border-transparent hover:border-primary-500/30 transition-all font-medium"
                        >
                          <div class="flex items-start gap-md flex-1">
                            <UCheckbox
                              :model-value="item.completed"
                              @update:model-value="toggleItem(section.value, category.id, item)"
                            />

                            <div class="flex flex-1 justify-between items-start gap-md">
                              <div class="flex flex-col">
                                <h6 class="text-sm">{{ item.title }}</h6>
                                <span
                                  v-if="item.director || item.author"
                                  class="text-xs text-muted"
                                >
                                  {{ item.director || item.author }}
                                </span>

                                <div class="flex flex-col">
                                  <span
                                    v-if="item.recommendedBy"
                                    class="flex items-center gap-xs text-[10px] text-primary-500"
                                  >
                                    <UIcon
                                      name="lucide:user"
                                      class="w-2.5 h-2.5"
                                    />
                                    <span>{{ item.recommendedBy }}</span>
                                  </span>

                                  <span v-if="item.rating" class="flex items-center gap-xs text-[10px] text-yellow-500">
                                    <UIcon name="lucide:star" class="w-2.5 h-2.5 fill-current" />
                                    {{ item.rating }}
                                  </span>
                                </div>
                              </div>

                              <UBadge
                                :label="getStatusLabel(item.status)"
                                :color="STATUS_COLORS[item.status] || 'neutral'"
                                size="xs"
                                variant="soft"
                                class="capitalize"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </draggable>

                  <div class="flex justify-end gap-xs pt-2">
                    <UButton
                      icon="lucide:plus"
                      label="Add Item"
                      size="xs"
                      variant="subtle"
                      @click="handleAddAction(section.value, category.id)"
                    />
                  </div>
                </div>
              </UCard>
            </template>
          </draggable>
        </div>
      </div>

      <UAccordion :items="[{ label: 'Archived Bin', icon: 'lucide:archive' }]">
        <template #content>
          <div class="flex flex-col p-md gap-xl">
            <template v-for="section in SECTIONS" :key="section.value">
              <div v-if="archivedItemsBySection[section.value].length > 0" class="space-y-6">
                <div class="flex items-center gap-md">
                  <UIcon :name="section.icon" class="w-5 h-5 text-muted" />
                  <h5 class="text-muted">{{ section.label }}</h5>
                </div>

                <div class="grid gap-lg sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  <template
                    v-for="category in archivedItemsBySection[section.value]"
                    :key="category.id"
                  >
                    <div
                      v-for="item in category.items"
                      :key="item.id"
                      class="group/item flex items-start gap-xs opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <UDropdownMenu :items="getItemMenuItems(section.value, category.id, item)">
                        <UButton variant="ghost" icon="lucide:ellipsis-vertical" size="xs" />
                      </UDropdownMenu>

                      <div
                        class="flex-1 flex items-start justify-between p-sm rounded-lg bg-dimmed border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                      >
                        <div class="flex items-start gap-md flex-1">
                          <UCheckbox
                            :model-value="item.completed"
                            @update:model-value="toggleItem(section.value, category.id, item)"
                          />

                          <div class="flex flex-1 justify-between items-start gap-md">
                            <div class="flex flex-col">
                              <h5 class="line-through text-muted text-sm">{{ item.title }}</h5>
                              <span v-if="item.director || item.author" class="text-xs text-muted">
                                {{ item.director || item.author }}
                              </span>

                              <div class="flex flex-col">
                                <span class="text-[10px] font-medium text-muted">
                                  In: {{ category.name }}
                                </span>

                                <span
                                  v-if="item.recommendedBy"
                                  class="flex items-center gap-xs text-[10px] text-primary-500/50"
                                >
                                  <UIcon
                                    name="lucide:user"
                                    class="w-2.5 h-2.5"
                                  />
                                  <span>{{ item.recommendedBy }}</span>
                                </span>

                                <span v-if="item.rating" class="flex items-center gap-xs text-[10px] text-yellow-500/50">
                                  <UIcon name="lucide:star" class="w-2.5 h-2.5 fill-current" />
                                  {{ item.rating }}
                                </span>
                              </div>
                            </div>

                            <div class="flex flex-col items-end gap-xs">
                              <UBadge
                                :label="getStatusLabel(item.status)"
                                :color="STATUS_COLORS[item.status] || 'neutral'"
                                size="xs"
                                variant="soft"
                                class="capitalize"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>

            <div v-if="!hasArchivedItems" class="py-12 text-center text-gray-400">
              <UIcon name="lucide:archive-x" class="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p class="text-sm">No archived items yet</p>
            </div>
          </div>
        </template>
      </UAccordion>

      <UModal v-model:open="modal.isOpen" :title="modal.isEditing ? 'Edit Item' : 'Add Item'">
        <template #body>
          <div class="flex flex-col gap-sm p-4">
            <UFormField label="Title" required>
              <UInput v-model="modal.data.title" placeholder="Enter title..." class="w-full" />
            </UFormField>

            <div class="grid grid-cols-2 gap-sm">
              <UFormField label="Status">
                 <USelectMenu
                   v-model="modal.data.status"
                   :items="STATUS_OPTIONS"
                   value-attribute="value"
                   class="w-full"
                 />
              </UFormField>
              <UFormField label="Rating (1-10)">
                <UInput
                  v-model.number="modal.data.rating"
                  type="number"
                  min="0"
                  max="10"
                  class="w-full"
                />
              </UFormField>
            </div>

            <template v-if="modal.data.section !== 'books'">
              <div class="grid grid-cols-2 gap-sm">
                <UFormField label="Director / Creator">
                  <UInput v-model="modal.data.director" placeholder="Name..." class="w-full" />
                </UFormField>
                <UFormField label="Genre">
                  <UInput
                    v-model="modal.data.genre"
                    placeholder="Action, Drama..."
                    class="w-full"
                  />
                </UFormField>
              </div>
            </template>

            <div v-if="modal.data.section === 'movies'" class="grid grid-cols-2 gap-sm">
              <UFormField label="Duration">
                <UInput v-model="modal.data.duration" placeholder="e.g. 159m" class="w-full" />
              </UFormField>
              <UFormField label="Release Year">
                <UInput v-model.number="modal.data.year" type="number" class="w-full" />
              </UFormField>
            </div>

            <div v-if="modal.data.section === 'series'" class="grid grid-cols-2 gap-sm">
              <UFormField label="Seasons">
                <UInput v-model.number="modal.data.seasons" type="number" class="w-full" />
              </UFormField>
              <UFormField label="Episodes">
                <UInput v-model.number="modal.data.episodes" type="number" class="w-full" />
              </UFormField>
            </div>

            <div v-if="modal.data.section === 'books'" class="flex flex-col gap-sm">
              <div class="grid grid-cols-2 gap-sm">
                <UFormField label="Author">
                  <UInput v-model="modal.data.author" placeholder="Name..." class="w-full" />
                </UFormField>
                <UFormField label="Genre">
                  <UInput
                    v-model="modal.data.genre"
                    placeholder="Fantasy, Sci-Fi..."
                    class="w-full"
                  />
                </UFormField>
              </div>
              <div class="grid grid-cols-2 gap-sm">
                <UFormField label="Pages">
                  <UInput v-model.number="modal.data.pages" type="number" class="w-full" />
                </UFormField>
                <UFormField label="Publish Year">
                  <UInput v-model.number="modal.data.year" type="number" class="w-full" />
                </UFormField>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-sm">
              <UFormField label="Notes">
                <UTextarea
                  v-model="modal.data.notes"
                  placeholder="Write any thoughts..."
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Recommended By">
                <UInput
                  v-model="modal.data.recommendedBy"
                  placeholder="Friend, Colleague..."
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="flex justify-end gap-sm mt-4">
              <UButton label="Cancel" color="neutral" variant="ghost" @click="modal.isOpen = false" />
              <UButton
                :label="modal.isEditing ? 'Save Changes' : 'Add Item'"
                color="primary"
                @click="saveItem"
              />
            </div>
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
