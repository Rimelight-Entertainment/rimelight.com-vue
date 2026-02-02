<script lang="ts" setup>
import {type NavigationMenuItem} from '@nuxt/ui'

definePageMeta({
  layout: "dashboard"
})

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Notes",
      icon: "lucide:sticky-note",
      to: "/dashboard/notes",
      exact: true
    }
  ],
  [
    {
      label: "Archive",
      icon: "lucide:archive",
      to: "/dashboard/notes/archive"
    },
    {
      label: "Trash",
      icon: "lucide:trash-2",
      to: "/dashboard/notes/trash"
    }
  ]
])
</script>

<template>
  <UDashboardPanel id="notes" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar icon="lucide:building-2" title="Notes" />

      <UDashboardToolbar>
        <UNavigationMenu :items="links" class="-mx-1 flex-1" highlight />
      </UDashboardToolbar>
    </template>

    <template #body>
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>

<style scoped></style>
