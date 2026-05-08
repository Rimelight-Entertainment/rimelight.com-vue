<script setup lang="ts">
import { provide, ref } from "vue";
import { v7 as uuidv7 } from "uuid";
import type { Block } from "~/types";
import { useBlockEditor, useRC } from "~/composables";
import { type BlockDefinition } from "#shared/utils/blocks";
import { useI18n } from "vue-i18n";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface BlockEditorProps {
  historyLimit?: number;
  containerId?: string | null; // ID of container block, null for root
  rc?: {
    root?: string;
    content?: string;
  };
}

const { historyLimit, containerId = null, rc: rcProp } = defineProps<BlockEditorProps>();

const { rc } = useRC("BlockEditor", rcProp);
/* endregion */

/* region Emits */
export interface BlockEditorEmits {
  save: [];
  mutation: [];
  start: [];
  end: [];
  change: [any];
}

const emit = defineEmits<BlockEditorEmits>();
/* endregion */

/* region Slots */
export interface BlockEditorSlots {}

const slots = defineSlots<BlockEditorSlots>();
/* endregion */

/* region Styles */
const blockEditorStyles = tv({
  slots: {
    root: "flex flex-col gap-8 w-full",
    footerClass: "flex flex-col items-center justify-center gap-md p-sm",
  },
});

const { root, footerClass } = blockEditorStyles();
type BlockEditorVariants = VariantProps<typeof blockEditorStyles>;
/* endregion */

/* region State */
const blocks = defineModel<Block[]>({ required: true });

const { t } = useI18n();

const {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock,
  relocateBlock,
  undo,
  redo,
  canUndo,
  canRedo,
} = useBlockEditor(blocks, { maxHistorySize: historyLimit, onMutation: () => emit("mutation") });

const isAddBlockModalOpen = ref(false);
const addBlockTarget = ref<{ id: string | null; position: "before" | "after" }>({
  id: null,
  position: "after",
});

provide("block-editor-api", {
  removeBlock,
  moveBlock,
  duplicateBlock,
  updateBlockProps,
  insertBlock,
  relocateBlock,
  canUndo,
  canRedo,
  undo,
  redo,
  openAddBlockModal,
});

defineExpose({ undo, redo, canUndo, canRedo });
/* endregion */

/* region Meta */
defineOptions({
  name: "BlockEditor",
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
function regenerateIds(block: Block): void {
  block.id = uuidv7();
  if (block.props && "children" in block.props && Array.isArray(block.props.children)) {
    block.props.children.forEach((child: Block) => regenerateIds(child));
  }
}

function openAddBlockModal(targetId: string | null = null, position: "before" | "after" = "after") {
  addBlockTarget.value = { id: targetId, position };
  isAddBlockModalOpen.value = true;
}

const handleBlockSelect = (definition: BlockDefinition) => {
  insertBlock(definition.type, addBlockTarget.value.id, addBlockTarget.value.position);
};

const handleDragStart = () => {
  emit("start");
};

const handleDragEnd = async () => {
  emit("end");
  emit("mutation");
};

const handleBlockChange = (event: any) => {
  if (event.added) {
    const block = event.added.element;
    if (block) {
      regenerateIds(block);
    }
  }

  emit("change", event);

  if (event.added || event.removed || event.moved) {
    emit("mutation");
  }
};
/* endregion */
</script>

<template>
  <div :class="root()">
    <RLBlockEditRenderer
      v-model:blocks="blocks"
      :container-id="containerId"
      @start="handleDragStart"
      @end="handleDragEnd"
      @change="handleBlockChange"
    />

    <div v-if="blocks && blocks.length > 0" :class="footerClass()">
      <UButton
        color="neutral"
        :label="t('page_editor.add_block', 'Add Block')"
        variant="outline"
        icon="lucide:plus"
        @click="openAddBlockModal()"
      />
    </div>

    <RLAddBlockModal v-model:open="isAddBlockModalOpen" @select="handleBlockSelect" />
  </div>
</template>

<style scoped></style>
