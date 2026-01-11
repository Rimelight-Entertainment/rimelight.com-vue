<script setup lang="ts">
const { state, handleConfirm, handleCancel } = useConfirm()

const isOpen = computed({
  get: () => state.value.isVisible,
  set: (value) => {
    state.value.isVisible = value
  }
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="state.options.title"
    :description="state.options.description"
  >
    <template #body>
      <div class="flex flex-row justify-between gap-sm">
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
