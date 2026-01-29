<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem, ChipProps } from "@nuxt/ui"
import { useHeaderStack } from "rimelight-components/composables";

const { session, signOut } = useAuth()
const route = useRoute()
const { t } = useI18n()

const layerId = inject<string>('header_layer_id', 'default')

const { bottomOffsets } = useHeaderStack()

const currentBottom = computed(() => `${bottomOffsets.value[layerId] || 0}px`)

const slideoverState = reactive({
  left: false,
  right: false,
  notifications: useDashboard().isNotificationsSlideoverOpen
})

type menuItem = NavigationMenuItem & DropdownMenuItem

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Grand Tale",
    active: route.path.startsWith("/grand-tale"),
    slot: 'grand-tale' as const
  },
  {
    label: "Community",
    to: "/community",
    active: route.path.startsWith("/community"),
    children: [
      {
        label: "Forums",
        to: "/forums",
        active: route.path.startsWith("/forums")
      },
      {
        label: "Events",
        to: "/events",
        active: route.path.startsWith("/events")
      },
    ]
  },
  {
    label: "Company",
    to: "/company",
    active: route.path.startsWith("/company")
  },
  {
    label: "Store",
    to: "/store",
    active: route.path.startsWith("/store")
  }
])

const accountMenuItems = computed<menuItem[][]>(() => {
  return [
    [
      {
        slot: "user" as const
      },
      {
        label: "Dashboard",
        icon: "lucide:layout-dashboard",
        to: "/dashboard"
      },
      {
        label: "Available",
        icon: "pajamas:status-active",
        color: "success",
        children: [
          [
            {
              label: "Available",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => {}
            },
            {
              label: "Busy",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => {}
            }
          ],
          [
            {
              label: "Invisible",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => {}
            }
          ]
        ]
      }
    ],
    [
      {
        label: "Profile",
        icon: "lucide:user"
      },
      {
        label: "Billing",
        icon: "lucide:credit-card"
      }
    ],
    [
      {
        label: "Team",
        icon: "lucide:users"
      },
      {
        label: "Invite users",
        icon: "lucide:user-plus",
        children: [
          [
            {
              label: "Email",
              icon: "lucide:mail"
            },
            {
              label: "Message",
              icon: "lucide:message-square"
            }
          ],
          [
            {
              label: "More",
              icon: "lucide:circle-plus"
            }
          ]
        ]
      },
      {
        label: "New team",
        icon: "lucide:plus",
        kbds: ["meta", "n"]
      }
    ],
    [
      {
        label: "Support",
        icon: "lucide:headset",
        to: "/docs/components/dropdown-menu"
      }
    ],
    [
      {
        label: "Settings",
        icon: "lucide:cog",
        to: "/dashboard/settings",
        kbds: [","]
      }
    ]
  ]
})

const availabilityMenuItems = computed<menuItem[][]>(() => {
  return [
    [
      {
        label: "Available",
        icon: "pajamas:status-active",
        color: "success",
        onClick: async () => {}
      },
      {
        label: "Busy",
        icon: "pajamas:status-active",
        color: "error",
        onClick: async () => {}
      },
      {
        label: "Invisibile",
        icon: "pajamas:status-active",
        color: "neutral",
        onClick: async () => {}
      }
    ]
  ]
})

defineShortcuts(extractShortcuts(accountMenuItems.value))

const availabilityChip = computed<ChipProps | undefined>(() => {
  const availability = session.value?.user?.availability

  if (!availability) {
    return undefined
  }

  let color: ChipProps["color"]
  switch (availability) {
    case "available":
      color = "success"
      break
    case "busy":
      color = "error"
      break
    case "invisible":
      color = "neutral"
      break
    default:
      color = "primary"
  }

  return {
    color: color,
    position: "bottom-right"
  }
})
</script>

