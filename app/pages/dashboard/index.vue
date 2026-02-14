<script lang="ts" setup>
const { session } = useAuth();

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <UDashboardPanel v-if="session" id="home">
    <template #header>
      <UDashboardNavbar title="Home" icon="lucide:home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-xs">
        <h2>Welcome back, {{ session.user.name }}</h2>
        <p class="text-dimmed">Here's an overview of your personal dashboard.</p>
      </div>
    </template>
  </UDashboardPanel>
</template>
