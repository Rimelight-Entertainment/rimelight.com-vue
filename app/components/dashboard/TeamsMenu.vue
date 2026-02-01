<script lang="ts" setup>
import type {DropdownMenuItem} from "@nuxt/ui"

export interface TeamsMenuProps {
  collapsed?: boolean
}

const { collapsed } = defineProps<TeamsMenuProps>()

const teams = ref([
  {
    label: `Nuxt`,
    avatar: {
      src: `https://github.com/nuxt.png`,
      alt: `Nuxt`
    }
  },
  {
    label: `NuxtHub`,
    avatar: {
      src: `https://github.com/nuxt-hub.png`,
      alt: `NuxtHub`
    }
  },
  {
    label: `NuxtLabs`,
    avatar: {
      src: `https://github.com/nuxtlabs.png`,
      alt: `NuxtLabs`
    }
  }
])
const selectedTeam = ref(teams.value[0])

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    teams.value.map((team) => ({
      ...team,
      onSelect() {
        selectedTeam.value = team
      }
    })),
    [
      {
        label: `Create team`,
        icon: `i-lucide-circle-plus`
      },
      {
        label: `Manage teams`,
        icon: `i-lucide-cog`
      }
    ]
  ]
})
</script>

<template>
  <UDropdownMenu
    :content="{ align: 'center', collisionPadding: 12 }"
    :items="items"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)'
    }"
  >
    <UButton
      :class="[!collapsed && 'py-2']"
      :square="collapsed"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
      block
      class="data-[state=open]:bg-elevated"
      color="neutral"
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      variant="ghost"
    />
  </UDropdownMenu>
</template>
