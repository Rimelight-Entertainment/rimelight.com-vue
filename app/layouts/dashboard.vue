<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const open = ref(false)

const { user } = useAuth()
const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Home",
      icon: "lucide:home",
      to: "/internal",
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: "Inbox",
      icon: "lucide:inbox",
      to: "/internal/inbox",
      badge: "4",
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: "Customers",
      icon: "i-lucide-users",
      to: "/internal/customers",
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: "Notes",
      icon: "lucide:notebook",
      to: "/internal/notes",
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: "Habits",
      icon: "lucide:calendar-check-2",
      to: "/internal/habits",
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: "Housing",
      icon: "lucide:building-2",
      to: "/internal/housing",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "Groceries",
          icon: "lucide:shopping-cart",
          to: "/internal/housing/groceries",
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: "Pets",
          icon: "lucide:paw-print",
          to: "/internal/housing/pets",
          exact: true,
          onSelect: () => {
            open.value = false
          }
        }
      ]
    },
    {
      label: "Health",
      to: "/internal/health",
      icon: "lucide:heart-pulse",
      defaultOpen: true,
      children: [
        {
          label: "Workout",
          icon: "lucide:biceps-flexed",
          to: "/internal/health/workout",
          exact: true,
          onSelect: () => {
            open.value = false
          }
        }
      ]
    },
    {
      label: "Music",
      icon: "lucide:music",
      to: "/internal/housing",
      defaultOpen: true,
      type: "trigger",
      children: [
        {
          label: "DJ",
          icon: "lucide:disc-3",
          to: "/internal/music/dj",
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: "Guitar",
          icon: "lucide:guitar",
          to: "/internal/music/guitar",
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: "Piano",
          icon: "lucide:piano",
          to: "/internal/music/piano",
          exact: true,
          onSelect: () => {
            open.value = false
          }
        }
      ]
    },
    {
      label: "Watchlist",
      icon: "lucide:play-circle",
      to: "/internal/watchlist",
      onSelect: () => {
        open.value = false
      }
    }
  ],
  [
    ...(user.value?.role === "admin" || "owner"
      ? [
          {
            label: "Admin",
            icon: "lucide:shield-check",
            to: "/internal/admin",
            onSelect: () => {
              open.value = false
            }
          }
        ]
      : []),

    {
      icon: "i-lucide-message-circle",
      label: "Feedback"
    },
    {
      icon: "i-lucide-info",
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
        icon: "i-simple-icons-github"
      }
    ]
  }
])
</script>

<template>
  <div class="flex h-svh w-full flex-col overflow-hidden">
    <IDAppHeader />
    <UDashboardGroup class="bg-dimmed">
      <UDashboardSidebar id="default" v-model:open="open" class="bg-muted">
        <template #header="{ collapsed }">
          <IDTeamsMenu :collapsed="collapsed" />
        </template>

        <template #default="{ collapsed }">
          <UDashboardSearchButton :collapsed="collapsed" class="w-full" />
          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[0]"
            orientation="vertical"
            tooltip
            popover
          />
        </template>

        <template #footer="{ collapsed }">
          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            orientation="vertical"
            tooltip
            class="mt-auto w-full"
          />
        </template>
      </UDashboardSidebar>
      <UDashboardSearch :groups="groups" />
      <slot />
    </UDashboardGroup>
  </div>
</template>

<style scoped></style>
