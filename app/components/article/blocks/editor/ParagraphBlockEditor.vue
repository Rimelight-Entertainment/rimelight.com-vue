<script setup lang="ts">
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import type { ParagraphBlockProps, RichTextContent } from "#types";

/* region Props */
export interface ParagraphBlockEditorProps extends ParagraphBlockProps {
  id: string;
  rc?: {
    root?: string;
  };
}

const { id, text, rc: rcProp } = defineProps<ParagraphBlockEditorProps>();

const { rc } = useRC("ParagraphBlockEditor", rcProp);
/* endregion */

/* region Emits */
export interface ParagraphBlockEditorEmits {}

const emit = defineEmits<ParagraphBlockEditorEmits>();
/* endregion */

/* region Slots */
export interface ParagraphBlockEditorSlots {}

const slots = defineSlots<ParagraphBlockEditorSlots>();
/* endregion */

/* region Styles */
const paragraphBlockEditorStyles = tv({
  slots: {
    root: "p-2 outline-none min-h-6 focus:ring-2 focus:ring-blue-500 rounded-md transition duration-150 text-base",
  },
});

const { root } = paragraphBlockEditorStyles();
type ParagraphBlockEditorVariants = VariantProps<typeof paragraphBlockEditorStyles>;
/* endregion */

/* region State */
const editorRef = ref<HTMLElement | null>(null);
const localHtml = ref(richTextToHtml(text));
const isContentChanging = ref(false);

const editorApi = inject<any>("block-editor-api");
/* endregion */

/* region Meta */
defineOptions({
  name: "ParagraphBlockEditor",
});
/* endregion */

/* region Lifecycle */
onMounted(() => {
  if (editorRef.value) {
    // 💡 FIX: Manually set content on mount. NO v-html in template.
    editorRef.value.innerHTML = localHtml.value;
  }
});

watch(
  () => text,
  (newContent) => {
    // Only sync back if the change is external AND the user is not actively typing
    if (
      isContentChanging.value ||
      !editorRef.value ||
      defaultDocument?.activeElement === editorRef.value
    ) {
      return;
    }

    const newHtml = richTextToHtml(newContent);

    // 💡 FIX: Manually update the DOM content, bypassing v-html
    if (editorRef.value.innerText !== newHtml) {
      editorRef.value.innerHTML = newHtml;
      localHtml.value = newHtml; // Update local state for future use
    }
  },
  { deep: true, immediate: true },
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
 * Commits the content of the editor to the global store on blur.
 */
const commitContentOnBlur = () => {
  if (!editorRef.value || !editorApi) return;

  // 1. Get the content (using innerText to simulate plain text editing)
  const rawHtml = editorRef.value.innerText.trim();

  // 2. Only commit if the content has actually changed from the last known state
  const currentPropText = richTextToHtml(text);
  if (rawHtml === currentPropText) {
    return;
  }

  // 3. Set a flag to ignore watcher updates briefly (defensive measure)
  isContentChanging.value = true;

  // 4. Commit the structural update
  const newRichContent: RichTextContent = parseHtmlToRichText(rawHtml);
  editorApi.updateBlockProps(id, { text: newRichContent });

  // 5. Reset flag after commit
  nextTick(() => {
    isContentChanging.value = false;
  });
};
/* endregion */
</script>

<template>
  <div
    ref="editorRef"
    contenteditable="true"
    :class="root({ class: rc.root })"
    @blur="commitContentOnBlur"
  ></div>
</template>

<style scoped></style>
