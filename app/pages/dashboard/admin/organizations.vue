<script lang="ts" setup>
import type { TableColumn } from "#ui/types";
import { h, resolveComponent } from "vue";
import { z } from "zod";
import { authClient } from "~~/auth/auth-client";

const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const toast = useToast();

async function deleteOrg(id: string) {
  // Logic for deletion
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  memberCount: number;
  createdAt: string;
  teams: { id: string; name: string }[];
}

const columns: TableColumn<Organization>[] = [
  {
    accessorKey: "name",
    header: "Organization",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-3 font-medium" }, [
        h(UAvatar, {
          src: row.original.logo,
          alt: row.original.name,
          size: "sm",
        }),
        h("span", row.original.name),
      ]),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    meta: { class: { td: "font-mono text-xs" } },
  },
  {
    accessorKey: "memberCount",
    header: "Members",
  },
  {
    accessorKey: "teams",
    header: "Teams",
    cell: ({ row }) => {
      const teams = row.original.teams || [];
      if (!teams.length) return h("span", { class: "text-xs text-gray-400 italic" }, "No teams");

      return h(
        "div",
        { class: "flex flex-wrap gap-1" },
        teams.map((team) =>
          h(
            UBadge,
            {
              key: team.id,
              color: "neutral",
              variant: "soft",
              size: "xs",
            },
            () => team.name,
          ),
        ),
      );
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
            { label: "Edit Details", icon: "lucide:pencil" },
            {
              label: "Delete Organization",
              icon: "lucide:trash",
              color: "error",
              onSelect: () => deleteOrg(row.original.id),
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
  data: orgs,
  pending,
  refresh,
} = await useLazyFetch<Organization[]>("/api/admin/organizations", {
  default: () => [],
});

const isCreateModalOpen = ref(false);
const isSubmitting = ref(false);

const state = reactive({
  name: "",
  slug: "",
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and hyphenated"),
  logo: z.url().optional().or(z.literal("")),
});

type Schema = z.output<typeof schema>;

async function onSubmit() {
  isSubmitting.value = true;

  try {
    const { data, error } = await authClient.organization.create({
      name: state.name,
      slug: state.slug,
      keepCurrentActiveOrganization: true,
    });

    if (error) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to create organization",
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Success",
      description: `Organization ${data?.name} created successfully.`,
      color: "success",
    });

    // Reset state and UI
    isCreateModalOpen.value = false;
    Object.assign(state, { name: "", slug: "" });

    // Refresh the table data
    await refresh();
  } catch (err) {
    toast.add({
      title: "Unexpected Error",
      description: "An unknown error occurred during submission.",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="flex justify-end">
    <UModal
      v-model:open="isCreateModalOpen"
      description="Set up a new workspace for your teams."
      title="Create Organization"
    >
      <UButton color="primary" icon="lucide:plus" label="Create Organization" />

      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Organization Name" name="name">
            <UInput v-model="state.name" class="w-full" placeholder="Acme Corp" />
          </UFormField>

          <UFormField label="Slug" name="slug">
            <UInput v-model="state.slug" class="w-full" placeholder="acme-corp" />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton
              color="neutral"
              label="Cancel"
              variant="ghost"
              @click="isCreateModalOpen = false"
            />
            <UButton :loading="isSubmitting" color="primary" label="Create" type="submit" />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>

  <UTable
    :columns="columns"
    :data="orgs || []"
    :loading="pending"
    class="border rounded-lg border-gray-200 dark:border-gray-800"
  />
</template>
