<script lang="ts" setup>
import { type Note } from "rimelight-components/db";

const { data: notes, refresh: refreshNotes } = await useApi<Note[]>("/api/notes");
const { data: labels } = await useApi<any[]>("/api/notes/labels");

const selectedLabelId = ref<string | undefined>(undefined);

watch(selectedLabelId, (newId) => {
  console.log("Selected Label ID changed to:", newId);
});

const filterOptions = computed(() => {
  const allNotesOption = {
    id: undefined,
    name: "All Notes",
    icon: "lucide:list-filter",
  };

  const labelOptions =
    labels.value?.map((label) => ({
      id: label.id,
      name: label.name,
      icon: "lucide:tag",
    })) || [];

  return [allNotesOption, ...labelOptions];
});

const isNoteMatch = (note: Note) => {
  if (!selectedLabelId.value) return true;

  if (!note.labels?.length) return false;

  return note.labels.some((joinEntry) => joinEntry.label?.id === selectedLabelId.value);
};

const pinnedNotes = computed(
  () => notes.value?.filter((n) => n.isPinned && !n.isArchived && isNoteMatch(n)) || [],
);

const otherNotes = computed(
  () => notes.value?.filter((n) => !n.isPinned && !n.isArchived && isNoteMatch(n)) || [],
);

const {
  selectedIds,
  toggleSelection,
  executeBatchAction,
  executeSingleAction,
  clearSelection,
  noteRefreshTrigger,
} = useNotes();

watch(noteRefreshTrigger, () => {
  refreshNotes();
});

const isModalOpen = ref(false);
const selectedNote = ref<Note | null>(null);

const openCreateModal = () => {
  selectedNote.value = null;
  isModalOpen.value = true;
};

const openEditModal = (note: Note) => {
  selectedNote.value = note;
  isModalOpen.value = true;
};

const handleNoteSaved = () => {
  refreshNotes();
};
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
          color="neutral"
          icon="lucide:archive"
          variant="ghost"
          @click="executeBatchAction('archive')"
        />
        <UButton
          color="error"
          icon="lucide:trash-2"
          variant="ghost"
          @click="executeBatchAction('delete')"
        />
        <UButton color="neutral" icon="lucide:x" variant="ghost" @click="clearSelection" />
      </div>
    </UDashboardToolbar>

    <UDashboardToolbar class="flex w-full flex-row overflow-x-auto bg-dimmed lg:hidden">
      <USelectMenu
        v-model="selectedLabelId"
        :items="filterOptions"
        icon="lucide:list-filter"
        label-key="name"
        placeholder="Filter by Label"
        value-key="id"
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
        :color="selectedLabelId === undefined ? 'primary' : 'neutral'"
        :variant="selectedLabelId === undefined ? 'soft' : 'ghost'"
        icon="lucide:list-filter"
        label="All Notes"
        size="xs"
        @click="selectedLabelId = undefined"
      />

      <UButton
        v-for="label in labels"
        :key="label.id"
        :color="selectedLabelId === label.id ? 'primary' : 'neutral'"
        :label="label.name"
        :variant="selectedLabelId === label.id ? 'soft' : 'ghost'"
        icon="lucide:tag"
        size="xs"
        @click="selectedLabelId = label.id"
      />
    </div>
    <div class="flex w-full flex-col gap-xl">
      <UEmpty
        v-if="!notes?.length"
        description="There are currently no notes."
        icon="lucide:sticky-note"
        title="Notes are empty."
        variant="naked"
      />

      <div
        v-if="
          selectedLabelId && pinnedNotes.length === 0 && otherNotes.length === 0 && notes?.length
        "
        class="flex flex-col items-center justify-center py-12 text-gray-500"
      >
        <UEmpty
          :actions="[
            {
              icon: 'lucide:filter-x',
              label: 'Clear Filter',
              onClick: () => {
                selectedLabelId = undefined;
              },
            },
          ]"
          description="No notes found for this label."
          icon="lucide:tag"
          title="Filter is empty."
          variant="naked"
        />
      </div>

      <div v-if="pinnedNotes.length > 0" class="flex w-full flex-col gap-2">
        <h3 class="text-xs font-semibold tracking-wider text-gray-500 uppercase">Pinned</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RCNoteCard
            v-for="note in pinnedNotes"
            :key="note.id"
            :note="note"
            :selected="selectedIds.includes(note.id)"
            @archive="executeSingleAction(note.id, 'archive')"
            @click="openEditModal(note)"
            @delete="executeSingleAction(note.id, 'delete')"
            @update:selected="toggleSelection(note.id)"
            @toggle-pin="executeSingleAction(note.id, 'togglePin')"
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
          <RCNoteCard
            v-for="note in otherNotes"
            :key="note.id"
            :note="note"
            :selected="selectedIds.includes(note.id)"
            @archive="executeSingleAction(note.id, 'archive')"
            @click="openEditModal(note)"
            @delete="executeSingleAction(note.id, 'delete')"
            @update:selected="toggleSelection(note.id)"
            @toggle-pin="executeSingleAction(note.id, 'togglePin')"
          />
        </div>
      </div>

      <RCNoteModal v-model:open="isModalOpen" :note="selectedNote" @saved="handleNoteSaved" />
    </div>
  </div>
</template>

<style scoped></style>
