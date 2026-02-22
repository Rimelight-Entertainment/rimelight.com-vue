<script lang="ts" setup>
import type { ChipProps, DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { session, signOut } = useAuth();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();

async function onSignOut() {
  const { error } = await signOut();
  if (error) {
    toast.add({
      color: "error",
      title: "Sign Out Failed",
      description: error.message || "A connection issue occurred.",
    });
  } else {
    toast.add({
      color: "success",
      title: "Sign Out Successful",
      description: "You have been signed out.",
    });
  }
}

const layerId = inject<string>("header_layer_id", "default");

const { bottomOffsets } = useHeaderStack();

const slideoverState = reactive({
  left: false,
  right: false,
  notifications: false,
});

const { isNotificationsSlideoverOpen } = useDashboard();
watch(
  isNotificationsSlideoverOpen,
  (val) => {
    slideoverState.notifications = val;
  },
  { immediate: true },
);

watch(
  () => slideoverState.notifications,
  (val) => {
    isNotificationsSlideoverOpen.value = val;
  },
);

type menuItem = NavigationMenuItem & DropdownMenuItem;

const items = computed<NavigationMenuItem[]>(() =>
  markRaw([
    {
      label: t('app.header.links.grand_tale.label'),
      active: route.path.startsWith("/franchises/grand-tale"),
      slot: "grand-tale" as const,
      children: [
        { label: t('app.header.links.grand_tale.content.main.home'), to: "/franchises/grand-tale" },
        { label: t('app.header.links.grand_tale.content.main.news'), to: "/franchises/grand-tale/news" },
        { label: t('app.header.links.grand_tale.content.main.about'), to: "/franchises/grand-tale/about" },
        { label: t('app.header.links.grand_tale.content.main.wiki'), to: "/franchises/grand-tale/wiki" },
        { label: t('app.header.links.grand_tale.content.main.guides'), to: "/franchises/grand-tale/guides" },
        { label: t('app.header.links.grand_tale.content.main.leaderboards'), to: "/franchises/grand-tale/leaderboards" },
      ],
    },
    {
      label: t('app.header.links.community.label'),
      to: "/community",
      active: route.path.startsWith("/community"),
      slot: "community" as const,
      children: [
        {
          label: t('app.header.links.community.content.main.forums.heading'),
          children: [
            {
              label: t('app.header.links.community.content.main.forums.rimelight'),
              to: "/forums/rimelight",
              active: route.path.startsWith("/forums/rimelight"),
            },
            {
              label: t('app.header.links.community.content.main.forums.grand_tale'),
              to: "/forums/grand-tale",
              active: route.path.startsWith("/forums/grand-tale"),
            },
          ],
        },
        {
          label: t('app.header.links.community.content.main.events.heading'),
          children: [
            {
              label: t('app.header.links.community.content.main.events.lightcon'),
              to: "/events/lightcon",
              active: route.path.startsWith("/events/lightcon"),
            },
          ],
        },
      ],
    },
    {
      label: t('app.header.links.company.label'),
      to: "/company",
      active: route.path.startsWith("/company"),
      slot: "company" as const,
      children: [
        {
          label: t('app.header.links.company.content.main.about.heading'),
          children: [
            {
              label: t('app.header.links.company.content.main.about.overview'),
              to: "/company/about",
              active: route.path.startsWith("/company/about"),
            },
            {
              label: t('app.header.links.company.content.main.about.history'),
              to: "/company/about/history",
              active: route.path.startsWith("/company/about/history"),
            },
            {
              label: t('app.header.links.company.content.main.about.mission'),
              to: "/company/about/mission",
              active: route.path.startsWith("/company/about/mission"),
            },
            {
              label: t('app.header.links.company.content.main.about.leadership'),
              to: "/company/about/leadership",
              active: route.path.startsWith("/company/about/leadership"),
            },
          ],
        },
        {
          label: t('app.header.links.company.content.main.studio.heading'),
          children: [
            {
              label: t('app.header.links.company.content.main.studio.projects'),
              to: "/company/studio/projects",
              active: route.path.startsWith("/company/studio/projects"),
            },
            {
              label: t('app.header.links.company.content.main.studio.technology'),
              to: "/company/studio/technology",
              active: route.path.startsWith("/company/studio/technology"),
            },
            {
              label: t('app.header.links.company.content.main.studio.partnerships'),
              to: "/company/studio/partnerships",
              active: route.path.startsWith("/company/studio/partnerships"),
            },
          ],
        },
        {
          label: t('app.header.links.company.content.main.news.heading'),
          children: [
            {
              label: t('app.header.links.company.content.main.news.blog'),
              to: "/company/blog",
              active: route.path.startsWith("/company/blog"),
            },
            {
              label: t('app.header.links.company.content.main.news.press'),
              to: "/company/press",
              active: route.path.startsWith("/company/press"),
            },
            {
              label: t('app.header.links.company.content.main.news.media_kit'),
              to: "/company/media-kit",
              active: route.path.startsWith("/company/media-kit"),
            },
          ],
        },
        {
          label: t('app.header.links.company.content.main.careers.heading'),
          children: [
            {
              label: t('app.header.links.company.content.main.careers.openings'),
              to: "/company/careers",
              active: route.path.startsWith("/company/careers"),
            },
            {
              label: t('app.header.links.company.content.main.careers.culture'),
              to: "/company/careers/culture",
              active: route.path.startsWith("/company/careers/culture"),
            },
            {
              label: t('app.header.links.company.content.main.careers.benefits'),
              to: "/company/careers/benefits",
              active: route.path.startsWith("/company/careers/benefits"),
            },
            {
              label: t('app.header.links.company.content.main.careers.internships'),
              to: "/company/careers/internships",
              active: route.path.startsWith("/company/careers/internships"),
            },
          ],
        },
        {
          label: t('app.header.links.company.content.main.investors.heading'),
          children: [
            {
              label: t('app.header.links.company.content.main.investors.overview'),
              to: "/company/investors",
              active: route.path.startsWith("/company/investors"),
            },
            {
              label: t('app.header.links.company.content.main.investors.financials'),
              to: "/company/investors/financials",
              active: route.path.startsWith("/company/investors/financials"),
            },
            {
              label: t('app.header.links.company.content.main.investors.governance'),
              to: "/company/investors/governance",
              active: route.path.startsWith("/company/investors/governance"),
            },
          ],
        },
      ],
    },
    {
      label: t('app.header.links.store.label'),
      to: "/store",
      active: route.path.startsWith("/store"),
      slot: "store" as const,
    },
  ]),
);

const accountMenuItems = computed<menuItem[][]>(() => {
  return [
    [
      {
        slot: "user" as const,
      },
      {
        label: "Dashboard",
        icon: "lucide:layout-dashboard",
        to: "/dashboard",
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
              onClick: async () => {},
            },
            {
              label: "Busy",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => {},
            },
          ],
          [
            {
              label: "Invisible",
              icon: "pajamas:status-active",
              color: "success",
              onClick: async () => {},
            },
          ],
        ],
      },
    ],
    [
      {
        label: "Profile",
        icon: "lucide:user",
      },
      {
        label: "Billing",
        icon: "lucide:credit-card",
      },
    ],
    [
      {
        label: "Team",
        icon: "lucide:users",
      },
      {
        label: "Invite users",
        icon: "lucide:user-plus",
        children: [
          [
            {
              label: "Email",
              icon: "lucide:mail",
            },
            {
              label: "Message",
              icon: "lucide:message-square",
            },
          ],
          [
            {
              label: "More",
              icon: "lucide:circle-plus",
            },
          ],
        ],
      },
      {
        label: "New team",
        icon: "lucide:plus",
        kbds: ["meta", "n"],
      },
    ],
    [
      {
        label: "Support",
        icon: "lucide:headset",
        to: "/docs/components/dropdown-menu",
      },
    ],
    [
      {
        label: "Settings",
        icon: "lucide:cog",
        to: "/dashboard/settings",
        kbds: [","],
      },
    ],
  ];
});

