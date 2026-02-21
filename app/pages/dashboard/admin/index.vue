<script lang="ts" setup>
const [
  { data: organizationsCount },
  { data: teamsCount },
  { data: usersCount },
  { data: sessionsCount },
] = await Promise.all([
  useApi<number>("/api/admin/organizations/count"),
  useApi<number>("/api/admin/teams/count"),
  useApi<number>("/api/admin/users/count"),
  useApi<number>("/api/admin/sessions/count"),
]);

const stats = computed(() => [
  {
    label: "Total Organizations",
    value: organizationsCount.value ?? 0,
    icon: "lucide:building-2",
  },
  {
    label: "Total Teams",
    value: teamsCount.value ?? 0,
    icon: "lucide:users",
  },
  {
    label: "Total Users",
    value: usersCount.value ?? 0,
    icon: "lucide:user",
  },
  {
    label: "Active Sessions",
    value: sessionsCount.value ?? 0,
    icon: "lucide:activity",
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
    <UCard v-for="stat in stats" :key="stat.label">
      <div class="flex items-center gap-md">
        <UIcon :name="stat.icon" class="w-6 h-6 text-primary-500" />

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
