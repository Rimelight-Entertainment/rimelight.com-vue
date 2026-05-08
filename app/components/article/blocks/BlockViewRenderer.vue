<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import type { Block } from "#types";
import { useRC } from "#composables";
import { BLOCK_RENDERER_COMPONENT_MAP } from "#build/rimelight-block-renderer-map";

/* region Props */
export interface BlockViewRendererProps {
  blocks: Block[];
  rc?: {
    root?: string;
  };
}

const { blocks, rc: rcProp } = defineProps<BlockViewRendererProps>();

const { rc } = useRC("BlockViewRenderer", rcProp);
/* endregion */

/* region Emits */
export interface BlockViewRendererEmits {}

const emit = defineEmits<BlockViewRendererEmits>();
/* endregion */

/* region Slots */
export interface BlockViewRendererSlots {}

const slots = defineSlots<BlockViewRendererSlots>();
/* endregion */

/* region Styles */
const blockViewRendererStyles = tv({
  slots: {
    root: "flex flex-col gap-lg",
  },
});

const { root } = blockViewRendererStyles();
type BlockViewRendererVariants = VariantProps<typeof blockViewRendererStyles>;
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
  name: "BlockViewRenderer",
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
const asyncRendererMap = Object.fromEntries(
  Object.entries(BLOCK_RENDERER_COMPONENT_MAP).map(([key, importFn]) => [
    key,
    defineAsyncComponent(importFn as any),
  ]),
);

const resolveBlockComponent = (type?: string) => {
  if (!type) return "div";
  return asyncRendererMap[type] || "div";
};
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <UEmpty
      v-if="!blocks || blocks.length === 0"
      variant="naked"
      icon="lucide:blocks"
      title="No blocks found for this page."
      description="It looks like there isn't any content added to this page yet."
    />
    <template v-else>
      <div v-for="block in (blocks || []).filter((b) => !!b)" :key="block.id">
        <component
          :is="resolveBlockComponent(block.type)"
          :id="block.id"
          v-bind="block.props"
          :type="block.type"
          class="block-container"
        />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
