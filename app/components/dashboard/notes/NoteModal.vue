<script lang="ts" setup>
import type { SelectMenuItem } from "@nuxt/ui";
import { computed, reactive, ref, watch, onUnmounted } from "vue";
import type { Label, Note } from "#shared/db";
import { useRC } from "~/composables";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface NoteModalProps {
  note?: Note | null;
  rc?: {
    root?: string;
  };
}

const { note, rc: rcProp } = defineProps<NoteModalProps>();

const { rc } = useRC("NoteModal", rcProp);
/* endregion */

/* region Emits */
export interface NoteModalEmits {
  saved: [note: Note];
  close: [];
}

const emit = defineEmits<NoteModalEmits>();
/* endregion */

/* region Slots */
export interface NoteModalSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<NoteModalSlots>();
/* endregion */

/* region Styles */
const noteModalStyles = tv({
  slots: {
    root: "p-md flex flex-col",
    contentWrapper: "flex flex-row justify-between gap-sm",
    mainContent: "flex w-full flex-col",
    titleInput: "flex-1 font-bold",
    labelBadgeList: "flex flex-wrap gap-sm px-sm",
    contentText: "w-full",
    sideActions: "flex flex-col gap-xs",
    footerWrapper: "flex items-center justify-between",
    labelActionWrapper: "flex flex-row gap-xs",
    statusWrapper: "flex flex-col gap-xs",
    statusText: "text-xs text-dimmed",
  },
});

const {
  root,
  contentWrapper,
  mainContent,
  titleInput,
  labelBadgeList,
  contentText,
  sideActions,
  footerWrapper,
  labelActionWrapper,
  statusWrapper,
  statusText,
} = noteModalStyles();
type NoteModalVariants = VariantProps<typeof noteModalStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });

const state = reactive<{
  id: string | undefined;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  labels: string[];
}>({
  id: note?.id,
  title: note?.title ?? "",
  content: note?.content ?? "",
  isPinned: note?.isPinned || false,
  isArchived: note?.isArchived || false,
  labels: note?.labels?.map((l: any) => l.label.id) || [],
});

const { data: fetchedLabels } = useFetch<Label[]>("/api/notes/labels", {
  default: () => [] as any,
});

const allLabels = ref<Label[]>([]);
const saveTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const isSaving = ref(false);
const hasPendingSave = ref(false);

const labelMap = computed(() => {
  const map = new Map<string, string>();
  allLabels.value.forEach((l: Label) => map.set(l.id, l.name));
  return map;
});

const labelItems = computed<SelectMenuItem[]>(() =>
  allLabels.value.map((l: Label) => ({
    label: l.name,
    id: l.id,
  })),
);
/* endregion */

/* region Meta */
defineOptions({
  name: "NoteModal",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })

watch(
  () => note,
  (newNote) => {
    if (!newNote) {
      state.id = undefined;
      state.title = "";
      state.content = "";
      state.isPinned = false;
      state.isArchived = false;
      state.labels = [];
    } else {
      state.id = newNote.id;
      state.title = newNote.title ?? "";
      state.content = newNote.content ?? "";
      state.isPinned = newNote.isPinned || false;
      state.isArchived = newNote.isArchived || false;
      state.labels = newNote.labels?.map((l: any) => l.label.id) || [];
    }
  },
  { immediate: true },
);

