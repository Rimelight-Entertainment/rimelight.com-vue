<script setup lang="ts">
import type { Note } from "~~/server/db/schema"

const { data: notes, refresh: refreshNotes } =
  await useApi<Note[]>("/api/notes")
const { data: labels } = await useApi<any[]>("/api/notes/labels")

const selectedLabelId = ref<string | undefined>(undefined)

watch(selectedLabelId, (newId) => {
  console.log("Selected Label ID changed to:", newId)
})

const filterOptions = computed(() => {
  const allNotesOption = {
    id: undefined,
    name: "All Notes",
    icon: "lucide:list-filter"
  }

  const labelOptions =
    labels.value?.map((label) => ({
      id: label.id,
      name: label.name,
      icon: "lucide:tag"
    })) || []

  return [allNotesOption, ...labelOptions]
})

const isNoteMatch = (note: Note) => {
  if (!selectedLabelId.value) return true

  if (!note.labels?.length) return false

  return note.labels.some(
    (joinEntry) => joinEntry.labelId === selectedLabelId.value
  )
}

const pinnedNotes = computed(
  () =>
    notes.value?.filter((n) => n.isPinned && !n.isArchived && isNoteMatch(n)) ||
    []
)

const otherNotes = computed(
  () =>
    notes.value?.filter(
      (n) => !n.isPinned && !n.isArchived && isNoteMatch(n)
    ) || []
)

const {
  selectedIds,
  toggleSelection,
  executeBatchAction,
  executeSingleAction,
  clearSelection
} = useNotes(refreshNotes)

const isModalOpen = ref(false)
const selectedNote = ref<Note | null>(null)

const openCreateModal = () => {
  selectedNote.value = null
  isModalOpen.value = true
}

const openEditModal = (note: Note) => {
  selectedNote.value = note
  isModalOpen.value = true
}

const handleNoteSaved = () => {
  refreshNotes()
}
</script>

<template>
  <div class="sticky top-0 z-30 flex w-full flex-col">
    <UDashboardToolbar
      v-if="selectedIds.length > 0"
      class="flex flex-row items-center justify-between"
    >
      <span class="text-sm font-medium">{{ selectedIds.length }} selected</span>
      <div class="flex flex-row gap-sm">
        <UButton
          icon="lucide:archive"
          variant="ghost"
          color="neutral"
          @click="executeBatchAction('archive')"
        />
        <UButton
          icon="lucide:trash-2"
          variant="ghost"
          color="error"
          @click="executeBatchAction('delete')"
        />
        <UButton icon="lucide:x" variant="ghost" color="neutral" @click="clearSelection" />
      </div>
    </UDashboardToolbar>

    <UDashboardToolbar class="flex w-full flex-row overflow-x-auto bg-dimmed lg:hidden">
      <USelectMenu
        v-model="selectedLabelId"
        :items="filterOptions"
        value-key="id"
        label-key="name"
        icon="lucide:list-filter"
        placeholder="Filter by Label"
      />
    </UDashboardToolbar>
  </div>

  <div class="flex w-full flex-col gap-xl p-sm lg:flex-row">
    <div
      v-if="labels?.length"
      class="sticky hidden h-fit max-h-[calc(100vh-4rem)] w-40 flex-col gap-xs overflow-y-auto lg:flex"
    >
      <span class="text-sm text-dimmed">Filter:</span>

      <UButton
        label="All Notes"
        icon="lucide:list-filter"
        :variant="selectedLabelId === undefined ? 'soft' : 'ghost'"
        :color="selectedLabelId === undefined ? 'primary' : 'neutral'"
        size="xs"
        @click="selectedLabelId = undefined"
      />

      <UButton
        v-for="label in labels"
        :key="label.id"
        :label="label.name"
        icon="lucide:tag"
        :variant="selectedLabelId === label.id ? 'soft' : 'ghost'"
        :color="selectedLabelId === label.id ? 'primary' : 'neutral'"
        size="xs"
        @click="selectedLabelId = label.id"
      />
    </div>
    <div class="flex w-full flex-col gap-xl">
      <UEmpty
        v-if="!notes?.length"
        variant="naked"
        icon="lucide:sticky-note"
        title="Notes are empty."
        description="There are currently no notes."
      />

      <div
        v-if="
          selectedLabelId &&
          pinnedNotes.length === 0 &&
          otherNotes.length === 0 &&
          notes?.length
        "
        class="flex flex-col items-center justify-center py-12 text-gray-500"
      >
        <UEmpty
          variant="naked"
          icon="lucide:tag"
          title="Filter is empty."
          description="No notes found for this label."
          :actions="[
            {
              icon: 'lucide:filter-x',
              label: 'Clear Filter',
              onClick: () => {
                selectedLabelId = undefined
              }
            }
          ]"
        />
      </div>

      <div v-if="pinnedNotes.length > 0" class="flex w-full flex-col gap-2">
        <h3 class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Pinned</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RLNoteCard
            v-for="note in pinnedNotes"
            :key="note.id"
            :note="note"
            :selected="selectedIds.includes(note.id)"
            @update:selected="toggleSelection(note.id)"
            @click="openEditModal(note)"
            @toggle-pin="executeSingleAction(note.id, 'togglePin')"
            @archive="executeSingleAction(note.id, 'archive')"
            @delete="executeSingleAction(note.id, 'delete')"
          />
        </div>
      </div>

      <div v-if="otherNotes.length > 0" class="flex w-full flex-col gap-2">
        <h3
          v-if="pinnedNotes.length > 0"
          class="text-xs font-semibold tracking-wider text-gray-500 uppercase"
        >
          Others
        </h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RLNoteCard
            v-for="note in otherNotes"
            :key="note.id"
            :note="note"
            :selected="selectedIds.includes(note.id)"
            @update:selected="toggleSelection(note.id)"
            @click="openEditModal(note)"
            @toggle-pin="executeSingleAction(note.id, 'togglePin')"
            @archive="executeSingleAction(note.id, 'archive')"
            @delete="executeSingleAction(note.id, 'delete')"
          />
        </div>
      </div>

      <RLNoteModal v-model:open="isModalOpen" :note="selectedNote" @saved="handleNoteSaved" />

      <div class="fixed right-8 bottom-8 z-50">
        <UButton
          size="xl"
          icon="lucide:plus"
          class="rounded-full shadow-lg"
          @click="openCreateModal"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

