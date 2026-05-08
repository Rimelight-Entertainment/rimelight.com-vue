<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface H3Props {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<H3Props>();

const { rc } = useRC("H3", rcProp);
/* endregion */

/* region Emits */
export interface H3Emits {}

const emit = defineEmits<H3Emits>();
/* endregion */

/* region Slots */
export interface H3Slots {
  default: (props: {}) => any;
}

const slots = defineSlots<H3Slots>();
/* endregion */

/* region Styles */
const h3Styles = tv({
  slots: {
    root: "text-3xl font-bold text-highlighted",
  },
});

const { root } = h3Styles();
type H3Variants = VariantProps<typeof h3Styles>;
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
  name: "H3",
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
  <h3 :class="root({ class: rc.root })">
    <slot />
  </h3>
</template>

<style scoped></style>
