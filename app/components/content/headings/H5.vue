<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface H5Props {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<H5Props>();

const { rc } = useRC("H5", rcProp);
/* endregion */

/* region Emits */
export interface H5Emits {}

const emit = defineEmits<H5Emits>();
/* endregion */

/* region Slots */
export interface H5Slots {
  default: (props: {}) => any;
}

const slots = defineSlots<H5Slots>();
/* endregion */

/* region Styles */
const h5Styles = tv({
  slots: {
    root: "text-xl font-bold text-highlighted",
  },
});

const { root } = h5Styles();
type H5Variants = VariantProps<typeof h5Styles>;
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
  name: "H5",
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
  <h5 :class="root({ class: rc.root })">
    <slot />
  </h5>
</template>

<style scoped></style>
