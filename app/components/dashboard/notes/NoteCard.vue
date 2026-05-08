<script setup lang="ts">
import type { Note } from "#shared/db";
import { useRC } from "~/composables";
import { ref } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface NoteCardProps {
  note: Note;
  rc?: {
    root?: string;
  };
}

const { note, rc: rcProp } = defineProps<NoteCardProps>();

const { rc } = useRC("NoteCard", rcProp);
/* endregion */

/* region Emits */
export interface NoteCardEmits {
  click: [];
  togglePin: [];
  archive: [];
  delete: [];
}

const emit = defineEmits<NoteCardEmits>();
/* endregion */

/* region Slots */
export interface NoteCardSlots {}

const slots = defineSlots<NoteCardSlots>();
/* endregion */

/* region Styles */
const noteCardStyles = tv({
  slots: {
    root: "group relative flex flex-col",
    cardClass:
      "h-48 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary-500/20",
    contentWrapper: "flex flex-col gap-xs",
    titleClass: "line-clamp-1 text-md font-bold break-words",
    bodyClass: "line-clamp-3 text-sm break-words whitespace-pre-line text-dimmed",
    labelWrapper:
      "flex flex-row flex-nowrap gap-xs overflow-hidden mask-[linear-gradient(90deg,black_85%,transparent)]",
    labelBadge: "shrink-0 truncate",
    selectionWrapper: "absolute top-2 left-2 z-20 transition-opacity duration-200",
    actionsWrapper:
      "absolute top-2 right-2 z-20 flex flex-col gap-xs transition-opacity duration-200",
    pinButton: "transition-opacity",
  },
});

const {
  root,
  cardClass,
  contentWrapper,
  titleClass,
  bodyClass,
  labelWrapper,
  labelBadge,
  selectionWrapper,
  actionsWrapper,
  pinButton,
} = noteCardStyles();
type NoteCardVariants = VariantProps<typeof noteCardStyles>;
/* endregion */

/* region State */
const selected = defineModel<boolean>("selected", { default: false });
const isHovered = ref(false);
/* endregion */

/* region Meta */
defineOptions({
  name: "NoteCard",
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
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div
    :class="root({ class: rc.root })"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <UCard
      variant="soft"
      :class="cardClass()"
      :ui="{ body: 'flex flex-col gap-sm justify-between h-full' }"
      @click="emit('click')"
    >
      <template #default>
        <div :class="contentWrapper()">
          <h4 v-if="note.title" :class="titleClass()">
            {{ note.title }}
          </h4>
          <p v-if="note.content" :class="bodyClass()">
            {{ note.content }}
          </p>
        </div>
        <div v-if="note.labels?.length" :class="labelWrapper()">
          <UBadge
            v-for="(labelEntry, index) in note.labels"
            :key="labelEntry.label?.id || index"
            color="neutral"
            variant="subtle"
            size="sm"
            :class="labelBadge()"
          >
            {{ labelEntry.label?.name || "Unknown" }}
          </UBadge>
        </div>
      </template>
    </UCard>
    <div v-if="selected || isHovered" :class="selectionWrapper()">
      <UCheckbox v-model="selected" color="primary" size="lg" @click.stop />
    </div>
    <div :class="actionsWrapper()">
      <UButton
        v-if="note.isPinned || isHovered"
        :icon="note.isPinned ? 'lucide:pin-off' : 'lucide:pin'"
        variant="ghost"
        size="xs"
        :class="[pinButton(), note.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
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

<style scoped></style>
