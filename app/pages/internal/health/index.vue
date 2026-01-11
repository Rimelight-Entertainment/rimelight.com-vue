<script setup lang="ts">
import { type NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: "dashboard"
})

const links = computed<NavigationMenuItem[][]>(() => ([
    [
      {
        label: 'Overview',
        icon: 'lucide:home',
        to: '/internal/health',
        exact: true
      },
      {
        label: 'Workout',
        icon: 'i-lucide-users',
        to: '/settings/members'
      },
      {
        label: 'Notifications',
        icon: 'i-lucide-bell',
        to: '/settings/notifications'
      },
      {
        label: 'Security',
        icon: 'i-lucide-shield',
        to: '/settings/security'
      }
    ],
    [
      {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
      target: '_blank'
    }
  ]
]))
</script>

<template>
  <UDashboardPanel id="health" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Health">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col w-full lg:max-w-4xl mx-auto">

      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped></style>
