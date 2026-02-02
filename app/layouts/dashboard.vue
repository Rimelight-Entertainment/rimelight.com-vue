<script lang="ts" setup>
import type {NavigationMenuItem} from "@nuxt/ui"
import {useHeaderStack} from "rimelight-components/composables"
import FocusTimerTool from "~/components/dashboard/floating-tools/FocusTimerTool.vue"

const {totalHeight} = useHeaderStack()

const {registerTool, openTool} = useFloatingTools()
const {registerAction} = useQuickActions()

const focusTimer = useFocusTimer()
const metronome = useMetronome()
const stretches = useStretches()

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

registerAction({
  id: 'action-new-note',
  label: 'New Note',
  icon: 'lucide:sticky-note',
  group: 1,
  onSelect: () => {
    isNoteModalOpen.value = true
  }
})

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
    },
    {
      icon: "lucide:message-circle",
      label: "Feedback"
    },
    {
      icon: "lucide:info",
      label: "Help & Support"
    },
    {
      icon: "lucide:bug",
      label: "Report Issue",
      to: "/report-issue"
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
  <div :style="{ '--total-header-offset': `${totalOffset}px` }" class="flex h-svh w-full flex-col overflow-hidden">
    <ClientOnly>
      <RCHeaderLayer id="global-header" :order="2">
        <RLAppHeader/>
      </RCHeaderLayer>
    </ClientOnly>
    <UDashboardGroup :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-dimmed">
      <UDashboardSidebar id="default" v-model:open="open" class="bg-muted">
        <template #header="{ collapsed }">
          <RLTeamsMenu :collapsed="collapsed"/>
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
                <UButton color="neutral" icon="lucide:cog" size="sm" variant="soft"/>
              </div>

              <div class="flex flex-row gap-xs">
                <UButton color="neutral" icon="lucide:bug" size="sm" variant="soft"/>
              </div>
            </div>
          </div>
        </template>
      </UDashboardSidebar>
      <UDashboardSearch :groups="groups"/>
      <slot/>
    </UDashboardGroup>
    <RLQuickActions/>
    <RLNoteModal v-model:open="isNoteModalOpen" @saved="triggerRefresh"/>
  </div>
</template>

<style scoped></style>