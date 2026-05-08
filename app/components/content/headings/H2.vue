<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface H2Props {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<H2Props>();

const { rc } = useRC("H2", rcProp);
/* endregion */

/* region Emits */
export interface H2Emits {}

const emit = defineEmits<H2Emits>();
/* endregion */

/* region Slots */
export interface H2Slots {
  default: (props: {}) => any;
}

const slots = defineSlots<H2Slots>();
/* endregion */

/* region Styles */
const h2Styles = tv({
  slots: {
    root: "text-4xl font-bold text-highlighted",
  },
});

const { root } = h2Styles();
type H2Variants = VariantProps<typeof h2Styles>;
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
  name: "H2",
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
  <h2 :class="root({ class: rc.root })">
    <slot />
  </h2>
</template>

<style scoped></style>
