<script lang="ts" setup>
definePageMeta({
  layout: "dashboard"
});

const {user} = useAuth();

if (!user.value || !["admin", "owner"].includes(user.value.role as string)) {
  throw showError({
    statusCode: 403,
    statusMessage: "Forbidden: You do not have permission to access the admin panel."
  });
}

const links = [
  {
    label: "Overview",
    icon: "lucide:layout-dashboard",
    to: "/dashboard/admin",
    exact: true
  },
  {
    label: "Users",
    icon: "lucide:users",
    to: "/dashboard/admin/users"
  },
  {
    label: "Organizations",
    icon: "lucide:building-2",
    to: "/dashboard/admin/organizations"
  }
]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Admin Panel">
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links"/>
      </UDashboardToolbar>

      <div class="flex-1 overflow-y-auto">
        <NuxtPage/>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
