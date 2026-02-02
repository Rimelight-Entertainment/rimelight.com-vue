<script lang="ts" setup>
const {
  activeToolIds,
  registeredTools,
  isVisible,
  removeTool,
  toggleExpanded,
  isToolExpanded
} = useFloatingTools()

function getTool(id: string) {
  return registeredTools.value.get(id)
}
</script>

<template>
  <div
      v-if="isVisible"
      class="fixed top-[calc(var(--ui-header-height)+1.5rem)] right-6 z-9999 flex flex-col items-end gap-4 pointer-events-none"
  >
    <div
        v-for="id in activeToolIds"
        :key="id"
        class="pointer-events-auto transition-all duration-300 ease-in-out"
    >
      <template v-if="getTool(id)">
        <div
            v-if="isToolExpanded(id)"
            class="w-80 bg-dimmed border border-muted rounded-2xl overflow-hidden"
        >
          <div class="flex items-center justify-between p-sm bg-muted">
            <div class="flex items-center gap-sm">
              <UIcon :name="getTool(id)!.icon" class="w-4 h-4"/>
              <span class="text-md font-bold uppercase">
                {{ getTool(id)!.title }}
              </span>
            </div>
            <div class="flex items-center gap-sm">
              <UButton
                  color="neutral"
                  icon="lucide:minus"
                  size="xs"
                  variant="ghost"
                  @click="toggleExpanded(id)"
              />
              <UButton
                  color="neutral"
                  icon="lucide:x"
                  size="xs"
                  variant="ghost"
                  @click="removeTool(id)"
              />
            </div>
          </div>

          <div class="p-sm">
            <component :is="getTool(id)!.component"/>
          </div>
        </div>

        <UTooltip v-else :text="getTool(id)!.tooltip?.() || getTool(id)!.title">
          <UButton
              class="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              color="primary"
              variant="solid"
              @click="toggleExpanded(id)"
          >
            <UIcon :name="getTool(id)!.icon" class="w-6 h-6"/>
          </UButton>
        </UTooltip>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
