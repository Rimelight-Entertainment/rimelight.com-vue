<script setup lang="ts">
import { ref, inject, defineAsyncComponent } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import type { Block } from "#types";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";
import { BLOCK_EDITOR_COMPONENT_MAP } from "#build/rimelight-block-editor-map";

/* region Props */
export interface BlockEditRendererProps {
  blocks?: Block[];
  containerId?: string | null;
  rc?: {
    root?: string;
  };
}

const {
  blocks: propsBlocks,
  containerId = null,
  rc: rcProp,
} = defineProps<BlockEditRendererProps>();

const { rc } = useRC("BlockEditRenderer", rcProp);
/* endregion */

/* region Emits */
export interface BlockEditRendererEmits {
  start: [];
  end: [];
  change: [any];
}

const emit = defineEmits<BlockEditRendererEmits>();
/* endregion */

/* region Slots */
export interface BlockEditRendererSlots {}

const slots = defineSlots<BlockEditRendererSlots>();
/* endregion */

/* region Styles */
const blockEditRendererStyles = tv({
  slots: {
    root: "flex flex-col w-full min-h-32 transition-all border-l-2 border-neutral-200/50 rounded-r-lg",
    draggableClass: "flex flex-col w-full flex-1",
    emptyContainer:
      "w-full flex items-center justify-center transition-all rounded-lg border-2 border-transparent",
    itemWrapper:
      "w-full relative [&.ghost]:bg-blue-500 [&.ghost]:h-1 [&.ghost]:min-h-0 [&.ghost]:rounded-sm [&.ghost]:overflow-hidden [&.ghost_>_*]:hidden [&.ghost-hidden]:hidden [&.fallback]:opacity-90 [&.fallback]:shadow-lg [&.fallback]:rounded-lg [&.fallback]:bg-white [&.fallback]:z-[9999] [&.fallback]:cursor-grabbing",
  },
  variants: {
    isDraggingOver: {
      true: {
        root: "border-l-4 border-primary-500 bg-primary-50/30 ring-1 ring-primary-500/10 z-10",
      },
    },
  },
});

const { root, draggableClass, emptyContainer, itemWrapper } = blockEditRendererStyles();
type BlockEditRendererVariants = VariantProps<typeof blockEditRendererStyles>;
/* endregion */

/* region State */
const blocks = defineModel<Block[]>("blocks", { required: true });

const rendererId = Math.random().toString(36).substring(7);
const editorApi = inject<any>("block-editor-api");

const isDraggingOver = ref(false);
const dragCounter = ref(0);
/* endregion */

/* region Meta */
defineOptions({
  name: "BlockEditRenderer",
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
const onDragEnter = () => {
  dragCounter.value++;
  isDraggingOver.value = true;
};

const onDragLeave = () => {
  dragCounter.value--;
  if (dragCounter.value <= 0) {
    isDraggingOver.value = false;
    dragCounter.value = 0;
  }
};

const onDrop = () => {
  dragCounter.value = 0;
  isDraggingOver.value = false;
};

const handleStart = () => {
  emit("start");
};

const handleEnd = () => {
  emit("end");
};

const handleChange = (event: any) => {
  emit("change", event);
};

const asyncEditorMap = Object.fromEntries(
  Object.entries(BLOCK_EDITOR_COMPONENT_MAP).map(([key, importFn]) => [
    key,
    defineAsyncComponent(importFn as any),
  ]),
);

const resolveBlockEditor = (type?: string) => {
  if (!type) return "div";
  return asyncEditorMap[type] || "div";
};
/* endregion */
</script>

<template>
  <div
    :class="[root({ isDraggingOver }), rc.root, 'relative', { 'is-empty': blocks.length === 0 }]"
    @dragenter="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <draggable
      v-model="blocks"
      item-key="id"
      handle=".drag-handle"
      :group="{ name: 'blocks', pull: true, put: true }"
      :animation="200"
      :force-fallback="true"
      fallback-class="fallback"
      :ghost-class="blocks.length === 0 ? 'ghost-hidden' : 'ghost'"
      :class="[
        draggableClass(),
        blocks && blocks.length > 0 ? 'gap-lg min-h-16 pb-32' : 'gap-0 min-h-32',
      ]"
      @change="handleChange"
      @start="handleStart"
      @end="handleEnd"
    >
      <template #header>
        <div
          v-if="!blocks || blocks.length === 0"
          :class="[
            emptyContainer(),
            isDraggingOver ? 'bg-primary-50/50 border-dashed border-primary-500/50' : '',
          ]"
        >
          <UEmpty
            icon="lucide:layers"
            title="Empty Section"
            description="This area has no blocks yet. Drag items here or click to add your first block."
            variant="naked"
            class="w-full"
            :ui="{
              root: 'transition-transform px-4',
              title: isDraggingOver ? 'text-primary-600 font-bold' : '',
            }"
            :class="[isDraggingOver ? 'scale-[1.02]' : '']"
          >
            <template #actions>
              <UButton
                label="Add Block"
                icon="lucide:plus"
                color="neutral"
                variant="subtle"
                @click="editorApi?.openAddBlockModal()"
              />
            </template>
          </UEmpty>
        </div>
      </template>

      <template #item="{ element: block }">
        <div :class="itemWrapper()">
          <RLBlock :id="block.id" :type="block.type" class="w-full">
            <component
              :is="resolveBlockEditor(block.type)"
              :id="block.id"
              v-bind="block.props"
              :type="block.type"
              class="w-full"
            />
          </RLBlock>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped></style>
