<script setup lang="ts">
import type { Note } from "~~/server/db/schema"

const { data: notes, refresh } = await useApi<Note[]>("/api/notes", {
  query: { archived: true }
})

const {
  selectedIds,
  toggleSelection,
  executeBatchAction,
  executeSingleAction,
  clearSelection
} = useNotes(refresh)
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
          label="Restore"
          icon="i-lucide-rotate-ccw"
          variant="ghost"
          color="neutral"
          @click="executeBatchAction('restore')"
        />
        <UButton
          icon="i-lucide-trash-2"
          variant="ghost"
          color="error"
          @click="executeBatchAction('delete')"
        />
        <UButton icon="i-lucide-x" variant="ghost" color="neutral" @click="clearSelection" />
      </div>
    </UDashboardToolbar>

    <UEmpty
      v-if="!notes?.length"
      variant="naked"
      icon="lucide:archive"
      title="Archive is empty."
      description="There are currently no archived notes."
    />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RLNoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :selected="selectedIds.includes(note.id)"
        @update:selected="toggleSelection(note.id)"
        @toggle-pin="executeSingleAction(note.id, 'togglePin')"
        @archive="executeSingleAction(note.id, 'restore')"
        @delete="executeSingleAction(note.id, 'delete')"
      />
    </div>
  </div>
</template>

