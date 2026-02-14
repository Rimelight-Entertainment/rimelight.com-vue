<script lang="ts" setup>
import { type Note } from "rimelight-components/db";

const { confirm } = useConfirm();

const { data: notes, refresh } = await useApi<Note[]>("/api/notes", {
  query: { trash: true },
});

const {
  selectedIds,
  toggleSelection,
  executeBatchAction,
  executeSingleAction,
  clearSelection,
  noteRefreshTrigger,
} = useNotes();

watch(noteRefreshTrigger, () => {
  refresh();
});

const handleRestore = (id: string) => executeSingleAction(id, "restore");

const handleDeleteForever = async (id: string) => {
  const isConfirmed = await confirm({
    title: "Delete Note?",
    description: "This will permanently remove this note. This action cannot be undone.",
    confirmLabel: "Delete Forever",
    danger: true,
  });

  if (isConfirmed) {
    await executeSingleAction(id, "hard-delete");
  }
};
const confirmBatchDelete = async () => {
  const isConfirmed = await confirm({
    title: "Delete Forever?",
    description: `Are you sure you want to permanently delete ${selectedIds.value.length} notes? This action cannot be undone.`,
    confirmLabel: "Delete Forever",
    danger: true,
  });

  if (isConfirmed) {
    await executeBatchAction("hard-delete");
  }
};
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <UDashboardToolbar
      v-if="selectedIds.length > 0"
      class="sticky top-0 z-10 flex flex-row items-center justify-between"
    >
      <span class="text-sm font-medium">{{ selectedIds.length }} selected</span>
      <div class="flex flex-row gap-sm">
        <UButton
          color="neutral"
          icon="lucide:rotate-ccw"
          label="Restore"
          size="sm"
          variant="ghost"
          @click="executeBatchAction('restore')"
        />
        <UButton
          color="error"
          icon="lucide:trash-2"
          label="Delete Forever"
          size="sm"
          variant="subtle"
          @click="confirmBatchDelete"
        />
        <UButton
          color="neutral"
          icon="lucide:x"
          size="sm"
          variant="ghost"
          @click="clearSelection"
        />
      </div>
    </UDashboardToolbar>

    <UAlert
      color="error"
      description="Notes in the Trash are permanently deleted after 30 days."
      icon="lucide:octagon-alert"
      variant="subtle"
    />

    <UEmpty
      v-if="!notes?.length"
      description="There are currently no deleted notes."
      icon="lucide:trash"
      title="Trash is empty."
      variant="naked"
    />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RCNoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :selected="selectedIds.includes(note.id)"
        @archive="handleRestore(note.id)"
        @delete="handleDeleteForever(note.id)"
        @update:selected="toggleSelection(note.id)"
        @toggle-pin="handleRestore(note.id)"
      >
      </RCNoteCard>
    </div>
  </div>
</template>
