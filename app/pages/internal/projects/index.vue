<script setup lang="ts">
import { z } from 'zod'
import { format } from 'date-fns'

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()

// --- State ---
const isCreateModalOpen = ref(false)
const createBoardState = ref({
  title: '',
  description: ''
})

// --- Data Fetching ---
const { data: boards, refresh: refreshBoards, status } = await useAsyncData<any[]>('projects-boards', () => $api('/api/projects/boards'))

// --- Actions ---
const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
})

async function createBoard() {
  try {
    await $api('/api/projects/boards', {
      method: 'POST',
      body: createBoardState.value
    })
    toast.add({ title: 'Board created' })
    isCreateModalOpen.value = false
    createBoardState.value = { title: '', description: '' }
    refreshBoards()
  } catch (err) {
    toast.add({ title: 'Error creating board', color: 'error' })
  }
}

async function deleteBoard(id: string) {
  if (!confirm('Are you sure you want to delete this board?')) return

  try {
    await $api(`/api/projects/boards/${id}`, {
      method: 'DELETE'
    })
    toast.add({ title: 'Board deleted' })
    refreshBoards()
  } catch (err) {
    toast.add({ title: 'Error deleting board', color: 'error' })
  }
}

const items = (row: any) => [
  [{
    label: 'Open',
    icon: 'i-heroicons-arrow-top-right-on-square-20-solid',
    click: () => navigateTo(`/dashboard/projects/${row.id}`)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteBoard(row.id)
  }]
]
</script>

<template>
  <div class="flex flex-col h-full">
    <UDashboardNavbar title="Projects" :ui="{ right: 'gap-3' }">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #right>
        <UButton label="Create Board" icon="i-heroicons-plus" @click="isCreateModalOpen = true" />
      </template>
    </UDashboardNavbar>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="status === 'pending'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="i in 6" :key="i">
          <template #header>
            <div class="flex justify-between items-start">
              <USkeleton class="h-6 w-3/4" />
              <USkeleton class="h-6 w-6 rounded-full" />
            </div>
          </template>
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </UCard>
      </div>

      <div
        v-else-if="boards && boards.length > 0"
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <UCard
          v-for="board in boards"
          :key="board.id"
          class="group cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all shadow-sm hover:shadow-md dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-800"
          @click="navigateTo(`/dashboard/projects/${board.id}`)"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-2">
                <div class="w-2 h-6 bg-primary-500 rounded-full group-hover:h-8 transition-all" />
                <h3 class="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {{ board.title }}
                </h3>
              </div>
              <UDropdownMenu :items="items(board)">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal-20-solid"
                />
              </UDropdownMenu>
            </div>
          </template>

          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
            {{ board.description || 'No description provided for this board.' }}
          </p>

          <template #footer>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" />
                {{ format(new Date(board.created_at), 'MMM d, yyyy') }}
              </span>
              <span v-if="board.lists" class="flex items-center gap-1">
                <UIcon name="i-heroicons-list-bullet" />
                {{ board.lists.length }} Lists
              </span>
            </div>
          </template>
        </UCard>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div
          class="w-20 h-20 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center mb-6"
        >
          <UIcon name="i-heroicons-clipboard-document-list" class="text-4xl text-primary-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No boards yet</h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
          Get organized by creating your first project board today.
        </p>
        <UButton
          size="xl"
          label="Create First Board"
          icon="i-heroicons-plus"
          @click="isCreateModalOpen = true"
        />
      </div>
    </div>
  </div>

  <!-- Create Modal -->
  <UModal
    v-model:open="isCreateModalOpen"
    :ui="{ content: 'sm:max-w-md' }"
    title="New Project Board"
  >
    <template #body>
      <div class="p-4">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex items-center justify-center text-primary-500"
          >
            <UIcon name="i-heroicons-squares-plus" class="text-2xl" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">New Project Board</h3>
            <p class="text-xs text-gray-500">Define your workspace</p>
          </div>
        </div>

        <UForm :schema="createBoardSchema" :state="createBoardState" @submit="createBoard">
          <div class="space-y-6">
            <UFormField label="Board Title" name="title" required help="Give your project a name">
              <UInput
                v-model="createBoardState.title"
                placeholder="e.g., Q1 Marketing Plan"
                size="lg"
                variant="outline"
                autofocus
              />
            </UFormField>

            <UFormField
              label="Description"
              name="description"
              help="Optional context for your team"
            >
              <UTextarea
                v-model="createBoardState.description"
                placeholder="What is this project about?"
                size="lg"
                variant="outline"
                :rows="4"
              />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3 mt-10">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              size="lg"
              @click="isCreateModalOpen = false"
            />
            <UButton label="Create Project" type="submit" size="lg" />
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
