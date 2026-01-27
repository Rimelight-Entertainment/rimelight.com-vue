<script setup lang="ts">
import draggable from 'vuedraggable'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const toast = useToast()
const boardId = route.params.id as string

// --- Data Fetching ---
const { data: board, refresh: refreshBoard, status } = await useAsyncData<any>(`project-board-${boardId}`, () => $api(`/api/projects/boards/${boardId}`))

// --- State ---
const localLists = ref<any[]>([])
const isAddListModalOpen = ref(false)
const isAddCardModalOpen = ref(false)
const selectedListId = ref<string | null>(null)
const selectedCard = ref<any>(null)
const isCardDetailModalOpen = ref(false)
const isFieldManagerOpen = ref(false)

const newListState = ref({ title: '' })
const newCardState = ref({ title: '', description: '' })

// Field Manager State
const newFieldState = ref<{
    name: string;
    type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'CHECKBOX' | 'URL';
    options: { label: string, value: string }[];
    optionsStr: string;
}>({
    name: '',
    type: 'TEXT',
    options: [],
    optionsStr: ''
})
const fieldTypes = ['TEXT', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'URL']

// --- Sync State ---
watch(() => board.value, (newBoard) => {
    if (newBoard) {
        localLists.value = JSON.parse(JSON.stringify(newBoard.lists))
    }
}, { immediate: true, deep: true })

// --- Actions ---

// Lists
async function createList() {
    try {
        await $api('/api/projects/lists', {
            method: 'POST',
            body: {
                boardId,
                title: newListState.value.title
            }
        })
        isAddListModalOpen.value = false
        newListState.value.title = ''
        refreshBoard()
    } catch (err) {
        toast.add({ title: 'Error creating list', color: 'error' })
    }
}

async function deleteList(id: string) {
    if(!confirm("Delete list and all its cards?")) return
     try {
        await $api(`/api/projects/lists/${id}`, {
            method: 'DELETE'
        })
        refreshBoard()
    } catch (err) {
        toast.add({ title: 'Error deleting list', color: 'error' })
    }
}

async function onListDrop() {
    // Save new order of lists
    await Promise.all(localLists.value.map((list, index) =>
        $api(`/api/projects/lists/${list.id}`, {
            method: 'PUT',
            body: { order: index }
        })
    ))
}

// Cards
function openAddCardModal(listId: string) {
    selectedListId.value = listId
    isAddCardModalOpen.value = true
}

async function createCard() {
    if (!selectedListId.value) return
    try {
        await $api('/api/projects/cards', {
            method: 'POST',
            body: {
                listId: selectedListId.value,
                title: newCardState.value.title,
                description: newCardState.value.description
            }
        })
        isAddCardModalOpen.value = false
        newCardState.value = { title: '', description: '' }
        selectedListId.value = null
        refreshBoard()
    } catch (err) {
        toast.add({ title: 'Error creating card', color: 'error' })
    }
}

function openCardDetail(card: any) {
    selectedCard.value = JSON.parse(JSON.stringify(card)) // Deep copy
    // Ensure customFields object exists
    if (!selectedCard.value.customFields) {
        selectedCard.value.customFields = {}
    }
    isCardDetailModalOpen.value = true
}

async function updateCard() {
     try {
        await $api(`/api/projects/cards/${selectedCard.value.id}`, {
            method: 'PUT',
            body: {
                title: selectedCard.value.title,
                description: selectedCard.value.description,
                customFields: selectedCard.value.customFields
            }
        })
        isCardDetailModalOpen.value = false
        refreshBoard()
        toast.add({ title: "Card updated" })
    } catch (err) {
        toast.add({ title: 'Error updating card', color: 'error' })
    }
}

async function deleteCard() {
    if(!confirm("Delete card?")) return
     try {
        await $api(`/api/projects/cards/${selectedCard.value.id}`, {
            method: 'DELETE'
        })
        isCardDetailModalOpen.value = false
        refreshBoard()
    } catch (err) {
        toast.add({ title: 'Error deleting card', color: 'error' })
    }
}

async function onCardDrop(event: any, listId: string) {
    if (event.added || event.moved) {
        // We need to save the state of the list that changed
        // Find the list in localLists
        const list = localLists.value.find(l => l.id === listId)
        if (!list) return

        // Update all cards in this list with their new order
        // And if added, update listId
        await Promise.all(list.cards.map((card: any, index: number) =>
            $api(`/api/projects/cards/${card.id}`, {
                method: 'PUT',
                body: {
                    listId: listId,
                    order: index
                }
            })
        ))
    }
}

