<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface H6Props {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<H6Props>();

const { rc } = useRC("H6", rcProp);
/* endregion */

/* region Emits */
export interface H6Emits {}

const emit = defineEmits<H6Emits>();
/* endregion */

/* region Slots */
export interface H6Slots {
  default: (props: {}) => any;
}

const slots = defineSlots<H6Slots>();
/* endregion */

/* region Styles */
const h6Styles = tv({
  slots: {
    root: "text-lg font-bold text-highlighted",
  },
});

const { root } = h6Styles();
type H6Variants = VariantProps<typeof h6Styles>;
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
  name: "H6",
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
  <h6 :class="root({ class: rc.root })">
    <slot />
  </h6>
</template>

<style scoped></style>
