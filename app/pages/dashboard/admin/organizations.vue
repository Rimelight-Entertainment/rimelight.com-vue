<script lang="ts" setup>
const columns = [
  {accessorKey: 'name', header: 'Organization'},
  {accessorKey: 'slug', header: 'Slug'},
  {accessorKey: 'memberCount', header: 'Members'},
  {accessorKey: 'teams', header: 'Teams'},
  {accessorKey: 'createdAt', header: 'Created'},
  {id: 'actions', header: 'Actions'}
]

const {data: orgs, refresh, pending} = await useFetch<any[]>('/api/admin/organizations')

const deleteOrg = async (id: string) => {
  if (!confirm('Are you sure you want to delete this organization? All data including teams and memberships will be lost.')) return

  const {error} = await useFetch(`/api/admin/organizations/${id}`, {
    method: 'DELETE' as any
  })
  if (!error.value) refresh()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <UDashboardPanel id="organizations" :ui="{ body: 'lg:py-12' }">
    <template #body>
      <UTable :columns="columns" :loading="pending" :rows="(orgs || []) as any[]">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :alt="(row.original as any).name" :src="(row.original as any).logo" size="sm"/>
            <span class="font-medium text-gray-900 dark:text-white">{{ (row.original as any).name }}</span>
          </div>
        </template>

        <template #teams-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge v-for="team in (row.original as any).teams" :key="team.id" color="neutral" size="xs" variant="soft">
              {{ team.name }}
            </UBadge>
            <span v-if="!(row.original as any).teams?.length" class="text-xs text-gray-400 italic">No teams</span>
          </div>
        </template>

        <template #createdAt-cell="{ row }">
          {{ formatDate((row.original as any).createdAt) }}
        </template>

        <template #actions-cell="{ row }">
          <UButton color="error" icon="lucide:trash" variant="ghost" @click="deleteOrg((row.original as any).id)"/>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
