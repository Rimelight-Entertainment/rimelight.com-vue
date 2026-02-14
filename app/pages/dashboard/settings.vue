<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/types";

definePageMeta({
  layout: "dashboard",
});

const links = [
  [
    {
      label: "General",
      icon: "lucide:user",
      to: "/dashboard/settings",
      exact: true,
    },
    {
      label: "Notifications",
      icon: "lucide:bell",
      to: "/dashboard/settings/notifications",
    },
    {
      label: "Security",
      icon: "lucide:shield",
      to: "/dashboard/settings/security",
    },
  ],
] satisfies NavigationMenuItem[][];
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
        <aside class="lg:col-span-2">
          <UNavigationMenu orientation="vertical" highlight :items="links" />
        </aside>

        <div class="mt-8 lg:col-span-8 lg:mt-0">
          <NuxtPage />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
