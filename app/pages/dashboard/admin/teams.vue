<script lang="ts" setup>
import type { TableColumn } from "#ui/types";

import { h, resolveComponent } from "vue";
import { z } from "zod";
import { authClient } from "~~/auth/auth-client";

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const toast = useToast();
const activeOrganization = authClient.useActiveOrganization();

interface Team {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  memberCount: number;
  createdAt: string;
  parentId: string | null;
  subteams?: Team[];
}

const getAggregateMemberCount = (team: Team): number => {
  const direct = team.memberCount || 0;
  const subteamTotal =
    team.subteams?.reduce((acc, subteam) => acc + getAggregateMemberCount(subteam), 0) || 0;
  return direct + subteamTotal;
};

const getSubteamAggregateCount = (team: Team): number => {
  if (!team.subteams?.length) return 0;
  return team.subteams.reduce((acc, subteam) => {
    return acc + (subteam.memberCount || 0);
  }, 0);
};

const columns: TableColumn<Team>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      // Only show expand button if there are subteams
      if (!row.original.subteams?.length) return null;

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "lucide:chevron-right",
        square: true,
        ui: {
          leadingIcon: [
            "transition-transform duration-200",
            row.getIsExpanded() ? "rotate-90" : "",
          ],
        },
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          row.toggleExpanded();
        },
      });
    },
  },
  {
    accessorKey: "name",
    header: "Team",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-sm font-medium" }, [
        h(UAvatar, {
          src: row.original.logo,
          alt: row.original.name,
          size: "sm",
        }),
        h("span", row.original.name),
      ]),
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    cell: ({ row }) => {
      const team = row.original;
      const totalHeadcount = team.memberCount || 0;
      const subteamHeadcount = getSubteamAggregateCount(team);

      // Calculate those who are ONLY in the parent
      const exclusiveParent = Math.max(0, totalHeadcount - subteamHeadcount);

      return h("div", { class: "flex flex-col gap-1" }, [
        h("div", { class: "flex items-center gap-2" }, [
          h("span", { class: "text-sm font-bold" }, totalHeadcount.toLocaleString()),
          h(
            "span",
            {
              class:
                "text-[10px] uppercase px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
            },
            "Total",
          ),
        ]),
        h("div", { class: "flex items-center gap-3 text-xs text-muted-foreground" }, [
          h("span", { class: "flex items-center gap-1" }, [
            h("span", { class: "w-1.5 h-1.5 rounded-full bg-primary-500" }),
            `${exclusiveParent} Exclusive`,
          ]),
          subteamHeadcount > 0
            ? h("span", { class: "flex items-center gap-1" }, [
                h("span", { class: "w-1.5 h-1.5 rounded-full bg-orange-400" }),
                `${subteamHeadcount} via Subteams`,
              ])
            : null,
        ]),
      ]);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "",
    meta: { class: { td: "text-right" } },
    cell: ({ row }) =>
      h(
        UDropdownMenu,
        {
          content: { align: "end" },
          items: [
            {
              label: "Add Subteam",
              icon: "lucide:plus-circle",
              onSelect: () => openCreateSubteamModal(row.original),
            },
            {
              label: "Manage Members",
              icon: "lucide:users",
              onSelect: () => openMembersModal(row.original),
            },
            {
              label: "Edit Details",
              icon: "lucide:pencil",
              onSelect: () => openUpdateModal(row.original),
            },
            {
              label: "Delete Team",
              icon: "lucide:trash",
              color: "error",
              onSelect: () => deleteTeam(row.original.id),
            },
          ],
        },
        () =>
          h(UButton, {
            icon: "lucide:ellipsis-vertical",
            variant: "ghost",
            color: "neutral",
          }),
      ),
  },
];

const {
  data: teams,
  pending,
  refresh,
} = await useLazyFetch<Team[]>("/api/admin/teams", {
  default: () => [],
});

const isCreateModalOpen = ref(false);
const isSubmitting = ref(false);

function openCreateSubteamModal(parent: Team) {
  state.parentId = parent.id;
  state.parentName = parent.name;
  isCreateModalOpen.value = true;
}

