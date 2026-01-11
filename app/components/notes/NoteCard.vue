<script setup lang="ts">
import type { Note } from "~~/server/db/schema"

const selected = defineModel<boolean>("selected", { default: false })
const isHovered = ref(false)

export interface NoteCardProps {
  note: Note
}

const { note } = defineProps<NoteCardProps>()

export interface NoteCardEmits {
  (e: "click"): void
  (e: "togglePin"): void
  (e: "archive"): void
  (e: "delete"): void
}

const emit = defineEmits<NoteCardEmits>()
</script>

<template>
  <div
    class="group relative flex flex-col"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <UCard
      variant="soft"
      class="h-48 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary-500/20"
      :ui="{ body: 'flex flex-col gap-sm justify-between h-full' }"
      @click="emit('click')"
    >
      <template #default>
        <div class="flex flex-col gap-xs">
          <h4 v-if="note.title" class="line-clamp-1 text-md font-bold break-words">
            {{ note.title }}
          </h4>
          <p
            v-if="note.content"
            class="line-clamp-3 text-sm break-words whitespace-pre-line text-dimmed"
          >
            {{ note.content }}
          </p>
        </div>
        <div
          v-if="note.labels?.length"
          class="flex flex-row flex-nowrap gap-xs overflow-hidden mask-[linear-gradient(90deg,black_85%,transparent)]"
        >
          <UBadge
            v-for="labelEntry in note.labels"
            :key="labelEntry.label.id"
            color="neutral"
            variant="subtle"
            size="sm"
            class="shrink-0 truncate"
          >
            {{ labelEntry.label.name }}
          </UBadge>
        </div>
      </template>
    </UCard>
    <div
      v-if="selected || isHovered"
      class="absolute top-2 left-2 z-20 transition-opacity duration-200"
    >
      <UCheckbox v-model="selected" color="primary" size="lg" @click.stop />
    </div>
    <div class="absolute top-2 right-2 z-20 flex flex-col gap-xs transition-opacity duration-200">
      <UButton
        v-if="note.isPinned || isHovered"
        :icon="note.isPinned ? 'lucide:pin-off' : 'lucide:pin'"
        variant="ghost"
        size="xs"
        :class="
          note.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        "
        @click.stop="emit('togglePin')"
      />
      <UButton
        v-if="isHovered"
        :icon="note.isArchived ? 'lucide:archive-x' : 'lucide:archive-restore'"
        variant="ghost"
        size="xs"
        @click.stop="emit('archive')"
      />
      <UButton
        v-if="isHovered"
        icon="lucide:trash-2"
        variant="ghost"
        color="error"
        size="xs"
        @click.stop="emit('delete')"
      />
    </div>
  </div>
</template>
