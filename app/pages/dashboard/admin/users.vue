<script lang="ts" setup>
import { authClient } from "~~/auth/auth-client";

import { navigateTo } from "#app";
import { defaultWindow } from "rimelight-components/utils";
import type { TableColumn } from "@nuxt/ui";

const { confirm: confirmAction } = useConfirm();
const toast = useToast();

definePageMeta({
  layout: "dashboard",
});

interface UserTeam {
  id: string;
  name: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role?: string;
  logo?: string;
  memberId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  organizations?: Organization[];
  teams?: UserTeam[];
}

interface Member {
  user: User;
  role: string;
  userId: string;
}

interface ListUsersResponse {
  users: User[];
  total: number;
}

interface MembersResponse {
  data: Member[] | null;
  error: unknown | null;
}

type UsersDataResult = ListUsersResponse | MembersResponse;

const { data: organizations, pending: loadingOrgs } = await useApi<Organization[]>(
  "/api/admin/organizations",
);

const selectedOrg = ref<Organization | undefined>(undefined);

const page = ref(1);
const limit = 20;
const search = ref("");

const {
  data: usersData,
  refresh,
  pending: loadingUsers,
  error: usersError,
} = await useAsyncData<UsersDataResult>(
  "admin-users-list",
  async () => {
    try {
      if (selectedOrg.value) {
        // Fetch members of selected org
        const res = await authClient.organization.listMembers({
          query: {
            organizationId: selectedOrg.value.id,
            limit,
            offset: (page.value - 1) * limit,
          },
        });
        return res as MembersResponse;
      } else {
        // Fetch all users via server API
        return await $fetch<ListUsersResponse>("/api/admin/users", {
          query: {
            limit,
            offset: (page.value - 1) * limit,
            search: search.value || undefined,
          },
        });
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
      return null as any;
    }
  },
  {
    watch: [page, search, selectedOrg],
  },
);

interface NormalizedUser {
  user: User;
  orgRole: string | null;
  userId: string;
  memberId?: string;
  organizations: Organization[];
  teams: UserTeam[];
}

// Normalize data
const normalizedUsers = computed<NormalizedUser[]>(() => {
  const result = usersData.value;
  if (!result) return [];

  if (selectedOrg.value && "data" in result) {
    // It's a list of members from better-auth: { data: Member[], error: ... }
    const res = result as MembersResponse;
    const members = res.data || [];
    return members.map((member: any) => ({
      user: member.user,
      orgRole: member.role,
      userId: member.userId,
      memberId: member.id, // BetterAuth member table ID
      organizations: member.user.organizations || [],
      teams: member.user.teams || [],
    }));
  } else {
    // It's { users, total } from our API
    const res = result as ListUsersResponse;
    const users = res.users || (Array.isArray(result) ? result : []);
    return users.map((user: User) => ({
      user,
      orgRole: null,
      userId: user.id,
      memberId: undefined,
      organizations: user.organizations || [],
      teams: user.teams || [],
    }));
  }
});

const totalUsers = computed(() => {
  const result = usersData.value;
  if (!result) return 0;
  if (selectedOrg.value) return 100; // better-auth listMembers might not return total easily
  return (result as ListUsersResponse).total || 0;
});

const orgOptions = computed<Organization[]>(() => [
  { id: "all", name: "All Users", slug: "all" },
  ...(organizations.value || []),
]);

const displayOrg = computed({
  get: () => selectedOrg.value || orgOptions.value[0],
  set: (val) => {
    if (!val || val.id === "all") {
      selectedOrg.value = undefined;
    } else {
      selectedOrg.value = val;
    }
  },
});

const columns = computed<TableColumn<NormalizedUser>[]>(() => [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }: { row: { original: NormalizedUser } }) => {
      const user = row.original.user;
      return h("div", { class: "flex items-center gap-3" }, [
        h(resolveComponent("UAvatar"), {
          src: user.image || undefined,
          alt: user.name,
          size: "xs",
        }),
        h("div", { class: "flex flex-col" }, [
          h("span", { class: "text-sm font-medium text-gray-900 dark:text-white" }, user.name),
          h("span", { class: "text-xs text-gray-500 dark:text-gray-400" }, user.email),
        ]),
      ]);
    },
  },
  ...(selectedOrg.value
    ? [
        {
          accessorKey: "orgRole",
          header: "Org Role",
          cell: ({ row }: { row: { original: NormalizedUser } }) => {
            const role = row.original.orgRole;
            return h(
              resolveComponent("UBadge"),
              {
                color: role === "owner" ? "primary" : role === "admin" ? "amber" : "gray",
                variant: "subtle",
                size: "xs",
                class: "capitalize",
              },
              () => role,
            );
          },
        },
      ]
    : []),
  {
    accessorKey: "user.role",
    header: "System Role",
    cell: ({ row }: { row: { original: NormalizedUser } }) => {
      const role = row.original.user.role;
      return h(
        resolveComponent("UBadge"),
        {
          color: role === "admin" ? "red" : "gray",
          variant: "subtle",
          size: "xs",
          class: "capitalize",
        },
        () => role || "user",
      );
    },
  },
  {
    accessorKey: "organizations",
    header: "Organizations",
    cell: ({ row }: { row: { original: NormalizedUser } }) => {
      const orgs = row.original.organizations;
      if (!orgs?.length) return h("span", { class: "text-xs text-gray-400 italic" }, "None");

      return h(
        "div",
        { class: "flex flex-wrap gap-1 max-w-[200px]" },
        orgs.map((org: Organization) =>
          h(
            resolveComponent("UBadge"),
            {
              key: org.id,
              variant: "subtle",
              size: "xs",
              color: "neutral",
              class: "truncate",
            },
            () => org.name,
          ),
        ),
      );
    },
  },
  {
    accessorKey: "teams",
    header: "Teams",
    cell: ({ row }: { row: { original: NormalizedUser } }) => {
      const teams = row.original.teams;
      if (!teams?.length) return h("span", { class: "text-xs text-gray-400 italic" }, "None");

      return h(
        "div",
        { class: "flex flex-wrap gap-1 max-w-[200px]" },
        teams.map((t: UserTeam) =>
          h(
            resolveComponent("UBadge"),
            {
              key: t.id,
              variant: "subtle",
              size: "xs",
              color: "neutral",
              class: "truncate",
            },
            () => t.name,
          ),
        ),
      );
    },
  },
  {
    accessorKey: "user.banned",
    header: "Status",
    cell: ({ row }: { row: { original: NormalizedUser } }) => {
      const banned = row.original.user.banned;
      return h(
        resolveComponent("UBadge"),
        {
          color: banned ? "red" : "green",
          variant: "subtle",
          size: "xs",
        },
        () => (banned ? "Banned" : "Active"),
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
]);

// Actions
const isBanModalOpen = ref(false);
const selectedUser = ref<any>(null);
const banReason = ref("");

// Manage User Modal
const isManageModalOpen = ref(false);
const userToManage = ref<NormalizedUser | null>(null);
const { data: allTeams } = await useApi<any[]>("/api/admin/teams", { query: { all: "true" } });

const openBanModal = (user: any) => {
  selectedUser.value = user;
  isBanModalOpen.value = true;
};

const openManageModal = (user: any) => {
  userToManage.value = JSON.parse(JSON.stringify(user)); // Clone for safe local updates
  isManageModalOpen.value = true;
};

const banUser = async () => {
  if (!selectedUser.value) return;

  const confirmed = await confirmAction({
    title: "Ban User",
    description: `Are you sure you want to ban ${selectedUser.value.user.name}? This will prevent them from accessing the platform.`,
    danger: true,
    confirmLabel: "Ban User",
  });

  if (!confirmed) return;

  const userId = selectedUser.value.userId || selectedUser.value.user?.id;

  const { error } = await authClient.admin.banUser({
    userId: userId,
    banReason: banReason.value,
  });

  if (!error) {
    isBanModalOpen.value = false;
    toast.add({ title: "User banned", color: "success" });
    refresh();
  } else {
    toast.add({ title: "Failed to ban user", description: error.message, color: "error" });
  }
};

const unbanUser = async (userId: string) => {
  const { error } = await authClient.admin.unbanUser({ userId });
  if (!error) refresh();
};

const impersonateUser = async (userId: string) => {
  const { error } = await authClient.admin.impersonateUser({ userId });
  if (!error) {
    navigateTo("/dashboard");
    if (defaultWindow) {
      defaultWindow.location.reload();
    }
  }
};

const removeUserFromOrg = async (orgId: string) => {
  if (!userToManage.value) return;
  const confirmed = await confirmAction({
    title: "Remove from Organization",
    description: `Are you sure you want to remove ${userToManage.value.user.name} from this organization?`,
    danger: true,
    confirmLabel: "Remove",
  });
  if (!confirmed) return;

  try {
    await $fetch("/api/admin/organizations/members", {
      method: "DELETE",
      query: { organizationId: orgId, userId: userToManage.value.userId },
    });
    toast.add({ title: "Removed from organization", color: "success" });
    refresh();
    if (userToManage.value) {
      userToManage.value.organizations = userToManage.value.organizations.filter(
        (o: any) => o.id !== orgId,
      );
    }
  } catch (e: any) {
    toast.add({ title: "Error", description: e.message, color: "error" });
  }
};

const removeUserFromTeam = async (teamId: string) => {
  if (!userToManage.value) return;
  const confirmed = await confirmAction({
    title: "Remove from Team",
    description: `Are you sure you want to remove ${userToManage.value.user.name} from this team?`,
    danger: true,
    confirmLabel: "Remove",
  });
  if (!confirmed) return;

  try {
    await $fetch("/api/admin/teams/members", {
      method: "DELETE",
      query: { teamId, userId: userToManage.value.userId },
    });
    toast.add({ title: "Removed from team", color: "success" });
    refresh();
    if (userToManage.value) {
      userToManage.value.teams = userToManage.value.teams.filter((t: any) => t.id !== teamId);
    }
  } catch (e: any) {
    toast.add({ title: "Error", description: e.message, color: "error" });
  }
};

const addToOrgState = reactive({
  org: undefined as Organization | undefined,
  role: "member",
});

const addToTeamStates = ref<Record<string, UserTeam | undefined>>({});

const getTeamsForOrg = (orgId: string) => {
  return allTeams.value?.filter((t: any) => t.organizationId === orgId) || [];
};

const addUserToOrg = async () => {
  if (!userToManage.value || !addToOrgState.org) return;
  try {
    await $fetch("/api/admin/organizations/members", {
      method: "POST",
      body: {
        organizationId: addToOrgState.org.id,
        userId: userToManage.value.userId,
        role: addToOrgState.role,
      },
    });
    toast.add({ title: "Added to organization", color: "success" });
    refresh();
    if (userToManage.value && addToOrgState.org) {
      const newOrg = { ...addToOrgState.org };
      if (!userToManage.value.organizations.find((o: any) => o.id === newOrg.id)) {
        userToManage.value.organizations.push(newOrg);
      }
    }
    addToOrgState.org = undefined;
  } catch (e: any) {
    toast.add({ title: "Error", description: e.message, color: "error" });
  }
};

const addUserToTeam = async (orgId: string) => {
  const selectedTeam = addToTeamStates.value[orgId];
  if (!userToManage.value || !selectedTeam) return;
  try {
    await $fetch("/api/admin/teams/members", {
      method: "POST",
      body: {
        teamId: selectedTeam.id,
        userId: userToManage.value.userId,
        role: "member",
      },
    });
    toast.add({ title: "Added to team", color: "success" });
    refresh();
    if (userToManage.value) {
      const newTeam = { ...selectedTeam };
      if (!userToManage.value.teams.find((t) => t.id === newTeam.id)) {
        userToManage.value.teams.push(newTeam);
      }
    }
    addToTeamStates.value[orgId] = undefined;
  } catch (e: any) {
    toast.add({ title: "Error", description: e.message, color: "error" });
  }
};

const items = (row: NormalizedUser) => {
  const userId = row.userId || row.user.id;

  return [
    [
      {
        label: "Impersonate",
        icon: "lucide:user-round-search",
        onSelect: () => impersonateUser(userId),
      },
    ],
    [
      {
        label: "Manage User",
        icon: "lucide:settings-2",
        onSelect: () => openManageModal(row),
      },
    ],
    [
      {
        label: row.user.banned ? "Unban User" : "Ban User",
        icon: row.user.banned ? "lucide:lock-open" : "lucide:ban",
        color: row.user.banned ? "success" : "warning",
        onSelect: () => (row.user.banned ? unbanUser(userId) : openBanModal(row)),
      },
    ],
  ];
};
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-2">
        <h2 class="text-2xl font-bold">Users</h2>
        <span v-if="normalizedUsers.length" class="text-gray-500 text-sm"
          >({{ normalizedUsers.length }})</span
        >
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <USelectMenu
          v-model="displayOrg"
          :items="orgOptions"
          option-attribute="name"
          placeholder="Filter by Organization"
          searchable
          clear-search-on-close
          class="w-full sm:w-64"
        >
          <template #default="{ modelValue }">
            <span class="flex items-center gap-2">
              <UAvatar
                v-if="modelValue?.logo"
                :src="modelValue.logo"
                :alt="modelValue.name"
                size="2xs"
              />
              <span class="truncate">{{ modelValue?.name }}</span>
            </span>
          </template>
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <UAvatar v-if="item.logo" :src="item.logo" :alt="item.name" size="2xs" />
              <span class="truncate">{{ item.name }}</span>
            </div>
          </template>
        </USelectMenu>

        <!-- Clear Filter Button if selected -->
        <UButton
          v-if="selectedOrg"
          icon="lucide:x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="selectedOrg = undefined"
          title="Clear Filter"
        />

        <UInput
          v-model="search"
          icon="lucide:search"
          placeholder="Search users..."
          class="w-full sm:w-64"
        />
      </div>
    </div>

    <!-- Empty State -->

    <UTable
      :columns="columns"
      :data="normalizedUsers"
      :loading="loadingUsers || loadingOrgs"
      class="flex-1"
    >
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="items(row.original)">
          <UButton color="neutral" icon="lucide:ellipsis-vertical" variant="ghost" />
        </UDropdownMenu>
      </template>

      <template #empty>
        <div class="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <span v-if="selectedOrg">No members found in {{ selectedOrg.name }}</span>
          <span v-else>No users found matching your search.</span>
        </div>
      </template>
    </UTable>

    <!-- Pagination -->
    <div
      v-if="totalUsers > limit"
      class="flex justify-center border-t border-gray-200 dark:border-gray-800 pt-4"
    >
      <UPagination v-model="page" :total="totalUsers" :page-size="limit" />
    </div>

    <!-- Ban Modal -->
    <UModal
      v-model:open="isBanModalOpen"
      title="Ban User"
      description="Prevent this user from accessing the platform."
    >
      <template #body>
        <UFormField label="Reason for ban" name="banReason">
          <UTextarea v-model="banReason" placeholder="Violation of terms..." />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" label="Cancel" variant="ghost" @click="isBanModalOpen = false" />
          <UButton color="error" label="Ban User" @click="banUser" />
        </div>
      </template>
    </UModal>

    <!-- Manage User Modal -->
    <UModal v-model:open="isManageModalOpen" :title="`Manage User: ${userToManage?.user?.name}`">
      <template #description>
        Manage organizations and teams for <strong>{{ userToManage?.user?.email }}</strong
        >.
      </template>
      <template #body>
        <div class="flex flex-col gap-6">
          <!-- Organizations & Teams -->
          <div class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold flex items-center gap-2">
              <UIcon name="lucide:building-2" class="size-4" />
              Organizations & Teams
            </h3>

            <div v-if="userToManage?.organizations?.length" class="flex flex-col gap-3">
              <div
                v-for="org in userToManage.organizations"
                :key="org.id"
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex flex-col gap-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UAvatar :src="org.logo" :alt="org.name" size="2xs" />
                    <div class="flex flex-col">
                      <span class="text-sm font-bold">{{ org.name }}</span>
                      <span class="text-[10px] uppercase font-bold text-gray-400">{{
                        org.role || "Member"
                      }}</span>
                    </div>
                  </div>
                  <UButton
                    icon="lucide:user-minus"
                    color="error"
                    variant="ghost"
                    size="xs"
                    @click="removeUserFromOrg(org.id)"
                  />
                </div>

                <!-- Teams for this Org -->
                <div
                  class="flex flex-col gap-2 pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                >
                  <div
                    class="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400"
                  >
                    <UIcon name="lucide:users" class="size-3" />
                    Teams
                  </div>

                  <div
                    v-for="team in userToManage.teams.filter((t) => t.organizationId === org.id)"
                    :key="team.id"
                    class="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span class="text-xs text-gray-600 dark:text-gray-400 capitalize">{{
                      team.name
                    }}</span>
                    <UButton
                      icon="lucide:x"
                      color="error"
                      variant="ghost"
                      size="xs"
                      @click="removeUserFromTeam(team.id)"
                    />
                  </div>
                  <div
                    v-if="!userToManage.teams.filter((t) => t.organizationId === org.id).length"
                    class="text-[10px] text-gray-400 italic"
                  >
                    No teams in this organization.
                  </div>

                  <div class="flex items-center gap-2 mt-1">
                    <USelectMenu
                      v-model="addToTeamStates[org.id]"
                      :items="getTeamsForOrg(org.id)"
                      label-key="name"
                      placeholder="Add to team..."
                      size="xs"
                      class="flex-1"
                    />
                    <UButton
                      icon="lucide:plus"
                      size="xs"
                      color="neutral"
                      @click="addUserToTeam(org.id)"
                      :disabled="!addToTeamStates[org.id]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500 italic">Not a member of any organization.</p>

            <div class="flex items-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div class="flex-1 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-gray-400"
                  >Join New Organization</span
                >
                <USelectMenu
                  v-model="addToOrgState.org"
                  :items="organizations || []"
                  label-key="name"
                  placeholder="Select Org"
                  searchable
                  class="w-full"
                />
              </div>
              <div class="w-24 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-gray-400">As Role</span>
                <USelect
                  v-model="addToOrgState.role"
                  :items="['member', 'admin', 'owner']"
                  size="sm"
                  class="w-full"
                />
              </div>
              <UButton
                icon="lucide:plus"
                color="primary"
                @click="addUserToOrg"
                :disabled="!addToOrgState.org"
              />
            </div>
          </div>

          <!-- Dangerous Actions -->
          <UAlert
            color="error"
            variant="subtle"
            icon="lucide:shield-alert"
            title="Danger Zone"
            class="mt-4"
          >
            <template #description>
              <div class="flex flex-col gap-3 mt-2">
                <p class="text-xs opacity-90">
                  Actions here can significantly impact the user's account access.
                </p>
                <UButton
                  :label="userToManage?.user?.banned ? 'Unban User' : 'Ban User'"
                  :icon="userToManage?.user?.banned ? 'lucide:lock-open' : 'lucide:ban'"
                  :color="userToManage?.user?.banned ? 'success' : 'error'"
                  variant="outline"
                  class="w-full"
                  @click="
                    userToManage?.user?.banned
                      ? unbanUser(userToManage.userId)
                      : openBanModal(userToManage)
                  "
                />
              </div>
            </template>
          </UAlert>
        </div>
      </template>
      <template #footer>
        <UButton color="neutral" label="Close" class="w-full" @click="isManageModalOpen = false" />
      </template>
    </UModal>
  </div>
</template>
