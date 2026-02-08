<script lang="ts" setup>
import {type NavigationMenuItem} from "#ui/types'

definePageMeta({
  layout: "dashboard"
})

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Overview",
      icon: "lucide:layout-dashboard",
      to: "/dashboard/inbox",
      exact: true
    }
  ]
])
</script>

<template>
  <UDashboardPanel id="inbox" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar icon="lucide:layout-dashboard" title="Inbox" />

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
