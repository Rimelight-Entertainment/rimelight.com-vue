<script lang="ts" setup>
import { ref, computed, watch, markRaw } from "vue"
import type {NavigationMenuItem} from "@nuxt/ui"
import {FocusTimerTool} from "rimelight-components/components"
import {
  useFloatingTools,
  useFocusTimer,
  useHeaderStack,
  useNotes,
  useQuickActions,
  useTodos
} from "rimelight-components/composables"

const {totalHeight} = useHeaderStack()

const {registerTool, openTool} = useFloatingTools()
const {registerAction} = useQuickActions()

const focusTimer = useFocusTimer()

registerTool({
  id: 'focusTimer',
  title: 'Focus Timer',
  icon: 'lucide:timer',
  component: markRaw(FocusTimerTool),
  tooltip: () => useFocusTimer().formattedTime.value,
  onClose: () => useFocusTimer().resetTimer()
})

watch([focusTimer.isRunning], ([timer]) => {
  if (timer) openTool('focusTimer')
})

registerAction({
  id: 'focus-timer-action',
  label: 'New Focus Timer',
  icon: 'lucide:timer',
  group: 0,
  onSelect: () => openTool('focusTimer')
})

const isNoteModalOpen = ref(false)
const {triggerRefresh} = useNotes()

const isTodoModalOpen = ref(false)
const { createTodo, triggerRefresh: triggerTodoRefresh } = useTodos()

registerAction({
  id: 'action-new-todo',
  label: 'New To-do',
  icon: 'lucide:check-circle-2',
  group: 1,
  onSelect: () => {
    isTodoModalOpen.value = true
  }
})

const newTodoTitle = ref('')
const newTodoDescription = ref('')
const handleQuickTodoSave = async () => {
  if (!newTodoTitle.value.trim()) return
  await createTodo(newTodoTitle.value.trim(), newTodoDescription.value.trim() || undefined)
  newTodoTitle.value = ''
  newTodoDescription.value = ''
  isTodoModalOpen.value = false
}

const open = ref(false)

const {user} = useAuth()

const links = computed<NavigationMenuItem[][]>(() => [
  [
    [
      {
        label: "Home",
        icon: "lucide:home",
        to: "/dashboard",
        defaultOpen: false,
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: "Inbox",
        icon: "lucide:inbox",
        to: "/dashboard/inbox",
        badge: "4",
        defaultOpen: false,
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: "Notes",
        icon: "lucide:notebook",
        to: "/dashboard/notes",
        defaultOpen: false,
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: "Projects",
        icon: "lucide:square-kanban",
        to: "/dashboard/projects",
        defaultOpen: false,
        onSelect: () => {
          open.value = false
        }
      }
    ],
    []
  ],
  [
    ...(user.value?.role && ["admin", "owner"].includes(user.value.role)
        ? [
          {
            label: "Admin",
            icon: "lucide:shield-check",
            to: "/dashboard/admin",
            defaultOpen: false,
            onSelect: () => {
              open.value = false
            }
          }
        ]
        : []),

    {
      label: "Users",
      icon: "lucide-users",
      to: "/dashboard/users",
      defaultOpen: false,
      onSelect: () => {
        open.value = false
      }
    }
  ]
])

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.value.flat()
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "simple-icons:github"
      }
    ]
  }
])
</script>

<template>
  <div
      :style="{ '--total-header-offset': `${totalHeight}px` }"
      class="flex h-svh w-full flex-col overflow-hidden"
  >
    <ClientOnly>
      <RCHeaderLayer id="global-header" :order="2">
        <RLAppHeader/>
      </RCHeaderLayer>
    </ClientOnly>
    <UDashboardGroup :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-dimmed">
      <UDashboardSidebar id="default" v-model:open="open" class="bg-muted">
        <template #header="{ collapsed }">
          <RCTeamsMenu :collapsed="collapsed"/>
        </template>

        <template #default="{ collapsed }">
          <UDashboardSearchButton :collapsed="collapsed" class="w-full"/>
          <UNavigationMenu
              :collapsed="collapsed"
              :items="links[0]"
              orientation="vertical"
              popover
              tooltip
          />
        </template>

        <template #footer="{ collapsed }">
          <div class="flex flex-col gap-sm w-full">
            <UNavigationMenu
                :collapsed="collapsed"
                :items="links[1]"
                block
                class="w-full"
                orientation="vertical"
                tooltip
            />

            <USeparator/>

            <div class="flex flex-row gap-xs justify-between">
              <div class="flex flex-row gap-xs">
                <UButton
                    color="neutral"
                    icon="lucide:cog"
                    size="sm"
                    to="/dashboard/settings"
                    variant="soft"
                />
              </div>

              <div class="flex flex-row gap-xs">
                <UButton
                    color="neutral"
                    icon="lucide:circle-question-mark"
                    size="sm"
                    to="/dashboard/help"
                    variant="soft"
                />
                <UButton
                    color="neutral"
                    icon="lucide:bug"
                    size="sm"
                    to="/dashboard/report-issue"
                    variant="soft"
                />
              </div>
            </div>
          </div>
        </template>
      </UDashboardSidebar>
      <UDashboardSearch :groups="groups"/>
      <slot/>
    </UDashboardGroup>
    <RCQuickActions/>
    <RCNoteModal v-model:open="isNoteModalOpen" @saved="triggerRefresh"/>
    <UModal v-model:open="isTodoModalOpen" :ui="{ content: 'p-md flex flex-col gap-sm' }">
      <template #content>
        <h3 class="text-lg font-bold">New To-do</h3>
        <UInput
          v-model="newTodoTitle"
          autofocus
          placeholder="What needs to be done?"
          variant="outline"
          @keydown.enter="handleQuickTodoSave"
        />
        <UInput
          v-model="newTodoDescription"
          placeholder="Description (optional)"
          variant="outline"
          size="sm"
          @keydown.enter="handleQuickTodoSave"
        />
        <div class="flex justify-end gap-sm">
          <UButton color="neutral" variant="ghost" label="Cancel" @click="isTodoModalOpen = false" />
          <UButton color="primary" label="Create" @click="handleQuickTodoSave" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped></style>
