<script lang="ts" setup>
import {type NavigationMenuItem} from "#ui/types"

definePageMeta({
  layout: "dashboard"
})

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Overview",
      icon: "lucide:layout-dashboard",
      to: "/dashboard/projects",
      exact: true
    }
  ]
])
</script>

<template>
  <UDashboardPanel id="notes" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar icon="lucide:layout-dashboard" title="Projects" />

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
