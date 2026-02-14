<script lang="ts" setup>
import { type Note } from "rimelight-components/db";

const { data: notes, refresh } = await useApi<Note[]>("/api/notes", {
  query: { archived: true },
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
          variant="ghost"
          @click="executeBatchAction('restore')"
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

    <UEmpty
      v-if="!notes?.length"
      description="There are currently no archived notes."
      icon="lucide:archive"
      title="Archive is empty."
      variant="naked"
    />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RCNoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :selected="selectedIds.includes(note.id)"
        @archive="executeSingleAction(note.id, 'restore')"
        @delete="executeSingleAction(note.id, 'delete')"
        @update:selected="toggleSelection(note.id)"
        @toggle-pin="executeSingleAction(note.id, 'togglePin')"
      />
    </div>
  </div>
</template>