const state = reactive({
  name: "",
  parentId: null as string | null,
  parentName: "",
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type Schema = z.output<typeof schema>;
const expanded = ref({});
const isUpdateModalOpen = ref(false);
const isMembersModalOpen = ref(false);
const selectedTeam = ref<Team | null>(null);

interface TeamMemberResponse {
  id: string;
  teamId: string;
  userId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    // Add other user fields if you need to reference them in the table
  };
}

// Update the ref to use the new interface
const teamMembers = ref<TeamMemberResponse[]>([]);
const isLoadingMembers = ref(false);

function openUpdateModal(team: Team) {
  updateState.id = team.id;
  updateState.name = team.name;
  isUpdateModalOpen.value = true;
}

function openMembersModal(team: Team) {
  selectedTeam.value = team;
  fetchTeamMembers(team.id);
  isMembersModalOpen.value = true;
}

const updateState = reactive({
  id: "",
  name: "",
});

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

async function createTeam() {
  isSubmitting.value = true;
  try {
    await $api("/api/admin/teams", {
      method: "POST",
      body: {
        name: state.name,
        parentId: state.parentId,
      },
    });
    toast.add({ title: "Success", description: `Team created.`, color: "success" });
    isCreateModalOpen.value = false;
    Object.assign(state, { name: "", parentId: null, parentName: "" });
    await refresh();
  } catch (err: any) {
    toast.add({ title: "Error", description: err.message, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

async function updateTeam() {
  if (!activeOrganization.value?.data?.id) return;

  isSubmitting.value = true;
  try {
    await $api(`/api/admin/teams/${updateState.id}`, {
      method: "PATCH",
      body: { name: updateState.name },
    });

    toast.add({ title: "Success", description: "Team updated.", color: "success" });
    isUpdateModalOpen.value = false;
    await refresh();
  } catch (err: any) {
    toast.add({ title: "Error", description: err.message, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

async function fetchTeamMembers(teamId: string) {
  isLoadingMembers.value = true;
  try {
    // const {data, error} = await authClient.organization.listTeamMembers({
    //   query: {teamId}
    // })
    // if (error) throw error
    // teamMembers.value = data ?? []
  } catch (err: any) {
    toast.add({
      title: "Fetch Error",
      description: err.message || "Could not load members.",
      color: "error",
    });
  } finally {
    isLoadingMembers.value = false;
  }
}

async function addMemberToTeam(userId: string) {
  if (!selectedTeam.value) return;

  // try {
  //   // 1. Add to the specific subteam
  //   const {error} = await authClient.organization.addTeamMember({
  //     teamId: selectedTeam.value.id,
  //     userId: userId
  //   })
  //   if (error) throw error
  //
  //   // 2. If it has a parent, add to parent as well
  //   if (selectedTeam.value.parentId) {
  //     await authClient.organization.addTeamMember({
  //       teamId: selectedTeam.value.parentId,
  //       userId: userId
  //     }).catch(() => {
  //       // Ignore if they are already in the parent team
  //     })
  //   }
  //
  //   toast.add({title: 'Success', description: 'Member added to team hierarchy.', color: 'success'})
  //   await fetchTeamMembers(selectedTeam.value.id)
  // } catch (err: any) {
  //   toast.add({title: 'Error', description: err.message, color: 'error'})
  // }
}

async function removeMemberFromTeam(userId: string) {
  // if (!selectedTeam.value) return
  //
  // try {
  //   const {error} = await authClient.organization.removeTeamMember({
  //     teamId: selectedTeam.value.id,
  //     userId: userId
  //   })
  //
  //   if (error) throw error
  //
  //   toast.add({title: 'Success', description: 'Member removed.', color: 'success'})
  //   await fetchTeamMembers(selectedTeam.value.id)
  // } catch (err: any) {
  //   toast.add({title: 'Error', description: err.message, color: 'error'})
  // }
}

async function deleteTeam(id: string) {
  const orgId = activeOrganization.value?.data?.id;

  if (!orgId) {
    toast.add({
      title: "Action Denied",
      description: "No active organization selected.",
      color: "error",
    });
    return;
  }

  try {
    await $api(`/api/admin/teams/${id}`, { method: "DELETE" });
    toast.add({
      title: "Success",
      description: "Team removed successfully.",
      color: "success",
    });

    await refresh();
  } catch (err) {
    toast.add({
      title: "Unexpected Error",
      description: "An unknown error occurred.",
      color: "error",
    });
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex justify-end">
      <UModal
        v-model:open="isCreateModalOpen"
        :description="
          state.parentId
            ? `Creating subteam for ${state.parentName}`
            : 'Set up a new team workspace.'
        "
        :title="state.parentId ? 'Add Subteam' : 'Create Team'"
      >
        <UButton
          icon="lucide:plus"
          label="Create Team"
          @click="
            () => {
              state.parentId = null;
              isCreateModalOpen = true;
            }
          "
        />

        <template #body>
          <UForm :schema="schema" :state="state" class="flex flex-col gap-sm" @submit="createTeam">
            <UFormField v-if="state.parentId" label="Parent Team">
              <UInput :placeholder="state.parentName" disabled variant="soft" />
            </UFormField>

            <UFormField label="Team Name" name="name">
              <UInput v-model="state.name" class="w-full" placeholder="e.g. Recruitment" />
            </UFormField>

            <div class="flex justify-between gap-sm">
              <UButton
                color="error"
                label="Cancel"
                variant="subtle"
                @click="isCreateModalOpen = false"
              />
              <UButton
                :label="state.parentId ? 'Add Subteam' : 'Create'"
                :loading="isSubmitting"
                color="primary"
                type="submit"
              />
            </div>
          </UForm>
        </template>
      </UModal>
      <UModal
        v-model:open="isUpdateModalOpen"
        description="Update the team name and settings."
        title="Edit Team"
      >
        <template #body>
          <UForm :schema="updateSchema" :state="updateState" class="space-y-4" @submit="updateTeam">
            <UFormField label="Team Name" name="name">
              <UInput v-model="updateState.name" class="w-full" />
            </UFormField>

            <div class="flex justify-between gap-sm">
              <UButton
                color="error"
                label="Cancel"
                variant="subtle"
                @click="isUpdateModalOpen = false"
              />
              <UButton :loading="isSubmitting" label="Save Changes" type="submit" />
            </div>
          </UForm>
        </template>
      </UModal>
      <UModal
        v-model:open="isMembersModalOpen"
        :title="`Manage Members: ${selectedTeam?.name}`"
        class="sm:max-w-2xl"
        description="View and manage users assigned to this team."
      >
        <template #body>
          <div class="space-y-6">
            <div class="flex gap-2"></div>

            <USeparator />

            <UTable
              :columns="[
                { accessorKey: 'user.name', header: 'Name' },
                { accessorKey: 'user.email', header: 'Email' },
                {
                  id: 'actions',
                  cell: ({ row }) =>
                    h(UButton, {
                      icon: 'lucide:user-minus',
                      color: 'error',
                      variant: 'ghost',
                      size: 'sm',
                      onClick: () => removeMemberFromTeam(row.original.userId), // Use userId for removal
                    }),
                },
              ]"
              :data="teamMembers"
              :loading="isLoadingMembers"
              class="border rounded-md max-h-96 overflow-y-auto"
            >
              <template #empty-state>
                <div class="flex flex-col items-center justify-center py-6 text-sm text-gray-500">
                  No members found in this team.
                </div>
              </template>
            </UTable>
          </div>
        </template>

        <template #footer>
          <UButton
            class="w-full"
            color="neutral"
            label="Close"
            @click="isMembersModalOpen = false"
          />
        </template>
      </UModal>
    </div>

    <UTable v-model:expanded="expanded" :columns="columns" :data="teams" :loading="pending">
      <template #expanded="{ row }">
        <UTable
          :columns="columns"
          :data="row.original.subteams"
          :ui="{ thead: 'hidden' }"
          class="-m-4"
        />
      </template>
    </UTable>
  </div>
</template>
