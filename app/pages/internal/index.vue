<script setup lang="ts">
const items = ref([])

definePageMeta({
  layout: "dashboard"
})

const modules = [
  {
    title: 'Inbox',
    description: 'Incoming tasks and messages',
    icon: 'i-lucide-inbox',
    to: '/internal/inbox',
    color: 'text-purple-500'
  },
  {
    title: 'Habits',
    description: 'Track daily habits and routines',
    icon: 'i-lucide-check-circle-2',
    to: '/internal/habits',
    color: 'text-green-500'
  },
  {
    title: 'Notes',
    description: 'Personal knowledge base',
    icon: 'i-lucide-file-text',
    to: '/internal/notes',
    color: 'text-blue-500'
  },
  {
    title: 'Customers',
    description: 'Manage client relationships',
    icon: 'i-lucide-users',
    to: '/internal/customers',
    color: 'text-orange-500'
  },
  {
    title: 'Housing',
    description: 'Property and utility management',
    icon: 'i-lucide-home',
    to: '/internal/housing',
    color: 'text-red-500'
  },
  {
    title: 'Health',
    description: 'Health metrics and tracking',
    icon: 'i-lucide-heart-pulse',
    to: '/internal/health',
    color: 'text-rose-500'
  },
  {
    title: 'Music',
    description: 'Library and playlists',
    icon: 'i-lucide-music',
    to: '/internal/music',
    color: 'text-pink-500'
  },
  {
    title: 'Watchlist',
    description: 'Movies, series, and books tracker',
    icon: 'i-lucide-play-circle',
    to: '/internal/watchlist',
    color: 'text-cyan-500'
  },
]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left> </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mb-8">
        <h2 class="text-2xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p class="text-gray-500 dark:text-gray-400">
          Here's an overview of your personal dashboard.
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UCard
          v-for="mod in modules"
          :key="mod.to"
          class="hover:ring-2 hover:ring-primary-500/50 transition-all cursor-pointer"
          @click="navigateTo(mod.to)"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon :name="mod.icon" class="w-6 h-6" :class="mod.color" />
              <h3 class="font-semibold">{{ mod.title }}</h3>
            </div>
          </template>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ mod.description }}
          </p>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
