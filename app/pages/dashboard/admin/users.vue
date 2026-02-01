<script lang="ts" setup>
const {authClient} = useAuth()

const columns = [
  {accessorKey: 'name', header: 'Name'},
  {accessorKey: 'email', header: 'Email'},
  {accessorKey: 'role', header: 'Role'},
  {accessorKey: 'status', header: 'Status'},
  {id: 'actions', header: 'Actions'}
]

const page = ref(1)
const limit = 10
const search = ref('')

const {data: usersData, refresh, pending} = await useAsyncData('admin-users', () => authClient.admin.listUsers({
  query: {
    limit,
    offset: (page.value - 1) * limit,
    searchValue: search.value,
    searchField: 'name'
  }
}), {
  watch: [page, search]
})

const users = computed(() => (usersData.value as any)?.data?.users || [])
const total = computed(() => (usersData.value as any)?.data?.total || 0)

const isBanModalOpen = ref(false)
const selectedUser = ref<any>(null)
const banReason = ref('')

const openBanModal = (user: any) => {
  selectedUser.value = user
  isBanModalOpen.value = true
}

const banUser = async () => {
  if (!selectedUser.value) return
  const {error} = await authClient.admin.banUser({
    userId: selectedUser.value.id,
    banReason: banReason.value
  })
  if (!error) {
    isBanModalOpen.value = false
    refresh()
  }
}

const unbanUser = async (userId: string) => {
  const {error} = await authClient.admin.unbanUser({userId})
  if (!error) refresh()
}

const impersonateUser = async (userId: string) => {
  const {error} = await authClient.admin.impersonateUser({userId})
  if (!error) {
    navigateTo('/dashboard')
    window.location.reload()
  }
}

const deleteUser = async (userId: string) => {
  if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return
  const {error} = await authClient.admin.removeUser({userId})
  if (!error) refresh()
}

const setRole = async (userId: string, role: string) => {
  const {error} = await authClient.admin.setRole({
    userId,
    role: role as "user" | "admin"
  })
  if (!error) refresh()
}

const items = (row: any) => [
  [
    {
      label: 'Impersonate',
      icon: 'lucide:user-round-search',
      onSelect: () => impersonateUser(row.id)
    }
  ],
  [
    {
      label: row.banned ? 'Unban' : 'Ban',
      icon: row.banned ? 'lucide:lock-open' : 'lucide:ban',
      color: row.banned ? 'success' : 'warning',
      onSelect: () => row.banned ? unbanUser(row.id) : openBanModal(row)
    },
    {
      label: 'Make Admin',
      icon: 'lucide:shield-plus',
      disabled: row.role === 'admin' || row.role === 'owner',
      onSelect: () => setRole(row.id, 'admin')
    },
    {
      label: 'Make User',
      icon: 'lucide:user',
      disabled: row.role === 'user',
      onSelect: () => setRole(row.id, 'user')
    }
  ],
  [
    {
      label: 'Delete',
      icon: 'lucide:trash',
      color: 'error',
      onSelect: () => deleteUser(row.id)
    }
  ]
]
</script>

<template>
  <UDashboardPanel grow>
    <template #body>
      <UDashboardToolbar>
        <template #left>
          <UInput v-model="search" icon="lucide:search" placeholder="Search users..."/>
        </template>
      </UDashboardToolbar>

      <UTable :columns="columns" :loading="pending" :rows="users as any[]">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :alt="(row.original as any).name" :src="(row.original as any).image" size="sm"/>
            <span class="font-medium text-gray-900 dark:text-white">{{ (row.original as any).name }}</span>
          </div>
        </template>

        <template #role-cell="{ row }">
          <UBadge
              :color="(row.original as any).role === 'admin' || (row.original as any).role === 'owner' ? 'primary' : 'neutral'"
              variant="soft">
            {{ (row.original as any).role }}
          </UBadge>
        </template>

        <template #status-cell="{ row }">
          <UBadge v-if="(row.original as any).banned" color="error" variant="soft">Banned</UBadge>
          <UBadge v-else color="success" variant="soft">Active</UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="items(row.original)">
            <UButton color="neutral" icon="lucide:ellipsis" variant="ghost"/>
          </UDropdownMenu>
        </template>
      </UTable>

      <div v-if="total > limit" class="flex justify-center mt-4">
        <UPagination v-model="page" :page-count="limit" :total="total"/>
      </div>

      <UModal v-model="isBanModalOpen">
        <UCard :ui="{ body: 'p-4', header: 'p-4', footer: 'p-4' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Ban User: {{ selectedUser?.name }}
              </h3>
              <UButton class="-my-1" color="neutral" icon="lucide:x" variant="ghost" @click="isBanModalOpen = false"/>
            </div>
          </template>

          <UFormField label="Reason" name="reason">
            <UInput v-model="banReason" placeholder="Spamming, inappropriate behavior, etc."/>
          </UFormField>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="neutral" label="Cancel" variant="ghost" @click="isBanModalOpen = false"/>
              <UButton color="error" label="Ban User" @click="banUser"/>
            </div>
          </template>
        </UCard>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
