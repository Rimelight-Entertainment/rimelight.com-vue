<script setup lang="ts">
import { ref } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface DeleteModalProps {
  count?: number;
  rc?: {
    root?: string;
  };
}

const { count = 0, rc: rcProp } = defineProps<DeleteModalProps>();

const { rc } = useRC("DeleteModal", rcProp);
/* endregion */

/* region Emits */
export interface DeleteModalEmits {}

const emit = defineEmits<DeleteModalEmits>();
/* endregion */

/* region Slots */
export interface DeleteModalSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<DeleteModalSlots>();
/* endregion */

/* region Styles */
const deleteModalStyles = tv({
  slots: {
    root: "",
    actions: "flex justify-end gap-2",
  },
});

const { root, actions } = deleteModalStyles();
type DeleteModalVariants = VariantProps<typeof deleteModalStyles>;
/* endregion */

/* region State */
const open = ref(false);
/* endregion */

/* region Meta */
defineOptions({
  name: "DeleteModal",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })

// watch(() =>, (newValue, oldValue) => {
//
// })

// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
async function onSubmit() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  open.value = false;
}
/* endregion */
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} customer${count > 1 ? 's' : ''}`"
    :description="`Are you sure, this action cannot be undone.`"
    :class="root({ class: rc.root })"
  >
    <slot />

    <template #body>
      <div :class="actions()">
        <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
        <UButton label="Delete" color="error" variant="solid" loading-auto @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