watch(
  () => fetchedLabels.value,
  (newLabels) => {
    if (newLabels) {
      allLabels.value = [...newLabels];
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
});
/* endregion */

/* region Logic */
async function saveNote() {
  if (!state.title && !state.content) return;

  isSaving.value = true;
  try {
    const payload = {
      title: state.title,
      content: state.content,
      isPinned: state.isPinned,
      isArchived: state.isArchived,
      labels: state.labels,
    };

    let result: Note | undefined;
    if (state.id) {
      result = await $fetch<Note>(`/api/notes/${state.id}`, {
        method: "PATCH",
        body: payload,
      });
    } else {
      result = await $fetch<Note>("/api/notes", {
        method: "POST",
        body: payload,
      });
      state.id = result.id;
    }

    if (result) emit("saved", result);
  } catch (error) {
    console.error("Failed to save note:", error);
  } finally {
    isSaving.value = false;
    hasPendingSave.value = false;
  }
}

function debouncedSave() {
  hasPendingSave.value = true;
  if (saveTimeout.value) clearTimeout(saveTimeout.value);
  saveTimeout.value = setTimeout(() => {
    saveNote();
  }, 1000);
}

function toggleLabel(labelId: string) {
  const index = state.labels.indexOf(labelId);
  if (index === -1) {
    state.labels.push(labelId);
  } else {
    state.labels.splice(index, 1);
  }
  debouncedSave();
}

function handleLabelUpdate(val: any) {
  state.labels = val as string[];
  debouncedSave();
}

async function createLabel(name: string) {
  try {
    const newLabel = await $fetch<Label>("/api/notes/labels", {
      method: "POST",
      body: { name },
    });
    allLabels.value.push(newLabel);
    toggleLabel(newLabel.id);
  } catch (error) {
    console.error("Failed to create label:", error);
  }
}

function deleteNote() {
  if (state.id) {
    $fetch(`/api/notes/${state.id}`, { method: "DELETE" })
      .then(() => {
        emit("close");
      })
      .catch((err) => console.error("Failed to delete note:", err));
  } else {
    emit("close");
  }
}
/* endregion */
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard :ui="{ body: 'p-0' }">
        <div :class="root({ class: rc.root })">
          <div :class="contentWrapper()">
            <div :class="mainContent()">
              <UInput
                v-model="state.title"
                variant="none"
                size="xl"
                placeholder="Title"
                :class="titleInput()"
                @update:model-value="debouncedSave"
              />

              <div v-if="state.labels.length > 0" :class="labelBadgeList()">
                <UBadge
                  v-for="labelId in state.labels"
                  :key="labelId"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  closable
                  @close="toggleLabel(labelId)"
                >
                  {{ labelMap.get(labelId) || "Loading..." }}
                </UBadge>
              </div>

              <UTextarea
                v-model="state.content"
                variant="none"
                autoresize
                :rows="8"
                placeholder="Take a note..."
                :class="contentText()"
                @update:model-value="debouncedSave"
              />
            </div>

            <div :class="sideActions()">
              <UButton
                :icon="state.isPinned ? 'lucide:pin-off' : 'lucide:pin'"
                variant="ghost"
                color="neutral"
                :label="state.isPinned ? 'Unpin' : 'Pin'"
                @click="
                  state.isPinned = !state.isPinned;
                  debouncedSave();
                "
              />
              <div class="flex gap-xs">
                <USelectMenu
                  :items="labelItems"
                  icon="lucide:tag"
                  label="Labels"
                  variant="ghost"
                  color="neutral"
                  multiple
                  :model-value="state.labels"
                  @update:model-value="handleLabelUpdate"
                />
                <UInput
                  placeholder="Create label..."
                  size="xs"
                  class="flex-1"
                  @keydown.enter="
                    createLabel(($event.target as HTMLInputElement).value);
                    ($event.target as HTMLInputElement).value = '';
                  "
                />
              </div>
              <UButton
                :icon="state.isArchived ? 'lucide:archive-restore' : 'lucide:archive'"
                variant="ghost"
                color="neutral"
                :label="state.isArchived ? 'Unarchive' : 'Archive'"
                @click="
                  state.isArchived = !state.isArchived;
                  debouncedSave();
                "
              />
            </div>
          </div>

          <USeparator class="my-md" />

          <div :class="footerWrapper()">
            <div :class="labelActionWrapper()">
              <UButton
                icon="lucide:trash-2"
                variant="ghost"
                color="error"
                label="Delete"
                @click="deleteNote"
              />
            </div>

            <div :class="statusWrapper()">
              <span v-if="isSaving" :class="statusText()">Saving...</span>
              <span v-else-if="hasPendingSave" :class="statusText()">Pending changes...</span>
              <span v-else :class="statusText()">All changes saved</span>
              <UButton label="Done" color="neutral" @click="open = false" />
            </div>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped></style>