// Custom Fields
async function createField() {
    try {
        await $api('/api/projects/fields', {
            method: 'POST',
            body: {
                boardId,
                name: newFieldState.value.name,
                type: newFieldState.value.type,
                options: newFieldState.value.type === 'SELECT' && newFieldState.value.optionsStr
                    ? newFieldState.value.optionsStr.split(',').map(s => ({ label: s.trim(), value: s.trim() }))
                    : []
            }
        })
        toast.add({ title: 'Field created' })
        newFieldState.value = { name: '', type: 'TEXT', options: [], optionsStr: '' }
        refreshBoard()
    } catch (err) {
        toast.add({ title: 'Error creating field', color: 'error' })
    }
}

async function deleteField(id: string) {
    if(!confirm("Delete field? Data will be hidden.")) return
     try {
        await $api(`/api/projects/fields/${id}`, {
            method: 'DELETE'
        })
        refreshBoard()
    } catch (err) {
        toast.add({ title: 'Error deleting field', color: 'error' })
    }
}
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <UDashboardNavbar
      v-if="board"
      :title="board.title"
      class="border-b border-gray-200 dark:border-gray-800"
    >
      <template #leading>
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          @click="navigateTo('/dashboard/projects')"
        />
        <UDashboardSidebarCollapse />
      </template>
      <template #right>
        <UButton
          label="Fields"
          icon="i-heroicons-table-cells"
          variant="soft"
          color="neutral"
          @click="isFieldManagerOpen = true"
        />
        <UButton label="Add List" icon="i-heroicons-plus" @click="isAddListModalOpen = true" />
      </template>
    </UDashboardNavbar>
    <UDashboardNavbar
      v-else
      title="Loading board..."
      class="border-b border-gray-200 dark:border-gray-800"
    >
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="flex-1 overflow-hidden relative">
      <!-- Added relative for positioning -->
      <div
        v-if="board"
        class="h-full overflow-x-auto bg-gray-50 dark:bg-gray-950/50 p-6 flex gap-6 items-start"
      >
        <draggable
          v-model="localLists"
          item-key="id"
          class="flex gap-6 h-full items-start"
          handle=".list-drag-handle"
          :animation="200"
          @end="onListDrop"
        >
          <template #item="{ element: list, index }">
            <div class="flex-none w-80 flex flex-col max-h-full group/list">
              <!-- List Header -->
              <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="[
                          index % 4 === 0 ? 'bg-blue-500' : 
                          index % 4 === 1 ? 'bg-purple-500' : 
                          index % 4 === 2 ? 'bg-orange-500' : 'bg-green-500'
                        ]"
                  />
                  <h3
                    class="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ list.title }}
                  </h3>
                  <span
                    class="text-xs font-medium text-gray-400 bg-gray-200/50 dark:bg-gray-800 px-1.5 py-0.5 rounded-md"
                    >{{ list.cards?.length || 0 }}</span
                  >
                </div>
                <div
                  class="flex items-center gap-1 opacity-0 group-hover/list:opacity-100 transition-opacity"
                >
                  <UIcon
                    name="i-heroicons-bars-2"
                    class="list-drag-handle cursor-move text-gray-400 hover:text-gray-600"
                  />
                  <UDropdownMenu
                    :items="[[{ label: 'Delete List', icon: 'i-heroicons-trash', color: 'error', onSelect: () => deleteList(list.id) }]]"
                  >
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-heroicons-ellipsis-horizontal"
                      size="xs"
                    />
                  </UDropdownMenu>
                </div>
              </div>

              <!-- Cards Container -->
              <div class="flex-1 overflow-y-auto space-y-3 min-h-[100px] pb-4 pr-1">
                <draggable
                  v-model="list.cards"
                  group="cards"
                  item-key="id"
                  ghost-class="opacity-50"
                  drag-class="rotate-1"
                  :animation="200"
                  @change="(e: any) => onCardDrop(e, list.id)"
                >
                  <template #item="{ element }">
                    <div
                      class="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary-500/30 transition-all group/card"
                      @click="openCardDetail(element)"
                    >
                      <div
                        class="text-[15px] font-medium text-gray-900 dark:text-white mb-1.5 leading-snug"
                      >
                        {{ element.title }}
                      </div>
                      <div
                        v-if="element.description"
                        class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3"
                      >
                        {{ element.description }}
                      </div>

                      <!-- Custom Fields Preview -->
                      <div
                        v-if="board.customFields && board.customFields.length > 0"
                        class="flex flex-wrap gap-1.5 mt-2"
                      >
                        <template v-for="field in (board.customFields as any[])" :key="field.id">
                          <div
                            v-if="element.customFields?.[field.id]"
                            class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                          >
                            <span class="opacity-50 uppercase text-[9px]">{{ field.name }}</span>
                            <span
                              >{{ (typeof element.customFields[field.id] === 'object' && element.customFields[field.id] !== null) ? (element.customFields[field.id].label || element.customFields[field.id].value) : element.customFields[field.id] }}</span
                            >
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </draggable>

                <!-- Inline Add Card -->
                <UButton
                  label="Add task"
                  icon="i-heroicons-plus"
                  color="neutral"
                  variant="ghost"
                  block
                  size="sm"
                  class="mt-2 text-gray-400 hover:text-primary-500 font-medium justify-start px-2 py-2 rounded-xl"
                  @click="openAddCardModal(list.id)"
                />
              </div>
            </div>
          </template>
        </draggable>

        <!-- Add List Column -->
        <div class="flex-none w-80">
          <UButton
            block
            color="neutral"
            variant="ghost"
            class="h-[120px] dashed border-2 border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col gap-2 group hover:border-primary-500/50 hover:bg-white dark:hover:bg-gray-900 transition-all text-gray-400 hover:text-primary-500"
            @click="isAddListModalOpen = true"
          >
            <UIcon
              name="i-heroicons-plus-circle"
              class="text-2xl group-hover:scale-110 transition-transform"
            />
            <span class="font-bold uppercase tracking-widest text-[11px]">Add another list</span>
          </UButton>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <UIcon name="i-heroicons-arrow-path" class="text-4xl text-primary-500 animate-spin" />
      </div>
    </div>

    <!-- Modals -->
    <UModal
      v-model:open="isAddListModalOpen"
      :ui="{ content: 'sm:max-w-md' }"
      title="Create New List"
    >
      <template #body>
        <div class="p-4">
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center text-blue-500"
            >
              <UIcon name="i-heroicons-list-bullet" class="text-2xl" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Create New List</h3>
              <p class="text-xs text-gray-500 uppercase tracking-tighter">Status column</p>
            </div>
          </div>

          <UForm :state="newListState" @submit="createList">
            <UFormField
              label="List Title"
              name="title"
              required
              help="e.g., In Progress, QA, Blocked"
            >
              <UInput
                v-model="newListState.title"
                placeholder="Enter status name..."
                size="xl"
                autofocus
              />
            </UFormField>
            <div class="flex justify-end gap-3 mt-10">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                size="lg"
                @click="isAddListModalOpen = false"
              />
              <UButton label="Add List" type="submit" size="lg" />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isAddCardModalOpen"
      :ui="{ content: 'sm:max-w-md' }"
      title="Create New Task"
    >
      <template #body>
        <div class="p-4">
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-2xl flex items-center justify-center text-primary-500"
            >
              <UIcon name="i-heroicons-plus-circle" class="text-2xl" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Create New Task</h3>
              <p class="text-xs text-gray-500 uppercase tracking-tighter">Adding to list</p>
            </div>
          </div>

          <UForm :state="newCardState" @submit="createCard">
            <div class="space-y-6">
              <UFormField label="Task Title" name="title" required>
                <UInput
                  v-model="newCardState.title"
                  placeholder="What needs to be done?"
                  size="lg"
                  autofocus
                />
              </UFormField>
              <UFormField label="Description" name="description">
                <UTextarea
                  v-model="newCardState.description"
                  placeholder="Add details..."
                  size="lg"
                  :rows="4"
                />
              </UFormField>
            </div>
            <div class="flex justify-end gap-3 mt-10">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                size="lg"
                @click="isAddCardModalOpen = false"
              />
              <UButton label="Create Task" type="submit" size="lg" />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isFieldManagerOpen"
      :ui="{ content: 'sm:max-w-lg' }"
      title="Custom Fields"
    >
      <template #body>
        <div class="p-4">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center text-purple-500"
              >
                <UIcon name="i-heroicons-table-cells" class="text-2xl" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Custom Fields</h3>
                <p class="text-xs text-gray-500">Manage metadata for your tasks</p>
              </div>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              @click="isFieldManagerOpen = false"
            />
          </div>

          <div class="space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-2">
            <div
              v-if="board?.customFields?.length === 0"
              class="text-center py-6 text-gray-400 text-sm italic"
            >
              No custom fields defined yet.
            </div>
            <div
              v-for="field in board?.customFields"
              :key="field.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-xs text-gray-500">
                  <UIcon
                    :name="field.type === 'TEXT' ? 'i-heroicons-document-text' : field.type === 'NUMBER' ? 'i-heroicons-variable' : 'i-heroicons-list-bullet'"
                  />
                </div>
                <div>
                  <div class="font-bold text-sm text-gray-900 dark:text-white">
                    {{ field.name }}
                  </div>
                  <div class="text-[10px] text-gray-500 uppercase tracking-widest">
                    {{ field.type }}
                  </div>
                </div>
              </div>
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="soft"
                size="xs"
                circular
                @click="deleteField(field.id)"
              />
            </div>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <h4 class="text-sm font-bold mb-4 uppercase tracking-widest text-gray-500 text-center">
              New Custom Field
            </h4>
            <div class="space-y-4">
              <UInput
                v-model="newFieldState.name"
                placeholder="Field Name (e.g., Priority)"
                size="lg"
              />
              <USelectMenu
                v-model="newFieldState.type"
                :items="fieldTypes"
                placeholder="Select Type"
                size="lg"
              />
              <UInput
                v-if="newFieldState.type === 'SELECT'"
                v-model="newFieldState.optionsStr"
                placeholder="Options (comma separated)"
                size="lg"
              />
              <UButton
                label="Add Field"
                block
                size="lg"
                @click="createField"
                :disabled="!newFieldState.name"
              />
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <USlideover
      v-model:open="isCardDetailModalOpen"
      :ui="{ content: 'max-w-xl' }"
      title="Task Detail"
    >
      <template #body>
        <div class="p-0 flex flex-col h-full bg-white dark:bg-gray-900" v-if="selectedCard">
          <!-- Slideover Header -->
          <div
            class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/50"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500"
              >
                <UIcon name="i-heroicons-check-circle" />
              </div>
              <span class="text-xs font-bold uppercase tracking-widest text-gray-500"
                >Task Detail</span
              >
            </div>
            <div class="flex items-center gap-1">
              <UButton
                label="Delete"
                color="error"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
                @click="deleteCard"
              />
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                @click="isCardDetailModalOpen = false"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-10 space-y-10">
            <!-- Title -->
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"
                >Title</label
              >
              <UInput
                v-model="selectedCard.title"
                variant="none"
                class="text-3xl font-black w-full p-0 h-auto"
                :ui="{ base: 'font-black' }"
                placeholder="Card Title"
              />
            </div>

            <!-- Description -->
            <div class="space-y-3">
              <div
                class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                <UIcon name="i-heroicons-bars-3-bottom-left" /> Description
              </div>
              <UTextarea
                v-model="selectedCard.description"
                placeholder="Add a more detailed description..."
                resize
                class="w-full"
                variant="none"
                :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 min-h-[150px] border-none focus:ring-2 focus:ring-primary-500/30 transition-all font-medium text-sm' }"
              />
            </div>

            <!-- Custom Fields -->
            <div
              v-if="board.customFields && board.customFields.length > 0"
              class="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800"
            >
              <div
                class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                <UIcon name="i-heroicons-table-cells" /> Custom Attributes
              </div>
              <div class="grid grid-cols-2 gap-8 px-2">
                <div v-for="field in board.customFields" :key="field.id" class="space-y-2">
                  <label
                    class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <UIcon
                      :name="field.type === 'SELECT' ? 'i-heroicons-list-bullet' : 'i-heroicons-tag'"
                    />
                    {{ field.name }}
                  </label>

                  <UInput
                    v-if="field.type === 'TEXT'"
                    v-model="selectedCard.customFields[field.id]"
                    size="md"
                    variant="subtle"
                  />
                  <UInput
                    v-else-if="field.type === 'NUMBER'"
                    type="number"
                    v-model="selectedCard.customFields[field.id]"
                    size="md"
                    variant="subtle"
                  />
                  <UCheckbox
                    v-else-if="field.type === 'CHECKBOX'"
                    v-model="selectedCard.customFields[field.id]"
                  />
                  <USelectMenu
                    v-else-if="field.type === 'SELECT'"
                    v-model="selectedCard.customFields[field.id]"
                    :items="field.options"
                    option-attribute="label"
                    value-attribute="value"
                    size="md"
                  />
                  <UInput
                    v-else
                    v-model="selectedCard.customFields[field.id]"
                    size="md"
                    variant="subtle"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="p-8 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-950/50"
          >
            <UButton
              label="Discard"
              color="neutral"
              variant="soft"
              size="lg"
              @click="isCardDetailModalOpen = false"
            />
            <UButton label="Save Changes" icon="i-heroicons-check" size="lg" @click="updateCard" />
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
