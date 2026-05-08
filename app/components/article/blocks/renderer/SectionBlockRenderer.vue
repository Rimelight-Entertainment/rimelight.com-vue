<script setup lang="ts">
import type { SectionBlockProps } from "~/types";
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface SectionBlockRendererProps extends SectionBlockProps {
  rc?: {
    root?: string;
  };
}

const {
  level,
  title,
  description,
  children,
  rc: rcProp,
} = defineProps<SectionBlockRendererProps>();

const { rc } = useRC("SectionBlockRenderer", rcProp);
/* endregion */

/* region Emits */
export interface SectionBlockRendererEmits {}

const emit = defineEmits<SectionBlockRendererEmits>();
/* endregion */

/* region Slots */
export interface SectionBlockRendererSlots {}

const slots = defineSlots<SectionBlockRendererSlots>();
/* endregion */

/* region Styles */
const sectionBlockRendererStyles = tv({
  slots: {
    root: "",
  },
});

const { root } = sectionBlockRendererStyles();
type SectionBlockRendererVariants = VariantProps<typeof sectionBlockRendererStyles>;
/* endregion */

/* region State */
const headingId = computed(() => (title ? slugify(title) : undefined));
const hasChildren = computed(() => children && children.length > 0);
/* endregion */

/* region Meta */
defineOptions({
  name: "SectionBlockRenderer",
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
    <RLSection :level="level" :title="title" :description="description" :id="headingId">
      <RLBlockViewRenderer v-if="hasChildren" :blocks="children" />
    </RLSection>
  </div>
</template>

<style scoped></style>
