<script setup lang="ts">
import { type Page, type PageType } from "rimelight-components/types"
import { getLocalizedContent } from "rimelight-components/utils"

const appConfig = useAppConfig()
const { session } = useAuth()
const { t, locale } = useI18n()

const INITIAL_LIMIT = 10
const NEXT_LIMIT = 9

const allDrafts = ref<Page[]>([])
const currentDraftsOffset = ref(0)
const hasMoreDrafts = ref(true)
const isFetchingMoreDrafts = ref(false)
const hasLoadedNextPostsPage = ref(false)

const allPosts = ref<Page[]>([])
const currentPostsOffset = ref(0)
const hasMorePosts = ref(true)
const isFetchingMorePosts = ref(false)
const hasLoadedNextDraftsPage = ref(false)

/**
 * Generic fetcher for any page type
 */
const fetchPages = async (
    type: PageType,
    status: 'draft' | 'published',
    limit: number,
    offset: number
) => {
  return await $fetch<Page[]>("/api/pages/list", {
    query: { type, status, limit, offset }
  })
}

const fetchDraftsPage = (limit: number, offset: number) =>
    fetchPages("BlogPost", "draft", limit, offset)

const fetchPostsPage = (limit: number, offset: number) =>
    fetchPages("BlogPost", "published", limit, offset)

const { status: initialDraftsStatus } = await useLazyAsyncData(
    "initial-blog-drafts",
    async () => {
      const newDrafts = await fetchDraftsPage(INITIAL_LIMIT, 0)

      if (newDrafts) {
        allDrafts.value = [...newDrafts] // Reset/Set initial
        currentDraftsOffset.value = newDrafts.length
        hasMoreDrafts.value = newDrafts.length === INITIAL_LIMIT
      }
    },
    {
      server: false,
      immediate: session.value?.user?.role === "owner" || session.value?.user?.role === "member"
    }
)

const { status: initialPostsStatus } = await useLazyAsyncData(
    "initial-blog-posts",
    async () => {
      const newPosts = await fetchPostsPage(INITIAL_LIMIT, 0)

      if (newPosts) {
        allPosts.value = [...newPosts]
        currentPostsOffset.value = newPosts.length
        hasMorePosts.value = newPosts.length === INITIAL_LIMIT
      }
    },
    { server: false }
)

const loadNextDraftsPage = async () => {
  if (!hasMoreDrafts.value || isFetchingMoreDrafts.value) return

  isFetchingMoreDrafts.value = true

  const newDrafts = await fetchDraftsPage(NEXT_LIMIT, currentDraftsOffset.value)

  if (newDrafts && newDrafts.length > 0) {
    allDrafts.value.push(...newDrafts)
    currentDraftsOffset.value += newDrafts.length
    hasMoreDrafts.value = newDrafts.length === NEXT_LIMIT
  } else {
    hasMoreDrafts.value = false
  }

  hasLoadedNextDraftsPage.value = true
  isFetchingMoreDrafts.value = false
}

const loadNextPostsPage = async () => {
  if (!hasMorePosts.value || isFetchingMorePosts.value) return

  isFetchingMorePosts.value = true

  const newPosts = await fetchPostsPage(NEXT_LIMIT, currentPostsOffset.value)

  if (newPosts && newPosts.length > 0) {
    allPosts.value.push(...newPosts)
    currentPostsOffset.value += newPosts.length
    hasMorePosts.value = newPosts.length === NEXT_LIMIT
  } else {
    hasMorePosts.value = false
  }

  hasLoadedNextPostsPage.value = true
  isFetchingMorePosts.value = false
}

const formatDate = (date: string | Date) => {
  return useDateFormat(date, "DD/MM/YYYY").value
}

const links = [
  {
    icon: "lucide:rss",
    label: "RSS",
    to: "/blog/rss.xml",
    target: "_blank"
  }
]

