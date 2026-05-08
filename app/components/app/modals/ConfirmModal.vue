<script setup lang="ts">
import { useConfirm, useRC } from "~/composables";
import { computed } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface ConfirmModalProps {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<ConfirmModalProps>();

const { rc } = useRC("ConfirmModal", rcProp);
/* endregion */

/* region Emits */
export interface ConfirmModalEmits {}

const emit = defineEmits<ConfirmModalEmits>();
/* endregion */

/* region Slots */
export interface ConfirmModalSlots {
  // default: (props: {}) => any
}

const slots = defineSlots<ConfirmModalSlots>();
/* endregion */

/* region Styles */
const confirmModalStyles = tv({
  slots: {
    root: "z-9999",
    actions: "flex flex-row justify-between gap-sm",
  },
});

const { root, actions } = confirmModalStyles();
type ConfirmModalVariants = VariantProps<typeof confirmModalStyles>;
/* endregion */

/* region State */
const { state, handleConfirm, handleCancel } = useConfirm();

const isOpen = computed({
  get: () => state.value.isVisible,
  set: (value) => {
    state.value.isVisible = value;
  },
});
/* endregion */

/* region Meta */
defineOptions({
  name: "ConfirmModal",
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
  <UModal
    v-model:open="isOpen"
    :title="state.options.title"
    :description="state.options.description"
    :class="root({ class: rc.root })"
  >
    <template #body>
      <div :class="actions()">
        <UButton
          color="error"
          variant="outline"
          :label="state.options.cancelLabel"
          @click="handleCancel"
        />
        <UButton
          :color="state.options.danger ? 'error' : 'success'"
          :variant="state.options.danger ? 'subtle' : 'solid'"
          :label="state.options.confirmLabel"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
