<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface H4Props {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<H4Props>();

const { rc } = useRC("H4", rcProp);
/* endregion */

/* region Emits */
export interface H4Emits {}

const emit = defineEmits<H4Emits>();
/* endregion */

/* region Slots */
export interface H4Slots {
  default: (props: {}) => any;
}

const slots = defineSlots<H4Slots>();
/* endregion */

/* region Styles */
const h4Styles = tv({
  slots: {
    root: "text-2xl font-bold text-highlighted",
  },
});

const { root } = h4Styles();
type H4Variants = VariantProps<typeof h4Styles>;
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
  name: "H4",
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
  <h4 :class="root({ class: rc.root })">
    <slot />
  </h4>
</template>

<style scoped></style>
