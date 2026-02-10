<script lang="ts" setup>
import {type NavigationMenuItem} from "#ui/types"

definePageMeta({
  layout: "dashboard"
})

const links = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: "General",
      icon: "lucide:cog",
      to: "/dashboard/settings"
    },
    {
      label: "Notifications",
      icon: "lucide:bell",
      to: "/dashboard/settings/notifications"
    },
    {
      label: "Security",
      icon: "lucide:shield",
      to: "/dashboard/settings/security"
    },
  ],
  []
]))
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar icon="lucide:cog" title="Settings" />

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
