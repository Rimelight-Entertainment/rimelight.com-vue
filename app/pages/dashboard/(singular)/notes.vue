<script setup lang="ts">
import { type NavigationMenuItem } from "#ui/types";

definePageMeta({
  layout: "dashboard",
});

const links = [
  [
    {
      label: "Notes",
      icon: "lucide:sticky-note",
      to: "/dashboard/notes",
      exact: true,
    },
    {
      label: "Todos",
      icon: "lucide:check-square",
      to: "/dashboard/notes/todos",
    },
  ],
  [
    {
      label: "Archive",
      icon: "lucide:archive",
      to: "/dashboard/notes/archive",
    },
    {
      label: "Trash",
      icon: "lucide:trash-2",
      to: "/dashboard/notes/trash",
    },
  ],
] satisfies NavigationMenuItem[][];
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