<template>
  <RCHeader :contain="false" class="bg-black">
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <ClientOnly>
          <RCLogo variant="mark" class="h-6 w-auto" />
        </ClientOnly>
        <UNavigationMenu
          :items="items"
          variant="link"
          :ui="{
            viewportWrapper:
              'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)]',
            viewport: 'rounded-none',
            label: 'text-white',
            link: 'hover:text-primary-200 active:text-500'
          }"
        >
          <template #grand-tale-content="{ item }">

          </template>
        </UNavigationMenu>
      </div>
    </template>
    <template #center> </template>
    <template #right>
      <div class="flex flex-row gap-sm">
        <ClientOnly>
        <template v-if="session">
          <div class="flex flex-row items-center gap-md">
            <UButton color="neutral" variant="link" label="Dashboard" to="/dashboard" />
            <UTooltip text="Notifications">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="slideoverState.notifications = true"
              >
                <UChip color="error" inset>
                  <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>
            <UPopover mode="hover" arrow :ui="{ content: 'w-64' }">
              <template #default>
                <UTooltip>
                  <template #default>
                    <UButton variant="ghost">
                      <UUser
                        v-if="session"
                        size="md"
                        :avatar="{
                          src: session?.user.image ?? '',
                          alt: session?.user.name ?? ''
                        }"
                        :name="session?.user.name"
                        :description="session?.user.status ?? ''"
                        :chip="availabilityChip"
                        :ui="{ description: 'text-left' }"
                      />
                    </UButton>
                  </template>
                </UTooltip>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <div class="flex flex-col gap-xs bg-elevated p-sm">
                    <UUser
                      v-if="session"
                      size="md"
                      :avatar="{
                        src: session?.user.image ?? '',
                        alt: session?.user.name ?? ''
                      }"
                      :description="
                        session?.user.status ?? 'Set a custom status...'
                      "
                      :ui="{ name: 'text-left', description: 'text-left' }"
                    >
                      <template #name>
                        <span
                          >{{ session?.user.name }}
                          <span class="text-dimmed">#{{ session?.user.tag }}</span></span
                        >
                      </template>
                    </UUser>
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:user"
                      :label="t('account_profile')"
                    />
                  </div>
                  <div class="flex flex-col gap-xs bg-muted p-sm">
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:headset"
                      :label="t('account_support')"
                    />
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:cog"
                      :label="t('account_settings')"
                      to="/dashboard/settings"
                    />
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:log-out"
                      :label="t('auth_sign-out')"
                      @click="signOut"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </template>
        <template v-else>
          <UButton variant="outline" :label="t('auth_sign-up')" to="/auth/sign-up" />
          <UButton variant="solid" :label="t('auth_sign-in')" to="/auth/sign-in" />
        </template>
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-left>
      <div class="flex justify-start">
        <ClientOnly>
          <USlideover
          v-model:open="slideoverState.left"
          side="left"
          :handle="false"
          :ui="{
            header: 'flex items-center justify-between',
            content: 'w-full max-w-4/5 rounded-none'
          }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:menu"
            @click="slideoverState.left = true"
          />
          <template #header>
            <RCLogo variant="mark" class="h-6 w-auto" />
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              @click="slideoverState.left = false"
            />
          </template>
          <template #body>
            <div class="flex size-full flex-col items-start gap-md">
              <UNavigationMenu :items="items" variant="link" orientation="vertical" />
            </div>
          </template>
        </USlideover>
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-center>
      <ClientOnly>
      <RCLogo variant="mark" class="h-12" />
      </ClientOnly>
    </template>
    <template #collapsed-right>
      <div class="flex flex-row justify-end gap-sm">
        <ClientOnly>
        <UTooltip text="Notifications">
          <UButton
            color="neutral"
            variant="ghost"
            square
            @click="slideoverState.notifications = true"
          >
            <UChip color="error" inset>
              <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
            </UChip>
          </UButton>
        </UTooltip>
        <USlideover
          v-model:open="slideoverState.right"
          side="right"
          :handle="false"
          :ui="{
            header: 'flex items-center justify-between',
            content: 'w-full max-w-4/5 rounded-none'
          }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:user"
            @click="slideoverState.right = true"
          />
          <template #header>
            <UUser
              v-if="session"
              size="md"
              :avatar="{
                src: session?.user.image ?? '',
                alt: session?.user.name ?? ''
              }"
              :description="session?.user.status ?? ''"
              :ui="{ description: 'text-left' }"
            >
              <template #name>
                <span
                  >{{ session?.user.name }}
                  <span class="text-dimmed">#{{ session?.user.tag }}</span></span
                >
              </template>
            </UUser>
            <div v-else />
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              @click="slideoverState.right = false"
            />
          </template>
          <template #body>
            <div class="flex flex-col gap-md">
              <template v-if="session">
                <UNavigationMenu orientation="vertical" :items="accountMenuItems" />
              </template>
              <template v-else>
                <UButton
                  variant="outline"
                  :label="t('auth_sign-up')"
                  to="/auth/sign-up"
                  @click="slideoverState.right = false"
                  block
                />
                <UButton
                  variant="solid"
                  :label="t('auth_sign-in')"
                  to="/auth/sign-in"
                  @click="slideoverState.right = false"
                  block
                />
              </template>
            </div>
          </template>
        </USlideover>
        </ClientOnly>
      </div>
    </template>
  </RCHeader>
</template>

<style scoped></style>
