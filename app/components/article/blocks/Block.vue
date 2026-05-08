<script setup lang="ts">
import { inject, ref } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface BlockProps {
  id: string;
  type: string;
  rc?: {
    root?: string;
    menuContainer?: string;
  };
}

const { id, type, rc: rcProp } = defineProps<BlockProps>();

const { rc } = useRC("Block", rcProp);
/* endregion */

/* region Emits */
export interface BlockEmits {}

const emit = defineEmits<BlockEmits>();
/* endregion */

/* region Slots */
export interface BlockSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<BlockSlots>();
/* endregion */

/* region Styles */
const blockStyles = tv({
  slots: {
    root: "group relative pl-12 flex flex-row gap-xs",
    menuContainer: "top-0 left-0 z-10 opacity-0 transition-opacity group-hover:opacity-100",
    dragHandle: "drag-handle cursor-grab active:cursor-grabbing",
  },
});

const { root, menuContainer, dragHandle } = blockStyles();
type BlockVariants = VariantProps<typeof blockStyles>;
/* endregion */

/* region State */
const editorApi = inject<any>("block-editor-api");

if (!editorApi) {
  throw new Error("RLBlock must be used within a BlockEditor component");
}

const items = ref([
  [
    {
      icon: "lucide:arrow-up",
      label: "Move Block Up",
      onSelect: onMoveUp,
    },
    {
      icon: "lucide:arrow-down",
      label: "Move Block Down",
      onSelect: onMoveDown,
    },
  ],
  [
    {
      icon: "lucide:corner-right-up",
      label: "Add Block Above",
      onSelect: onAddAbove,
    },
    {
      icon: "lucide:corner-right-down",
      label: "Add Block Below",
      onSelect: onAddBelow,
    },
  ],
  [
    {
      icon: "lucide:copy-plus",
      label: "Duplicate Block",
      onSelect: onDuplicate,
    },
    {
      icon: "lucide:trash-2",
      color: "danger",
      label: "Delete Block",
      onSelect: onDelete,
    },
  ],
]);
/* endregion */

/* region Meta */
defineOptions({
  name: "Block",
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
function onDelete() {
  editorApi.removeBlock(id);
}
function onDuplicate() {
  editorApi.duplicateBlock(id);
}
function onMoveUp() {
  editorApi.moveBlock(id, -1);
}
function onMoveDown() {
  editorApi.moveBlock(id, 1);
}

function onAddAbove() {
  editorApi.openAddBlockModal(id, "before");
}
function onAddBelow() {
  editorApi.openAddBlockModal(id, "after");
}
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <div :class="menuContainer({ class: rc.menuContainer })">
      <UDropdownMenu :items="items">
        <UButton
          icon="lucide:grip-vertical"
          variant="ghost"
          color="neutral"
          :class="dragHandle()"
        />
      </UDropdownMenu>
    </div>

    <slot />
  </div>
</template>

<style scoped></style>
