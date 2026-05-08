<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/types";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface BaseDashboardLayoutProps {
  id?: string;
  sidebarOpen?: boolean;
  links: NavigationMenuItem[] | NavigationMenuItem[][];
  footerLinks?: NavigationMenuItem[] | NavigationMenuItem[][];
  searchGroups?: any[];
  headerLayerId?: string;
  headerOrder?: number;
  rc?: {
    root?: string;
  };
}

const {
  id = "default",
  sidebarOpen = false,
  links = [],
  footerLinks = [],
  searchGroups = [],
  headerLayerId = "global-header",
  headerOrder = 2,
  rc: rcProp,
} = defineProps<BaseDashboardLayoutProps>();

const { rc } = useRC("BaseDashboardLayout", rcProp);
/* endregion */

/* region Emits */
export interface BaseDashboardLayoutEmits {
  "update:sidebarOpen": [value: boolean];
}

const emit = defineEmits<BaseDashboardLayoutEmits>();
/* endregion */

/* region Slots */
export interface BaseDashboardLayoutSlots {
  header: (props: {}) => any;
  "sidebar-header": (props: { collapsed: boolean }) => any;
  "sidebar-content": (props: { collapsed: boolean }) => any;
  "sidebar-footer": (props: { collapsed: boolean }) => any;
  "sidebar-footer-actions": (props: { collapsed: boolean }) => any;
  default: (props: {}) => any;
  modals: (props: {}) => any;
}

const slots = defineSlots<BaseDashboardLayoutSlots>();
/* endregion */

/* region Styles */
const baseDashboardLayoutStyles = tv({
  slots: {
    root: "flex h-svh w-full flex-col overflow-hidden",
    dashboardGroup: "bg-dimmed",
    sidebar: "bg-muted",
    sidebarFooterWrapper: "flex flex-col gap-sm w-full",
    footerActions: "flex flex-row gap-xs justify-between",
  },
});

const { root, dashboardGroup, sidebar, sidebarFooterWrapper, footerActions } =
  baseDashboardLayoutStyles();
type BaseDashboardLayoutVariants = VariantProps<typeof baseDashboardLayoutStyles>;
/* endregion */

/* region State */
const sidebarOpenModel = computed({
  get: () => sidebarOpen,
  set: (val) => emit("update:sidebarOpen", val),
});

const { totalHeight } = useHeaderStack();
/* endregion */

/* region Meta */
defineOptions({
  name: "BaseDashboardLayout",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }" :class="root({ class: rc.root })">
    <ClientOnly>
      <RLHeaderLayer :id="headerLayerId" :order="headerOrder">
        <slot name="header" />
      </RLHeaderLayer>
    </ClientOnly>

    <UDashboardGroup
      :style="{ paddingTop: 'var(--total-header-offset)' }"
      :class="dashboardGroup()"
    >
      <UDashboardSidebar :id="id" v-model:open="sidebarOpenModel" :class="sidebar()">
        <template #header="{ collapsed }">
          <slot name="sidebar-header" :collapsed="collapsed!">
            <div class="flex flex-col gap-xs w-full">
              <RLOrganizationsMenu :collapsed="collapsed" />
              <RLTeamsMenu :collapsed="collapsed" />
            </div>
          </slot>
        </template>

        <template #default="{ collapsed }">
          <slot name="sidebar-content" :collapsed="collapsed!">
            <UDashboardSearchButton :collapsed="collapsed" class="w-full" />
            <UNavigationMenu
              :collapsed="collapsed"
              :items="links"
              orientation="vertical"
              popover
              tooltip
            />
          </slot>
        </template>

        <template #footer="{ collapsed }">
          <slot name="sidebar-footer" :collapsed="collapsed!">
            <div :class="sidebarFooterWrapper()">
              <UNavigationMenu
                v-if="footerLinks.length > 0"
                :collapsed="collapsed"
                :items="footerLinks"
                block
                class="w-full"
                orientation="vertical"
                tooltip
              />

              <USeparator />

              <div :class="footerActions()">
                <slot name="sidebar-footer-actions" :collapsed="collapsed!" />
              </div>
            </div>
          </slot>
        </template>
      </UDashboardSidebar>

      <UDashboardSearch v-if="searchGroups.length > 0" :groups="searchGroups" />

      <slot />
    </UDashboardGroup>

    <slot name="modals" />
  </div>
</template>

<style scoped></style>
