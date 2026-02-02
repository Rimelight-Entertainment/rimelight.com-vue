<script lang="ts" setup>
import {z} from 'zod'
import {authClient} from "~~/auth/auth-client"

const toast = useToast()

const columns = [
  {accessorKey: 'name', header: 'Organization'},
  {accessorKey: 'slug', header: 'Slug'},
  {accessorKey: 'memberCount', header: 'Members'},
  {accessorKey: 'teams', header: 'Teams'},
  {accessorKey: 'createdAt', header: 'Created'},
  {id: 'actions', header: 'Actions'}
]

const {data: orgs, refresh, pending} = await useLazyFetch<any[]>('/api/admin/organizations')

const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)

const state = reactive({
  name: '',
  slug: '',
})

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string()
      .min(2, 'Slug must be at least 2 characters')
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and hyphenated'),
  logo: z.url().optional().or(z.literal('')),
})

type Schema = z.output<typeof schema>

async function onSubmit() {
  isSubmitting.value = true;

  try {
    const {data, error} = await authClient.organization.create({
      name: state.name,
      slug: state.slug,
      keepCurrentActiveOrganization: true,
    });

    if (error) {
      toast.add({
        title: 'Error',
        description: error.message || 'Failed to create organization',
        color: 'error'
      });
      return;
    }

    toast.add({
      title: 'Success',
      description: `Organization ${data?.name} created successfully.`,
      color: 'success'
    });

    // Reset state and UI
    isCreateModalOpen.value = false;
    Object.assign(state, {name: '', slug: ''});

    // Refresh the table data
    await refresh();
  } catch (err) {
    toast.add({
      title: 'Unexpected Error',
      description: 'An unknown error occurred during submission.',
      color: 'error'
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

  <UTable :columns="columns" :loading="pending" :rows="(orgs || []) as any[]">
    <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :alt="(row.original as any).name" :src="(row.original as any).logo" size="sm" />
      </div>
    </template>

    <template #teams-cell="{ row }">
      <div class="flex flex-wrap gap-1">
        <UBadge
          v-for="team in (row.original as any).teams"
          :key="team.id"
          color="neutral"
          size="xs"
          variant="soft"
        >
          {{ team.name }}
        </UBadge>
        <span v-if="!(row.original as any).teams?.length" class="text-xs text-gray-400 italic"
          >No teams</span
        >
      </div>
    </template>

    <template #createdAt-cell="{ row }"> </template>

    <template #actions-cell="{ row }">
      <UButton color="error" icon="lucide:trash" variant="ghost" />
    </template>
  </UTable>
</template>
