<script setup lang="ts">
import { type NavigationMenuItem } from "@nuxt/ui"

definePageMeta({
  layout: "dashboard"
})

const links = [
  [
    {
      label: "Notes",
      icon: "i-lucide-sticky-note",
      to: "/internal/notes",
      exact: true
    }
  ],
  [
    {
      label: "Archive",
      icon: "i-lucide-archive",
      to: "/internal/notes/archive"
    },
    {
      label: "Trash",
      icon: "i-lucide-trash-2",
      to: "/internal/notes/trash"
    }
  ]
] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="notes" :ui="{ body: 'p-0' }">
    <template #header>
      <UDashboardNavbar title="Notes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>
