<script lang="ts" setup>
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface OrganizationsMenuProps {
  collapsed?: boolean;
  rc?: {
    root?: string;
  };
}

const { collapsed = false, rc: rcProp } = defineProps<OrganizationsMenuProps>();

const { rc } = useRC("OrganizationsMenu", rcProp);
/* endregion */

/* region Emits */
export interface OrganizationsMenuEmits {}

const emit = defineEmits<OrganizationsMenuEmits>();
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
const organizationsMenuStyles = tv({
  slots: {
    root: "flex flex-col w-full",
    triggerButton: "data-[state=open]:bg-elevated",
    buttonTrailing: "text-dimmed",
  },
});

const { root, triggerButton, buttonTrailing } = organizationsMenuStyles();
/* endregion */

/* region State */
const nuxtApp = useNuxtApp();
const authClient = (nuxtApp as any).$authClient;
const { activeOrganization, refreshActiveOrganization } = useDashboard();

// 1. Get List of organizations
const organizationsState = authClient?.useListOrganizations?.();
const organizations = computed(() => organizationsState?.value?.data || []);

const selectedOrganization = computed(() => {
  return (
    activeOrganization.value ||
    (organizations.value && organizations.value.length > 0 ? organizations.value[0] : null)
  );
});

const items = computed(() => {
  const orgs = organizations.value || [];

  const list = orgs.map((org: any) => ({
    label: org.name,
    avatar: org.logo
      ? {
          src: org.logo,
          alt: org.name,
        }
      : undefined,
    icon: !org.logo ? "lucide:building" : undefined,
    onSelect: async () => {
      if (authClient?.organization?.setActive) {
        await authClient.organization.setActive({
          organizationId: org.id,
        });
        // Explicitly refresh the active organization state after setting it
        await refreshActiveOrganization();
      }
    },
  }));

  return list;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "OrganizationsMenu",
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div :class="root()">
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
          label: collapsed ? undefined : selectedOrganization?.name || 'Personal Workspace',
          avatar: selectedOrganization?.logo
            ? { src: selectedOrganization.logo, alt: selectedOrganization.name }
            : undefined,
          icon:
            !selectedOrganization?.logo && selectedOrganization?.name
              ? 'lucide:building'
              : selectedOrganization?.name
                ? undefined
                : 'lucide:user',
          trailingIcon: collapsed ? undefined : 'lucide:chevrons-up-down',
        }"
        variant="ghost"
      />
    </UDropdownMenu>
  </div>
</template>

<style scoped></style>
