<script lang="ts" setup>
import {type NavigationMenuItem} from '@nuxt/ui'

definePageMeta({
  layout: "dashboard"
})

const {permissions} = useAuth()

if (!permissions.admin.canAccess) {
  throw showError({
    statusCode: 403,
    statusMessage: "Forbidden: You do not have permission to access the admin panel."
  });
}

const links = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: "Overview",
      icon: "lucide:layout-dashboard",
      to: "/dashboard/admin",
      exact: true
    },
    {
      label: "Organizations",
      icon: "lucide:building-2",
      to: "/dashboard/admin/organizations"
    },
    {
      label: "Teams",
      icon: "lucide:users-round",
      to: "/dashboard/admin/organizations"
    },
    {
      label: "Users",
      icon: "lucide:user",
      to: "/dashboard/admin/users"
    },
  ],
  []
]))

const {data: organizationsCount} = await useApi('/api/admin/organizations/count')
const {data: teamsCount} = await useApi('/api/admin/teams/count')
const {data: usersCount} = await useApi('/api/admin/users/count')
const {data: sessionsCount} = await useApi('/api/admin/sessions/count')

console.log(organizationsCount)

const stats = computed(() => [
  {
    label: 'Total Organizations',
    value: organizationsCount.value ?? 0,
    icon: 'lucide:building-2'
  },
  {
    label: 'Total Teams',
    value: teamsCount.value ?? 0,
    icon: 'lucide:users'
  },
  {
    label: 'Total Users',
    value: usersCount.value ?? 0,
    icon: 'lucide:user'
  },
  {
    label: 'Active Sessions',
    value: sessionsCount.value ?? 0,
    icon: 'lucide:activity'
  }
])
</script>

<template>
  <UDashboardPanel id="admin" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar icon="lucide:building-2" title="Admin"/>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" class="-mx-1 flex-1" highlight/>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
        <UCard v-for="stat in stats" :key="stat.label">
          <div class="flex items-center gap-md">
            <UIcon :name="stat.icon" class="w-6 h-6 text-primary-500"/>

            <div>
              <p class="text-sm text-dimmed">{{ stat.label }}</p>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Admin Quick Links</h3>
        </template>

      </UCard>
    </template>
  </UDashboardPanel>
</template>