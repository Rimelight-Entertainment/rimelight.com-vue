<script setup lang="ts">
import { type SectionBlockProps } from "~/types";
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { SECTION_LEVEL_KEY } from "../../../../internal/injectionKeys";

/* region Props */
export interface SectionBlockEditorProps extends SectionBlockProps {
  id: string;
  rc?: {
    root?: string;
    headerContainer?: string;
    titleInput?: string;
  };
}

const {
  id,
  rc: rcProp,
  title,
  description,
  children,
  level,
} = defineProps<SectionBlockEditorProps>();

const { rc } = useRC("SectionBlockEditor", rcProp);
/* endregion */

/* region Emits */
export interface SectionBlockEditorEmits {}

const emit = defineEmits<SectionBlockEditorEmits>();
/* endregion */

/* region Slots */
export interface SectionBlockEditorSlots {}

const slots = defineSlots<SectionBlockEditorSlots>();
/* endregion */

/* region Styles */
const sectionBlockEditorStyles = tv({
  slots: {
    root: "flex flex-col gap-sm",
    headerContainer: "flex flex-row items-center gap-xs",
    titleInput: "w-full",
    levelBadge: "text-xs font-mono text-dimmed shrink-0 leading-none",
  },
});

const { root, headerContainer, titleInput, levelBadge } = sectionBlockEditorStyles();
type SectionBlockEditorVariants = VariantProps<typeof sectionBlockEditorStyles>;
/* endregion */

/* region State */
const localTitle = ref(title);
const localDescription = ref(description);

const editorApi = inject<any>("block-editor-api");

const parentLevel = inject(
  SECTION_LEVEL_KEY,
  computed(() => 1),
);
const currentLevel = computed(() => Math.min(6, parentLevel.value + 1));

// Use a computed property to bridge vuedraggable and the central store directly
// This avoids maintaining a separate local state that can get out of sync
const localChildren = computed({
  get: () => children ?? [],
  set: (newChildren) => {
    if (editorApi && id) {
      // Deep copy to ensure we break references before sending to store
      const childrenCopy = JSON.parse(JSON.stringify(newChildren));
      editorApi.updateBlockProps(id, { children: childrenCopy });
    }
  },
});
/* endregion */

/* region Meta */
defineOptions({
  name: "SectionBlockEditor",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })

watch(
  () => currentLevel.value,
  (newLevel) => {
    if (editorApi && id && newLevel !== level) {
      editorApi.updateBlockProps(id, { level: newLevel });
    }
  },
  { immediate: true },
);

watch(
  () => title,
  (newVal) => {
    if (newVal !== localTitle.value) {
      localTitle.value = newVal;
    }
  },
);

watch(
  () => description,
  (newVal) => {
    if (newVal !== localDescription.value) {
      localDescription.value = newVal;
    }
  },
);

// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
/**
 * Updates the local title buffer on every keystroke for instant feedback.
 */
const updateLocalTitle = (e: Event) => {
  localTitle.value = (e.target as HTMLInputElement).value;
};

/**
 * Commits the final local title value to the global store when the input loses focus.
 */
const commitTitleOnBlur = () => {
  if (editorApi && id && localTitle.value !== title) {
    editorApi.updateBlockProps(id, { title: localTitle.value });
  }
};

const updateLocalDescription = (e: Event) => {
  localDescription.value = (e.target as HTMLInputElement).value;
};

const commitDescriptionOnBlur = () => {
  if (editorApi && id && localDescription.value !== description) {
    editorApi.updateBlockProps(id, { description: localDescription.value });
  }
};

// We no longer need to manually handle mutations since the setter does it immediately
const handleChildrenMutation = () => {
  // This might still be called by RLBlockEditor's events, but the work is done in the setter.
  // We can keep it empty or log for debugging.
  console.log("[SectionBlockEditor] Mutation event received (handled by setter)");
};
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RLSection :title="localTitle" :description="description" is-editing>
      <template #title>
        <div :class="headerContainer({ class: rc.headerContainer })">
          <span :class="levelBadge()"> H{{ currentLevel }} </span>
          <UInput
            :model-value="localTitle"
            variant="ghost"
            placeholder="Section Title..."
            :class="titleInput({ class: rc.titleInput })"
            @input="updateLocalTitle"
            @blur="commitTitleOnBlur"
          />
        </div>
      </template>
      <template #description>
        <UInput
          :model-value="localDescription"
          variant="ghost"
          placeholder="Section Description..."
          @input="updateLocalDescription"
          @blur="commitDescriptionOnBlur"
        />
      </template>
      <template #default>
        <RLBlockEditor
          v-model="localChildren"
          :container-id="id"
          @mutation="handleChildrenMutation"
          @end="handleChildrenMutation"
        />
      </template>
    </RLSection>
  </div>
</template>

<style scoped></style>
