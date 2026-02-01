<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import type { Note, Label } from "~~/server/db/schema"
import type { SelectMenuItem } from "@nuxt/ui"
import { reactive, ref, computed, watch } from "vue"

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
  labels: note?.labels?.map((l: any) => l.label.id) || []
})

const { data: fetchedLabels } = useFetch<Label[]>("/api/notes/labels", {
  lazy: true,
  default: () => []
})

const allLabels = ref<Label[]>([])

watch(
  () => fetchedLabels.value,
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

const labelItems = computed<SelectMenuItem[]>(() =>
  allLabels.value.map((l) => ({
    label: l.name,
    id: l.id
  }))
)

const syncState = () => {
  if (note) {
    state.id = note.id
    state.title = note.title ?? ""
    state.content = note.content ?? ""
    state.isPinned = note.isPinned
    state.isArchived = note.isArchived
    state.labels = note.labels?.map((l: any) => l.label.id) || []
  } else {
    state.id = undefined
    state.title = ""
    state.content = ""
    state.isPinned = false
    state.isArchived = false
    state.labels = []
  }
}

watch(() => note, syncState)

const saveNote = async () => {
  if (!state.title.trim() && !state.content.trim()) return

  try {
    let savedNote: Note

    const { encrypt, hasKeys } = useEncryption();

    // Encrypt content if we have keys (E2EE)
    let finalTitle = state.title.trim() || "";
    let finalContent = state.content.trim() || "";

    if (hasKeys.value) {
        finalTitle = await encrypt(finalTitle);
        finalContent = await encrypt(finalContent);
    }

    const payload = {
      title: finalTitle,
      content: finalContent,
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

const createLabel = async (newLabelName: string) => {
  try {
    const createdLabel = await $fetch<Label>("/api/notes/labels", {
      method: "POST",
      body: { name: newLabelName }
    })

    allLabels.value.push(createdLabel)

    if (!state.labels.includes(createdLabel.id)) {
      state.labels.push(createdLabel.id)
    }
  } catch (e) {
    console.error("Failed to create new label", e)
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
  () => {
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
