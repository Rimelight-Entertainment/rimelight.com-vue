<script lang="ts" setup>
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface TeamsMenuProps {
  collapsed?: boolean;
  rc?: {
    root?: string;
  };
}

const { collapsed, rc: rcProp } = defineProps<TeamsMenuProps>();

const { rc } = useRC("TeamsMenu", rcProp);
/* endregion */

/* region Emits */
export interface TeamsMenuEmits {}

const emit = defineEmits<TeamsMenuEmits>();
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
const teamsMenuStyles = tv({
  slots: {
    root: "",
    triggerButton: "data-[state=open]:bg-elevated",
    buttonTrailing: "text-dimmed",
  },
});

const { root, triggerButton, buttonTrailing } = teamsMenuStyles();
/* endregion */

/* region State */
const nuxtApp = useNuxtApp();
const authClient = (nuxtApp as any).$authClient;
const { activeOrganization, activeTeamId, setActiveTeam } = useDashboard();

const activeOrgId = computed(() => activeOrganization.value?.id);

// 1. Fetch only teams the user is a part of
const { data: userTeamsRes, refresh: refreshUserTeams } = useAsyncData(
  "user-membership-teams",
  async () => {
    if (!authClient?.organization?.listUserTeams) return [];
    const { data } = await authClient.organization.listUserTeams();
    return data || [];
  },
  {
    watch: [activeOrgId],
    default: () => [],
  },
);

// 2. Filter teams by the active organization
const teams = computed(() => {
  const allUserTeams = userTeamsRes.value || [];
  if (!activeOrgId.value) return [];
  return allUserTeams.filter((team: any) => team.organizationId === activeOrgId.value);
});

// 3. Current selection
const selectedTeam = computed(() => {
  if (activeTeamId.value) {
    const found = teams.value.find((t: any) => t.id === activeTeamId.value);
    if (found) return found;
  }
  return teams.value[0] || null;
});

// Auto-select first team if none selected
watch(
  teams,
  (newTeams) => {
    if (newTeams.length > 0 && !activeTeamId.value) {
      setActiveTeam(newTeams[0].id);
    }
  },
  { immediate: true },
);

const items = computed(() => {
  const list = teams.value.map((team: any) => ({
    label: team.name,
    avatar: team.logo ? { src: team.logo, alt: team.name } : undefined,
    icon: !team.logo ? "lucide:users" : undefined,
    onSelect: () => {
      setActiveTeam(team.id);
    },
  }));

  return [list];
});
/* endregion */

/* region Meta */
defineOptions({
  name: "TeamsMenu",
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div v-if="teams.length > 0">
    <UDropdownMenu
      :content="{ align: 'center', collisionPadding: 12 }"
      :items="items"
      :ui="{
        content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
      }"
    >
      <UButton
        :class="[triggerButton(), !collapsed && 'py-2']"
        :square="collapsed"
        :ui="{
          trailingIcon: buttonTrailing(),
        }"
        block
        color="neutral"
        v-bind="{
          label: collapsed ? undefined : selectedTeam?.name,
          avatar: selectedTeam?.logo
            ? { src: selectedTeam.logo, alt: selectedTeam.name }
            : undefined,
          icon:
            !selectedTeam?.logo && selectedTeam?.name
              ? 'lucide:users'
              : selectedTeam?.name
                ? undefined
                : 'lucide:users',
          trailingIcon: collapsed ? undefined : 'lucide:chevrons-up-down',
        }"
        variant="ghost"
      />
    </UDropdownMenu>
  </div>
</template>

<style scoped></style>
