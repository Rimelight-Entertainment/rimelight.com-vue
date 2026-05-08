<script setup lang="ts">
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface TextNodeProps {
  content: string;
  rc?: {
    root?: string;
  };
}

const { content, rc: rcProp } = defineProps<TextNodeProps>();

const { rc } = useRC("TextNode", rcProp);
/* endregion */

/* region Emits */
export interface TextNodeEmits {}

const emit = defineEmits<TextNodeEmits>();
/* endregion */

/* region Slots */
export interface TextNodeSlots {}

const slots = defineSlots<TextNodeSlots>();
/* endregion */

/* region Styles */
const textNodeStyles = tv({
  slots: {
    root: "",
  },
});

const { root } = textNodeStyles();
type TextNodeVariants = VariantProps<typeof textNodeStyles>;
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
  name: "TextNode",
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
  <span :class="root({ class: rc.root })">{{ content }}</span>
</template>

<style scoped></style>
