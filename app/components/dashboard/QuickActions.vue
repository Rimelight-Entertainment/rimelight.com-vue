<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { registeredActions } = useQuickActions()

const menuItems = computed<DropdownMenuItem[][]>(() => {
  const grouped = registeredActions.value.reduce((acc, action) => {
    const groupId = action.group ?? 0
    if (!acc[groupId]) acc[groupId] = []
    acc[groupId].push({
      label: action.label,
      icon: action.icon,
      onSelect: action.onSelect
    })
    return acc
  }, {} as Record<number, DropdownMenuItem[]>)

  return Object.values(grouped)
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-10000">
    <ClientOnly>
      <UDropdownMenu v-if="menuItems.length > 0" :items="menuItems" :ui="{ content: 'w-48' }">
        <UButton
          icon="lucide:plus"
          color="primary"
          square
          :ui="{
            base: 'rounded-full size-16 lg:size-12 justify-center',
            leadingIcon: 'size-6'
          }"
        />
      </UDropdownMenu>
    </ClientOnly>
  </div>
</template>

<style scoped></style>
