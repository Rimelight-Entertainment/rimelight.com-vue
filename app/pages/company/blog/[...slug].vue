<script setup lang="ts">
import type { PageLink } from "@nuxt/ui"

const route = useRoute()
const { share } = useShare()
const { copy } = useClipboard()
const toast = useToast()

const blogDrawerOpen = ref(false)
const tocDrawerOpen = ref(false)

const { data: blogNavigation } = await useAsyncData(`navigation`, () =>
  queryCollectionNavigation(`blog`).order(`datePosted`, `DESC`)
)

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(route.path, () =>
    queryCollection(`blog`).path(route.path).first()
  ),
  useAsyncData(`${route.path}-surround`, () => {
    return queryCollectionItemSurroundings(`blog`, route.path, {
      fields: [`description`]
    }).order(`datePosted`, `DESC`)
  })
])

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found.`,
    fatal: true
  })
}

watch(route, () => {
  blogDrawerOpen.value = false
  tocDrawerOpen.value = false
})

watch(
  page,
  (page) => {
    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: `Page not found`,
        fatal: true
      })
    }
  },
  { immediate: true }
)

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

interface PageDetailLink extends PageLink {
  time: string
}

useSeoMeta({
  titleTemplate: `%s - Rimelight Entertainment Blog`,
  title,
  description,
  ogDescription: description,
  ogTitle: `${title} - Rimelight Entertainment Blog`
})

const fixedLinks = [
  {
    label: `Share Post`,
    icon: `lucRLe:send`,
    onClick: async () => {
      try {
        await share({
          title,
          text: description,
          url: `${location.href}`
        })
      } catch {
        toast.add({
          title: `Failed to share page.`,
          description: `An unexpected error occurred. Please try again.`,
          color: `error`
        })
      }
    }
  },
  {
    label: `Copy Link`,
    icon: `lucide:link`,
    onClick: async () => {
      try {
        await copy(`${location.href}`)
        toast.add({
          title: `Page URL copied to clipboard!`,
          color: `success`
        })
      } catch {
        toast.add({
          title: `Failed to copy page URL to clipboard.`,
          description: `An unexpected error occurred. Please try again.`,
          color: `error`
        })
      }
    }
  }
]

const combinedLinks = computed(() => {
  const dynamicLinks = page.value?.links || []
  return [...dynamicLinks, ...fixedLinks]
})

const pageLinks = ref<PageLink[]>([
  {
    label: `Share Post`,
    icon: `lucide:send`,
    to: `https://github.com/nuxt/ui/blob/v4/docs/content/3.components/page-links.md`
  },
  {
    label: `Star on GitHub`,
    icon: `i-lucide-star`,
    to: `https://github.com/nuxt/ui`
  },
  {
    label: `Releases`,
    icon: `i-lucide-rocket`,
    to: `https://github.com/nuxt/ui/releases`
  }
])

const pageDetails = ref<PageDetailLink[]>([
  {
    label: `Created At:`,
    icon: `lucide:calendar-clock`,
    time: page.value.datePosted
  },
  {
    label: `Last Updated:`,
    icon: `lucide:radio`,
    time: page.value.datePosted
  }
])
</script>

