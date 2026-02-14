<script lang="ts" setup>
import { type NavigationMenuItem } from "#ui/types";

definePageMeta({
  layout: "dashboard",
});

const { permissions } = useAuth();

if (!permissions.admin.canAccess.value) {
  throw showError({
    statusCode: 403,
    statusMessage: "Forbidden: You do not have permission to access the admin panel.",
  });
}

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Overview",
      icon: "lucide:layout-dashboard",
      to: "/dashboard/admin",
      exact: true,
    },
    {
      label: "Organizations",
      icon: "lucide:building-2",
      to: "/dashboard/admin/organizations",
    },
    {
      label: "Teams",
      icon: "lucide:users-round",
      to: "/dashboard/admin/teams",
    },
    {
      label: "Users",
      icon: "lucide:user",
      to: "/dashboard/admin/users",
    },
  ],
  [],
]);
</script>

<template>
  <UDashboardPanel id="admin" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar icon="lucide:building-2" title="Admin">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" class="-mx-1 flex-1" highlight />
      </UDashboardToolbar>
    </template>

    <template #body>
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>

<style scoped></style>
