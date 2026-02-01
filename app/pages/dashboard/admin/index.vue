<script lang="ts" setup>
const {authClient} = useAuth()

const stats = ref([
  {label: 'Total Users', value: '0', icon: 'lucide:users'},
  {label: 'Total Organizations', value: '0', icon: 'lucide:building-2'},
  {label: 'Active Sessions', value: '0', icon: 'lucide:activity'}
])

const {data: usersData} = await authClient.admin.listUsers({
  query: {
    limit: 1
  }
})
if (usersData) {
  if (stats.value[0]) {
    stats.value[0].value = usersData.total.toString()
  }
}

// Better Auth doesn't have a direct listOrganizations for admin yet in the same way as users,
// but we might be able to count them if needed. For now, let's keep it simple.
</script>

<template>
  <UDashboardPanel grow>
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <UCard v-for="stat in stats" :key="stat.label">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <UIcon :name="stat.icon" class="w-6 h-6 text-primary-500"/>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Admin Quick Links</h3>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UButton color="neutral" icon="lucide:users" label="Manage Users" to="/dashboard/admin/users"
                   variant="ghost"/>
          <UButton color="neutral" icon="lucide:building-2" label="Manage Organizations"
                   to="/dashboard/admin/organizations" variant="ghost"/>
        </div>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
