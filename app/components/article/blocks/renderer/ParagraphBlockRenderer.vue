<script setup lang="ts">
import type { ParagraphBlockProps } from "#types";
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface ParagraphBlockRendererProps extends ParagraphBlockProps {
  rc?: {
    root?: string;
  };
}

const { text, rc: rcProp } = defineProps<ParagraphBlockRendererProps>();

const { rc } = useRC("ParagraphBlockRenderer", rcProp);
/* endregion */

/* region Emits */
export interface ParagraphBlockRendererEmits {}

const emit = defineEmits<ParagraphBlockRendererEmits>();
/* endregion */

/* region Slots */
export interface ParagraphBlockRendererSlots {}

const slots = defineSlots<ParagraphBlockRendererSlots>();
/* endregion */

/* region Styles */
const paragraphBlockRendererStyles = tv({
  slots: {
    root: "",
  },
});

const { root } = paragraphBlockRendererStyles();
type ParagraphBlockRendererVariants = VariantProps<typeof paragraphBlockRendererStyles>;
/* endregion */

/* region State */
// const ref1 = ref(0)
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Meta */
defineOptions({
  name: "ParagraphBlockRenderer",
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
  <div :class="root({ class: rc.root })">
    <RLTextRenderer :content="text" />
  </div>
</template>

<style scoped></style>