defineShortcuts(extractShortcuts(accountMenuItems.value));

const availabilityChip = computed<ChipProps | undefined>(() => {
  const availability = session.value?.user?.availability;

  if (!availability) {
    return undefined;
  }

  let color: ChipProps["color"];
  switch (availability) {
    case "available":
      color = "success";
      break;
    case "busy":
      color = "error";
      break;
    case "invisible":
      color = "neutral";
      break;
    default:
      color = "primary";
  }

  return {
    color: color,
    position: "bottom-right",
  };
});

/* region Props */
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <RCHeader :contain="false" class="bg-black">
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <ClientOnly>
          <RCLogo class="h-6 w-auto" variant="mark" />
        </ClientOnly>
        <UNavigationMenu
          :items="items"
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[layerId] || 0) - 64}px` }"
          :ui="{
            viewportWrapper:
              'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)] z-[100]',
            viewport: 'rounded-none',
            link: [
              'text-white transition-colors duration-200',
              'hover:text-primary-400',
              'data-[state=open]:text-primary-400',
              'aria-[current]:text-primary-400',
            ],
          }"
          variant="link"
        >
          <template #grand-tale-content="{ item }">
            <div class="flex flex-col lg:flex-row gap-lg bg-white">
              <div class="flex flex-col lg:flex-row gap-lg p-lg flex-1">
                <NuxtImg
                  class="h-32 lg:h-full w-full lg:w-auto object-cover lg:max-w-80 shrink-0"
                  src="/images/placeholders/placeholder_header_grand-tale.jpg"
                />

                <USeparator
                  :ui="{ border: 'border-neutral-200' }"
                  class="hidden lg:block h-full"
                  orientation="vertical"
                />
                <USeparator :ui="{ border: 'border-neutral-200' }" class="lg:hidden w-full" />

                <div class="flex flex-col gap-sm flex-2">
                  <div class="grid grid-cols-2 gap-1">
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.grand_tale.content.main.title') }}</span
                      >
                      <UButton
                        v-for="child in (item as any).children"
                        :key="child.label"
                        :label="child.label"
                        :to="child.to"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-sm p-lg bg-neutral-100 w-64">
                <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                  >{{ t('app.header.links.grand_tale.content.side.title') }}</span
                >
                <div class="grid grid-cols-1 gap-1">
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:headset"
                    :label="t('app.header.links.grand_tale.content.side.support')"
                    to="/franchises/grand-tale/support"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #community-content="{ item }">
            <div class="flex flex-col lg:flex-row gap-lg bg-white">
              <div class="flex flex-col lg:flex-row gap-lg p-lg flex-1">
                <NuxtImg
                  class="h-32 lg:h-full w-full lg:w-auto object-cover lg:max-w-80 shrink-0"
                  src="/images/placeholders/placeholder_header_community.jpg"
                />

                <USeparator
                  :ui="{ border: 'border-neutral-200' }"
                  class="hidden lg:block h-full"
                  orientation="vertical"
                />
                <USeparator :ui="{ border: 'border-neutral-200' }" class="lg:hidden w-full" />

                <div class="flex flex-col gap-sm flex-2">
                  <div class="grid grid-cols-2 gap-1">
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.community.content.forums.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.community.content.forums.rimelight')"
                        to="/forums/rimelight"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.community.content.forums.grand_tale')"
                        to="/forums/grand-tale"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.community.content.events.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.community.content.events.lightcon')"
                        to="/events/lightcon"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-sm p-lg bg-neutral-100 w-64">
                <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                  >{{ t('app.header.links.community.content.side.title') }}</span
                >
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1">
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="mdi:instagram"
                    :label="t('app.header.links.community.content.side.instagram')"
                    to="https://www.instagram.com/"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="ic:baseline-discord"
                    :label="t('app.header.links.community.content.side.discord')"
                    to="https://discord.com/"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="mdi:spotify"
                    :label="t('app.header.links.community.content.side.spotify')"
                    to="https://spotify.com/"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #company-content="{ item }">
            <div class="flex flex-col lg:flex-row gap-lg bg-white">
              <div class="flex flex-col lg:flex-row gap-lg p-lg flex-1">
                <NuxtImg
                  class="h-32 lg:h-full w-full lg:w-auto object-cover lg:max-w-80 shrink-0"
                  src="/images/placeholders/placeholder_header_company.jpg"
                />

                <USeparator
                  :ui="{ border: 'border-neutral-200' }"
                  class="hidden lg:block h-full"
                  orientation="vertical"
                />
                <USeparator :ui="{ border: 'border-neutral-200' }" class="lg:hidden w-full" />

                <div class="flex flex-col gap-sm flex-2">
                  <div class="grid grid-cols-3 gap-1">
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.company.content.main.about.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.company.content.main.about.overview')"
                        to="/company/about"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.about.history')"
                        to="/company/about/history"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.about.mission')"
                        to="/company/about/mission"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.about.leadership')"
                        to="/company/about/leadership"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.company.content.main.studio.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.company.content.main.studio.projects')"
                        to="/company/studio/projects"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.studio.technology')"
                        to="/company/studio/technology"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.studio.partnerships')"
                        to="/company/studio/partnerships"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.company.content.main.news.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.company.content.main.news.blog')"
                        to="/company/blog"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.news.press')"
                        to="/company/press"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.news.media_kit')"
                        to="/company/media-kit"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.company.content.main.careers.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.company.content.main.careers.openings')"
                        to="/company/careers"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.careers.culture')"
                        to="/company/careers/culture"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.careers.benefits')"
                        to="/company/careers/benefits"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.careers.internships')"
                        to="/company/careers/internships"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.company.content.main.investors.heading') }}</span
                      >
                      <UButton
                        :label="t('app.header.links.company.content.main.investors.overview')"
                        to="/company/investors"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.investors.financials')"
                        to="/company/investors/financials"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('app.header.links.company.content.main.investors.governance')"
                        to="/company/investors/governance"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-sm p-lg bg-neutral-100 w-64">
                <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500">
                  {{ t('app.header.links.company.content.side.resources.title') }}
                </span>
                <div class="grid grid-cols-1 gap-1">
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:code"
                    :label="t('app.header.links.company.content.side.resources.api')"
                    to="/api"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:palette"
                    :label="t('app.header.links.company.content.side.resources.branding')"
                    to="/branding"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:newspaper"
                    :label="t('app.header.links.company.content.side.resources.press')"
                    to="/company/press"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:shield"
                    :label="t('app.header.links.company.content.side.resources.legal')"
                    to="/documents"
                    variant="ghost"
                  />
                </div>
                <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500 mt-2">
                  {{ t('app.header.links.company.content.side.socials.title') }}
                </span>
                <div class="grid grid-cols-1 gap-1">
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="mdi:linkedin"
                    :label="t('app.header.links.company.content.side.socials.linkedin')"
                    to=""
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="mdi:github"
                    :label="t('app.header.links.company.content.side.socials.github')"
                    to="https://github.com/Rimelight-Entertainment"
                    variant="ghost"
                  />
                </div>
                <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500 mt-2">
                  {{ t('app.header.links.company.content.side.contact.title') }}
                </span>
                <div class="grid grid-cols-1 gap-1">
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:mail"
                    :label="t('app.header.links.company.content.side.contact.email')"
                    to="mailto:contact@rimelight.com"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:briefcase"
                    :label="t('app.header.links.company.content.side.contact.inquiries')"
                    to="/company/contact"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:headset"
                    :label="t('app.header.links.company.content.side.contact.support')"
                    to="/support"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #store-content="{ item }">
            <div class="flex flex-col lg:flex-row gap-lg bg-white">
              <div class="flex flex-col lg:flex-row gap-lg p-lg flex-1">
                <NuxtImg
                  class="h-32 lg:h-full w-full lg:w-auto object-cover lg:max-w-80 shrink-0"
                  src="/images/placeholders/placeholder_header_store.jpg"
                />

                <USeparator
                  :ui="{ border: 'border-neutral-200' }"
                  class="hidden lg:block h-full"
                  orientation="vertical"
                />
                <USeparator :ui="{ border: 'border-neutral-200' }" class="lg:hidden w-full" />

                <div class="flex flex-col gap-sm flex-2">
                  <div class="grid grid-cols-2 gap-1">
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.store.content.main.digital_goods.heading') }}</span
                      >
                      <UButton
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        :label="t('app.header.links.store.content.main.digital_goods.sparks')"
                        to="/store/digital"
                        variant="ghost"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                        >{{ t('app.header.links.store.content.main.merchandise.heading') }}</span
                      >
                      <UButton
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        :label="t('app.header.links.store.content.main.merchandise.apparel')"
                        to="/store/merch/apparel"
                        variant="ghost"
                      />
                      <UButton
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        :label="t('app.header.links.store.content.main.merchandise.pins')"
                        to="/store/merch/pins"
                        variant="ghost"
                      />
                      <UButton
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        :label="t('app.header.links.store.content.main.merchandise.plushies')"
                        to="/store/merch/plushies"
                        variant="ghost"
                      />
                      <UButton
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        :label="t('app.header.links.store.content.main.merchandise.posters')"
                        to="/store/merch/posters"
                        variant="ghost"
                      />
                      <UButton
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        :label="t('app.header.links.store.content.main.merchandise.accessories')"
                        to="/store/merch/accessories"
                        variant="ghost"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-sm p-lg bg-neutral-100 w-64">
                <span class="pl-xs text-xs font-bold uppercase tracking-wider text-primary-500"
                  >{{ t('app.header.links.store.content.side.title') }}</span
                >
                <div class="grid grid-cols-1 gap-1">
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:shopping-bag"
                    :label="t('app.header.links.store.content.side.orders')"
                    to="/store/orders"
                    variant="ghost"
                  />
                  <UButton
                    class="text-black hover:bg-neutral-200"
                    color="neutral"
                    icon="lucide:headset"
                    :label="t('app.header.links.store.content.side.customer_support')"
                    to="/franchises/grand-tale/support"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          </template>
        </UNavigationMenu>
      </div>
    </template>
    <template #center></template>
    <template #right>
      <div class="flex flex-row gap-sm">
        <ClientOnly>
          <template v-if="session">
            <div class="flex flex-row items-center gap-md">
              <UTooltip text="Notifications">
                  <UButton
                    class="text-white hover:bg-primary-500"
                    color="neutral"
                    square
                    variant="ghost"
                    @click="slideoverState.notifications = true"
                  >
                    <UChip color="error" inset>
                      <UIcon class="size-5 shrink-0" name="lucide:bell" />
                    </UChip>
                  </UButton>
                </UTooltip>
                <UPopover :ui="{ content: 'w-64' }" arrow mode="hover">
                  <template #default>
                    <UTooltip>
                      <template #default>
                        <UButton
                          class="text-white hover:text-primary-400 transition-colors duration-200"
                          variant="ghost"
                        >
                          <UUser
                            v-if="session"
                            :avatar="{
                              src: session?.user.image ?? '',
                              alt: session?.user.name ?? '',
                            }"
                            :chip="availabilityChip"
                            :description="session?.user.status ?? ''"
                            :name="session?.user.name"
                            :ui="{
                              name: 'text-white group-hover:text-primary-400 transition-colors duration-200',
                              description: 'text-left',
                            }"
                            class="group"
                            size="md"
                          />
                        </UButton>
                      </template>
                    </UTooltip>
                  </template>
                  <template #content>
                    <div class="flex flex-col">
                      <div class="flex flex-col gap-1 bg-white p-sm">
                        <UUser
                          v-if="session"
                          :avatar="{
                            src: session?.user.image ?? '',
                            alt: session?.user.name ?? '',
                          }"
                          :description="session?.user.status ?? 'Set a custom status...'"
                          :ui="{
                            name: 'text-left text-black',
                            description: 'text-left text-neutral-500',
                          }"
                          size="md"
                        >
                          <template #name>
                            <span
                              >{{ session?.user.name }}
                              <span class="text-dimmed">#{{ session?.user.tag }}</span></span
                            >
                          </template>
                        </UUser>
                        <UButton
                          :label="t('dashboard')"
                          class="text-black hover:bg-neutral-200"
                          color="neutral"
                          leading-icon="lucide:layout-dashboard"
                          to="/dashboard"
                          variant="ghost"
                        />
                        <UButton
                          :label="t('account_profile')"
                          class="text-black hover:bg-neutral-200"
                          color="neutral"
                          leading-icon="lucide:user"
                          variant="ghost"
                        />
                      </div>
                    <div class="flex flex-col gap-1 bg-neutral-100 p-sm">
                      <UButton
                        :label="t('account_support')"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        leading-icon="lucide:headset"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('account_settings')"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        leading-icon="lucide:cog"
                        to="/dashboard/settings"
                        variant="ghost"
                      />
                      <UButton
                        :label="t('auth_sign-out')"
                        class="text-black hover:bg-neutral-200"
                        color="neutral"
                        leading-icon="lucide:log-out"
                        variant="ghost"
                        @click="onSignOut"
                      />
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
          <template v-else>
            <UButton :label="t('auth_sign-up')" to="/auth/sign-up" variant="outline" />
            <UButton :label="t('auth_sign-in')" to="/auth/sign-in" variant="solid" />
          </template>
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-left>
      <div class="flex justify-start">
        <ClientOnly>
          <USlideover
            v-model:open="slideoverState.left"
            :handle="false"
            :ui="{
              header: 'flex items-center justify-between',
              content: 'w-full max-w-4/5 rounded-none',
            }"
            side="left"
          >
            <UButton
              color="neutral"
              icon="lucide:menu"
              variant="ghost"
              @click="slideoverState.left = true"
            />
            <template #header>
              <RCLogo class="h-6 w-auto" variant="mark" />
              <UButton
                color="neutral"
                icon="lucide:x"
                variant="ghost"
                @click="slideoverState.left = false"
              />
            </template>
            <template #body>
              <div class="flex size-full flex-col items-start gap-md">
                <UNavigationMenu :items="items" orientation="vertical" variant="link" />
              </div>
            </template>
          </USlideover>
        </ClientOnly>
      </div>
    </template>
    <template #collapsed-center>
      <ClientOnly>
        <RCLogo class="h-6 w-auto" variant="mark" />
      </ClientOnly>
    </template>
    <template #collapsed-right>
      <div class="flex flex-row justify-end gap-sm">
        <ClientOnly>
          <UTooltip text="Notifications">
            <UButton
              color="neutral"
              square
              variant="ghost"
              @click="slideoverState.notifications = true"
            >
              <UChip color="error" inset>
                <UIcon class="size-5 shrink-0" name="lucide:bell" />
              </UChip>
            </UButton>
          </UTooltip>
          <USlideover
            v-model:open="slideoverState.right"
            :handle="false"
            :ui="{
              header: 'flex items-center justify-between',
              content: 'w-full max-w-4/5 rounded-none',
            }"
            side="right"
          >
            <UButton
              color="neutral"
              icon="lucide:user"
              variant="ghost"
              @click="slideoverState.right = true"
            />
            <template #header>
              <UUser
                v-if="session"
                :avatar="{
                  src: session?.user.image ?? '',
                  alt: session?.user.name ?? '',
                }"
                :description="session?.user.status ?? ''"
                :ui="{ description: 'text-left' }"
                size="md"
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
                icon="lucide:x"
                variant="ghost"
                @click="slideoverState.right = false"
              />
            </template>
            <template #body>
              <div class="flex flex-col gap-md">
                <template v-if="session">
                  <UNavigationMenu :items="accountMenuItems" orientation="vertical" />
                </template>
                <template v-else>
                  <UButton
                    :label="t('auth_sign-up')"
                    block
                    to="/auth/sign-up"
                    variant="outline"
                    @click="slideoverState.right = false"
                  />
                  <UButton
                    :label="t('auth_sign-in')"
                    block
                    to="/auth/sign-in"
                    variant="solid"
                    @click="slideoverState.right = false"
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