<template>
  <UContainer v-if="page">
    <UPage>
      <UPageHeader
        :title="page.title"
        :description="page.description"
        :links="combinedLinks"
      >
        <template #headline>
          <RLLayoutBox direction="vertical" gap="lg" align-items="start">
            <UBreadcrumb
              :items="[{ label: 'Blog', to: '/blog' }, { label: page.title }]"
              class="max-w-full"
            />
            <RLLayoutBox direction="horizontal" gap="sm">
              <span>
                {{ page.category }}
              </span>
              <span class="text-muted"
                >&middot;&nbsp;&nbsp;<NuxtTime
                  :datetime="page.datePosted"
                  year="numeric"
                  month="numeric"
                  day="numeric"
              /></span>
            </RLLayoutBox>
          </RLLayoutBox>
        </template>
        <RLLayoutBox direction="horizontal" gap="md" class="flex-wrap pt-6">
          <UUser
            v-for="(author, index) in page.authors"
            :key="index"
            v-bind="author"
            :description="author.username ? `@${author.username}` : undefined"
          />
        </RLLayoutBox>
      </UPageHeader>
      <UPageBody>
        <ContentRenderer v-if="page.body" :value="page" />
        <USeparator v-if="surround?.length" />
        <UButton
          variant="link"
          icon="lucide:arrow-up-left"
          label="Return to Blog"
          to="/blog"
        />
        <UContentSurround :surround="surround" />
      </UPageBody>
      <template #left>
        <UPageAside>
          <UContentNavigation
            :navigation="blogNavigation"
            :collapsible="false"
            highlight
          />
        </UPageAside>
      </template>
      <template #right>
        <UContentToc
          title="Table of Contents"
          :links="page?.body?.toc?.links"
          highlight
          class="hidden lg:block lg:backdrop-blur-none"
        >
          <template #bottom>
            <USeparator />
            <UPageLinks title="Links" :links="pageLinks" />
            <UPageLinks title="Details" :links="pageDetails">
              <template #link="{ link }">
                <UTooltip>
                  <template #content>
                    <NuxtTime
                      :datetime="link.time"
                      year="numeric"
                      month="numeric"
                      day="numeric"
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      time-zone-name="short"
                      class="text-sm text-muted"
                    />
                  </template>
                  <template #default>
                    <RLLayoutBox direction="horizontal" gap="xs">
                      <UIcon v-if="link.icon" size="20" :name="link.icon" />
                      <span>{{ link.label }}</span>
                      <NuxtTime
                        :datetime="link.time"
                        year="numeric"
                        month="numeric"
                        day="numeric"
                      />
                    </RLLayoutBox>
                  </template>
                </UTooltip>
              </template>
            </UPageLinks>
          </template>
        </UContentToc>
        <div
          class="sticky top-(--ui-header-height) z-10 order-first -mx-4 flex justify-between border-b border-default bg-default p-6 lg:order-last lg:bg-[initial]"
        >
          <UDrawer
            v-model:open="blogDrawerOpen"
            direction="left"
            :handle="false"
            side="left"
            class="lg:hidden"
            :ui="{
              content: 'w-full max-w-2/3 rounded-none'
            }"
          >
            <UButton
              label="Blog"
              icon="lucide:list-tree"
              color="neutral"
              variant="link"
              size="xs"
              aria-label="Open Blog Navigation"
              class="-m-4"
            />
            <template #body>
              <UContentNavigation
                :navigation="blogNavigation"
                default-open
                trailing-icon="lucide:chevron-right"
                :ui="{ linkTrailingIcon: 'group-data-[state=open]:rotate-90' }"
                highlight
              />
            </template>
          </UDrawer>
          <UDrawer
            v-model:open="tocDrawerOpen"
            direction="right"
            :handle="false"
            side="top"
            class="lg:hidden"
            :ui="{
              content: 'w-full max-w-2/3 rounded-none'
            }"
          >
            <UButton
              leading-icon="lucide:table-of-contents"
              color="neutral"
              variant="link"
              size="xs"
              aria-label="Table of Contents"
              class="-m-4"
            />
            <template #body>
              <UContentToc
                title="Table of Contents"
                :links="page?.body?.toc?.links"
                class="lg:block lg:backdrop-blur-none"
                :open="true"
                highlight
                default-open
                :ui="{
                  root: '!mx-0 !px-1 top-0 overflow-visible',
                  container: '!pt-0 border-b-0',
                  trailingIcon: 'hidden',
                  bottom: 'flex flex-col'
                }"
              >
                <template #bottom>
                  <USeparator />
                  <UPageLinks title="Links" :links="pageLinks" />
                  <UPageLinks title="Details" :links="pageDetails">
                    <template #link="{ link }">
                      <UTooltip>
                        <template #content>
                          <NuxtTime
                            :datetime="link.time"
                            year="numeric"
                            month="numeric"
                            day="numeric"
                            hour="numeric"
                            minute="numeric"
                            second="numeric"
                            time-zone-name="short"
                            class="text-sm text-muted"
                          />
                        </template>
                        <template #default>
                          <RLLayoutBox direction="horizontal" gap="xs">
                            <UIcon
                              v-if="link.icon"
                              size="20"
                              :name="link.icon"
                            />
                            <span>{{ link.label }}</span>
                            <NuxtTime
                              :datetime="link.time"
                              year="numeric"
                              month="numeric"
                              day="numeric"
                            />
                          </RLLayoutBox>
                        </template>
                      </UTooltip>
                    </template>
                  </UPageLinks>
                </template>
              </UContentToc>
            </template>
          </UDrawer>
        </div>
      </template>
    </UPage>
  </UContainer>
</template>