useHead({
  title: "me.blog",
  link: [
    {
      rel: "alternate",
      type: "application/atom+xml",
      title: "rimelight.com Blog RSS",
      href: "https://rimelight.com/blog/rss.xml"
    }
  ]
})

useSeoMeta({
  title: "me.blog",
  ogTitle: "me.blog",
  description: `Read the latest blog posts from the ${appConfig.title} Blog.`,
  ogDescription: `Read the latest blog posts from the ${appConfig.title} Blog.`
})
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside> </UPageAside>
      </template>
      <UPageHeader :title="t('page_blog_title')" :links="links">
        <template #description>
          <div class="flex flex-col gap-md">
            {{ t("page_blog_description") }}
            <RCNewsletterSignup />
          </div>
        </template>
      </UPageHeader>
      <UPageBody>
        <div
          v-if="
            session &&
            session.user?.role === 'employee' &&
            initialDraftsStatus === 'pending'
          "
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>
        <RCSection
          v-else-if="session && session.user?.role === 'employee'"
          :level="2"
          title="Drafts"
          description="These posts have currently not been published."
        >
          <UBlogPosts v-if="allDrafts.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
              v-for="(post, index) in allDrafts"
              :key="post.slug"
              :to="`/blog/${post.slug}`"
              :image="{
                src: post.banner?.src,
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246
              }"
              :badge="{
                label: t(post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0'
              }"
              :date="post.posted_at ? formatDate(post.posted_at) : ''"
              :title="getLocalizedContent(post.title, locale)"
              :description="getLocalizedContent(post.description, locale)"
              :authors="[]
              "
              :orientation="index === 0 ? 'horizontal' : 'vertical'"
              :class="[index === 0 && 'col-span-full']"
              variant="subtle"
              :ui="{ image: 'object-center object-contain' }"
            />
          </UBlogPosts>
          <div
            v-if="hasMoreDrafts && allDrafts.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              label="Load More Drafts"
              icon="lucide:arrow-down"
              size="lg"
              color="primary"
              variant="solid"
              :loading="isFetchingMoreDrafts"
              :disabled="isFetchingMoreDrafts"
              @click="loadNextDraftsPage"
            />
          </div>
          <USeparator
            v-else-if="
              allDrafts.length > 0 && !hasMoreDrafts && hasLoadedNextDraftsPage
            "
            label="You've reached the end of the drafts."
            :ui="{ label: 'text-muted' }"
            class="py-12"
          />
        </RCSection>
        <div
          v-if="initialPostsStatus === 'pending'"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>
        <RCSection v-else :level="2" title="Posts">
          <UBlogPosts v-if="allPosts.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
              v-for="(post, index) in allPosts"
              :key="post.slug"
              :to="`/blog/${post.slug}`"
              :image="{
                src: post.banner?.src,
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246
              }"
              :badge="{
                label: t(post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0'
              }"
              :date="post.posted_at ? formatDate(post.posted_at) : ''"
              :title="getLocalizedContent(post.title, locale)"
              :description="getLocalizedContent(post.description, locale)"
              :authors="[]
              "
              :orientation="index === 0 ? 'horizontal' : 'vertical'"
              :class="[index === 0 && 'col-span-full']"
              variant="subtle"
              :ui="{ image: 'object-center object-contain' }"
            />
          </UBlogPosts>
          <div
            v-if="hasMorePosts && allPosts.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              label="Load More Posts"
              icon="lucide:arrow-down"
              size="lg"
              color="primary"
              variant="solid"
              :loading="isFetchingMorePosts"
              :disabled="isFetchingMorePosts"
              @click="loadNextPostsPage"
            />
          </div>
          <USeparator
            v-else-if="
              allPosts.length > 0 && !hasMorePosts && hasLoadedNextPostsPage
            "
            label="You've reached the end of the posts."
            :ui="{ label: 'text-muted' }"
            class="py-12"
          />
        </RCSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
