<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import type { Note } from "~~/server/db/schema"
import type { Label } from "~~/server/db/schema"
import type { SelectMenuItem } from "@nuxt/ui"

const open = defineModel<boolean>("open", { default: false })

export interface NoteModalProps {
  note?: Note | null
}

const { note } = defineProps<NoteModalProps>()

export interface NoteModalEmits {
  (e: "saved", note: Note): void
  (e: "close"): void
}

const emit = defineEmits<NoteModalEmits>()


const state = reactive<{
  id: string | undefined
  title: string
  content: string
  isPinned: boolean
  isArchived: boolean
  labels: string[]
}>({
  id: note?.id,
  title: note?.title ?? "",
  content: note?.content ?? "",
  isPinned: note?.isPinned || false,
  isArchived: note?.isArchived || false,
  labels: note?.labels?.map((l) => l.label.id) || []
})

const { data: fetchedLabels, status } = useFetch<Label[]>("/api/notes/labels", {
  lazy: true,
  default: () => []
})

const allLabels = ref<Label[]>([])

watch(
  fetchedLabels,
  (newLabels) => {
    if (newLabels) {
      allLabels.value = [...newLabels]
    }
  },
  { immediate: true }
)

const labelMap = computed(() => {
  const map = new Map<string, string>()
  allLabels.value.forEach((l) => map.set(l.id, l.name))
  return map
})

// 2. Transform labels for USelectMenu
const labelItems = computed<SelectMenuItem[]>(() =>
  allLabels.value.map((l) => ({
    label: l.name,
    id: l.id // specific ID for tracking
  }))
)

/**
 * Centralized function to reset or populate state based on the incoming prop.
 * We call this when the prop changes OR when the modal opens.
 */
const syncState = () => {
  if (note) {
    state.id = note.id
    state.title = note.title ?? ""
    state.content = note.content ?? ""
    state.isPinned = note.isPinned
    state.isArchived = note.isArchived
    state.labels = note.labels?.map((l) => l.label.id) || []
  } else {
    state.id = undefined
    state.title = ""
    state.content = ""
    state.isPinned = false
    state.isArchived = false
    state.labels = []
  }
}

// Watch for prop changes (e.g. switching between notes without closing modal)
watch(() => note, syncState)

const saveNote = async () => {
  if (!state.title.trim() && !state.content.trim()) return

  try {
    let savedNote: Note

    const payload = {
      title: state.title.trim() || "",
      content: state.content.trim() || "",
      isPinned: state.isPinned,
      isArchived: state.isArchived,
      labels: state.labels
    }

    if (state.id) {
      savedNote = await $fetch<Note>(`/api/notes/${state.id}`, {
        method: "PUT",
        body: payload
      })
    } else {
      const createPayload = {
        title: payload.title,
        content: payload.content,
        isPinned: payload.isPinned,
        isArchived: payload.isArchived
      }

      savedNote = await $fetch<Note>("/api/notes", {
        method: "POST",
        body: createPayload
      })

      state.id = savedNote.id

      if (state.labels.length > 0) {
        savedNote = await $fetch<Note>(`/api/notes/${state.id}`, {
          method: "PUT",
          body: { labels: state.labels }
        })
      }
    }
    emit("saved", savedNote)
  } catch (e) {
    console.error("Failed to save note", e)
  }
}

/**
 * Handles the creation of a new label from the USelectMenu.
 * @param newLabelName The name of the label to create.
 */
const createLabel = async (newLabelName: string) => {
  try {
    const createdLabel = await $fetch<Label>("/api/notes/labels", {
      method: "POST",
      body: { name: newLabelName }
    })

    // 1. Add the newly created label to the local list.
    allLabels.value.push(createdLabel)

    // 2. Select the new label for the current note.
    // The USelectMenu's v-model is an array of IDs, so we push the new label's ID.
    if (!state.labels.includes(createdLabel.id)) {
      state.labels.push(createdLabel.id)
    }

    // The watch on state.labels will trigger a debounced save.
  } catch (e) {
    console.error("Failed to create new label", e)
    // Handle error, maybe show a toast notification
  }
}

const debouncedSave = useDebounceFn(saveNote, 1000)

watch(
  () => [
    state.title,
    state.content,
    state.isPinned,
    state.isArchived,
    state.labels
  ],
  (newVal, oldVal) => {
    debouncedSave()
  }
)

watch(open, (isOpen) => {
  if (isOpen) {
    syncState()
  } else {
    saveNote()
    emit("close")
  }
})
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'p-md flex flex-col' }">
    <slot />
    <template #content>
      <div class="flex flex-row justify-between gap-sm">
        <div class="flex w-full flex-col">
          <UInput
            v-model="state.title"
            type="text"
            size="xl"
            variant="none"
            placeholder="Title"
            class="flex-1 font-bold"
          />

          <div v-if="state.labels.length > 0" class="flex flex-wrap gap-sm px-sm">
            <UBadge
              v-for="labelId in state.labels"
              :key="labelId"
              color="neutral"
              variant="soft"
              size="md"
            >
              {{ labelMap.get(labelId) || "Unknown" }}
            </UBadge>
          </div>
          <UTextarea
            v-model="state.content"
            size="lg"
            variant="none"
            placeholder="Take a note..."
            :rows="2"
            :maxrows="16"
            autoresize
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-xs">
          <UButton
            :icon="state.isPinned ? 'lucide:pin-off' : 'lucide:pin'"
            variant="ghost"
            color="neutral"
            @click="state.isPinned = !state.isPinned"
          />
          <UButton
            :icon="
              state.isArchived ? 'lucide:archive-x' : 'lucide:archive-restore'
            "
            variant="ghost"
            size="sm"
            :color="state.isArchived ? 'primary' : 'neutral'"
            @click="state.isArchived = !state.isArchived"
          />
          <UButton icon="lucide:trash-2" variant="ghost" color="error" size="sm" @click="" />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-row gap-xs">
          <USelectMenu
            v-model="state.labels"
            :items="labelItems"
            :multiple="true"
            :arrow="true"
            icon="lucide-tag"
            trailing-icon=""
            variant="ghost"
            value-key="id"
            label-key="label"
            size="sm"
            create-item="always"
            @create="createLabel"
          >
            <template #default>
              <span class="text-dimmed">Edit Labels</span>
            </template>
          </USelectMenu>
        </div>
        <div class="flex flex-col gap-xs">
          <span class="text-xs text-dimmed">Last Edited: </span>
          <span class="text-xs text-dimmed">
            {{ state.id ? "Saved" : "Unsaved" }}
          </span>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
