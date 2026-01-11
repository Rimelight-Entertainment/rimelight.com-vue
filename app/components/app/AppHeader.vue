<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem, ChipProps } from "@nuxt/ui"

const { isNotificationsSlideoverOpen } = useDashboard()

const { session, signOut } = useAuth()
const route = useRoute()
const { t } = useI18n()

const leftSlideoverOpen = ref(false)
const rightSlideoverOpen = ref(false)

type menuItem = NavigationMenuItem & DropdownMenuItem

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "me.projects",
    //to: "/projects",
    //active: route.path.startsWith("/projects")
  },
  {
    label: "me.music",
    to: "/music",
    active: route.path.startsWith("/music")
  },
  {
    label: "me.blog",
    to: "/blog",
    active: route.path.startsWith("/blog")
  },
  {
    label: "me.about",
    to: "/about",
    active: route.path.startsWith("/about")
  },
  {
    label: "me.contact",
    to: "/contact",
    active: route.path.startsWith("/contact")
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
        to: "/internal"
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
        to: "/internal/settings",
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
  <RCHeader class="bg-black">
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
              'top-0 flex fixed w-screen mt-[var(--ui-header-height)]',
            viewport: 'rounded-none',
            label: 'text-white',
            link: 'hover:text-primary-200 active:text-500'
          }"
        />
      </div>
    </template>
    <template #center> </template>
    <template #right>
      <div class="flex flex-row gap-sm">
        <ClientOnly>
        <template v-if="session">
          <div class="flex flex-row items-center gap-md">
            <UButton color="neutral" variant="link" label="Internal" to="/internal" />
            <UTooltip text="Notifications">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideoverOpen = true"
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
                      to="/internal/settings"
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
          v-model:open="leftSlideoverOpen"
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
            @click="leftSlideoverOpen = true"
          />
          <template #header>
            <RCLogo variant="mark" class="h-6 w-auto" />
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              @click="leftSlideoverOpen = false"
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
            @click="isNotificationsSlideoverOpen = true"
          >
            <UChip color="error" inset>
              <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
            </UChip>
          </UButton>
        </UTooltip>
        <USlideover
          v-model:open="rightSlideoverOpen"
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
            @click="rightSlideoverOpen = true"
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
              @click="rightSlideoverOpen = false"
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
                  @click="rightSlideoverOpen = false"
                  block
                />
                <UButton
                  variant="solid"
                  :label="t('auth_sign-in')"
                  to="/auth/sign-in"
                  @click="rightSlideoverOpen = false"
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
