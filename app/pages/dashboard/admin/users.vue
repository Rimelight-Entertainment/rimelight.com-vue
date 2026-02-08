<script lang="ts" setup>
import {authClient} from "~~/auth/auth-client"

definePageMeta({
  layout: "dashboard"
})

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

<template></template>
