<script setup lang="ts">
import { computed } from "vue";
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface LinkNodeProps {
  href: string;
  target?: string;
  content: string;
  rc?: {
    root?: string;
  };
}

const { href, target, content, rc: rcProp } = defineProps<LinkNodeProps>();

const { rc } = useRC("LinkNode", rcProp);
/* endregion */

/* region Emits */
export interface LinkNodeEmits {}

const emit = defineEmits<LinkNodeEmits>();
/* endregion */

/* region Slots */
export interface LinkNodeSlots {}

const slots = defineSlots<LinkNodeSlots>();
/* endregion */

/* region Styles */
const linkNodeStyles = tv({
  slots: {
    root: "",
  },
});

const { root } = linkNodeStyles();
type LinkNodeVariants = VariantProps<typeof linkNodeStyles>;
/* endregion */

/* region State */
const rel = computed(() => (target === "_blank" ? "noopener noreferrer" : undefined));
/* endregion */

/* region Meta */
defineOptions({
  name: "LinkNode",
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
  <ULink :to="href" :target="target" :rel="rel" :class="root({ class: rc.root })">
    {{ content }}
  </ULink>
</template>

<style scoped></style>
