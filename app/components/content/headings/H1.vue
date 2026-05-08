<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface H1Props {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<H1Props>();

const { rc } = useRC("H1", rcProp);
/* endregion */

/* region Emits */
export interface H1Emits {}

const emit = defineEmits<H1Emits>();
/* endregion */

/* region Slots */
export interface H1Slots {
  default: (props: {}) => any;
}

const slots = defineSlots<H1Slots>();
/* endregion */

/* region Styles */
const h1Styles = tv({
  slots: {
    root: "text-5xl font-bold text-highlighted",
  },
});

const { root } = h1Styles();
type H1Variants = VariantProps<typeof h1Styles>;
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
  name: "H1",
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
  <h1 :class="root({ class: rc.root })">
    <slot />
  </h1>
</template>

<style scoped></style>
