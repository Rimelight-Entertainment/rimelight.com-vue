<script lang="ts" setup>
import {type Page, type PageType} from "#rimelight-components/types"



const appConfig = useAppConfig()
const {session, permissions} = useAuth()
const {t, locale} = useI18n()
const toast = useToast()

const INITIAL_LIMIT = 10
const NEXT_LIMIT = 9

const allDrafts = ref<Page[]>([])
const currentDraftsOffset = ref(0)
const hasMoreDrafts = ref(true)
const ui = reactive({
  isFetchingMoreDrafts: false,
  isFetchingMorePosts: false,
  hasLoadedNextDraftsPage: false,
  hasLoadedNextPostsPage: false,
  isCreateModalOpen: false,
  isCreating: false
})

const allPosts = ref<Page[]>([])
const currentPostsOffset = ref(0)
const hasMorePosts = ref(true)
// Pagination state moved to ui

/**
 * Generic fetcher for any page type
 */
const fetchPages = async (
    type: PageType,
    status: 'draft' | 'published',
    limit: number,
    offset: number
) => {
  try {
    return await $api<Page[]>("/api/pages", {
      query: {type, status, limit, offset},
      timeout: 10000 // Prevent infinite hanging
    })
  } catch (e) {
    console.error(`Failed to fetch ${status} pages:`, e)
    throw e
  }
}

const fetchDraftsPage = (limit: number, offset: number) =>
    fetchPages("BlogPost", "draft", limit, offset)

const fetchPostsPage = (limit: number, offset: number) =>
    fetchPages("BlogPost", "published", limit, offset)

const {status: initialDraftsStatus, refresh: refreshDrafts} = useLazyAsyncData(
    "initial-blog-drafts",
    async () => {
      try {
        const newDrafts = await fetchDraftsPage(INITIAL_LIMIT, 0)

        if (newDrafts) {
          allDrafts.value = [...newDrafts] // Reset/Set initial
          currentDraftsOffset.value = newDrafts.length
          hasMoreDrafts.value = newDrafts.length === INITIAL_LIMIT
        }
      } catch (e) {
        console.error("Failed to load initial drafts:", e)
        throw e
      }
    },
    {
      server: false,
      immediate: (session.value?.user?.role === "owner" || session.value?.user?.role === "member" || session.value?.user?.role === "employee")
    }
)

watch(() => session.value?.user?.role, (newRole) => {
  if (newRole === "owner" || newRole === "member" || newRole === "employee") {
    refreshDrafts()
  }
})

const {status: initialPostsStatus, refresh: refreshPosts} = useLazyAsyncData(
    "initial-blog-posts",
    async () => {
      try {
        const newPosts = await fetchPostsPage(INITIAL_LIMIT, 0)

        if (newPosts) {
          allPosts.value = [...newPosts]
          currentPostsOffset.value = newPosts.length
          hasMorePosts.value = newPosts.length === INITIAL_LIMIT
        }
      } catch (e) {
        console.error("Failed to load initial posts:", e)
        throw e
      }
    },
    {server: false, immediate: true}
)

const loadNextDraftsPage = async () => {
  if (!hasMoreDrafts.value || ui.isFetchingMoreDrafts) return

  ui.isFetchingMoreDrafts = true

  const newDrafts = await fetchDraftsPage(NEXT_LIMIT, currentDraftsOffset.value)

  if (newDrafts && newDrafts.length > 0) {
    allDrafts.value.push(...newDrafts)
    currentDraftsOffset.value += newDrafts.length
    hasMoreDrafts.value = newDrafts.length === NEXT_LIMIT
  } else {
    hasMoreDrafts.value = false
  }

  ui.hasLoadedNextDraftsPage = true
  ui.isFetchingMoreDrafts = false
}

const loadNextPostsPage = async () => {
  if (!hasMorePosts.value || ui.isFetchingMorePosts) return

  ui.isFetchingMorePosts = true

  const newPosts = await fetchPostsPage(NEXT_LIMIT, currentPostsOffset.value)

  if (newPosts && newPosts.length > 0) {
    allPosts.value.push(...newPosts)
    currentPostsOffset.value += newPosts.length
    hasMorePosts.value = newPosts.length === NEXT_LIMIT
  } else {
    hasMorePosts.value = false
  }

  ui.hasLoadedNextPostsPage = true
  ui.isFetchingMorePosts = false
}

const formatDate = (date: string | Date) => {
  return useDateFormat(date, "DD/MM/YYYY").value
}

// Create state moved to ui
const newPostState = reactive({
  title: '',
  slug: ''
})

const handleCreateSubmit = async () => {
  ui.isCreating = true
  try {
    const createdPage = await $api<Page>('/api/pages', {
      method: 'POST',
      body: {
        type: 'BlogPost',
        slug: newPostState.slug,
        title: {[locale.value]: newPostState.title},
        description: {[locale.value]: ''},
        content: {
          properties: {},
          blocks: []
        }
      }
    })

    toast.add({color: 'success', title: t('toast_create_success')})
    ui.isCreateModalOpen = false
    await navigateTo(`/blog/${createdPage.slug}/edit`)
  } catch (e: any) {
    toast.add({
      color: 'error',
      title: t('toast_create_error'),
      description: e.message || 'Failed to create post'
    })
  } finally {
    ui.isCreating = false
  }
}

const slugify = (str: string) => str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')

watch(() => newPostState.title, (newTitle, oldTitle) => {
  const oldGeneratedSlug = slugify(oldTitle || '')
  if (!newPostState.slug || newPostState.slug === oldGeneratedSlug) {
    newPostState.slug = slugify(newTitle)
  }
})

const links = computed(() => {
  return [
    {
      icon: "lucide:rss",
      label: "RSS",
      to: "/blog/rss.xml",
      target: "_blank"
    }
  ]
})

useHead({
  title: "me.blog",
  link: [
    {
      rel: "alternate",
      type: "application/atom+xml",
      title: "idantity.me Blog RSS",
      href: "https://idantity.me/blog/rss.xml"
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
        <UPageAside></UPageAside>
      </template>
      <UPageHeader :links="links" :title="t('page_blog_title')">
        <template #description>
          <div class="flex flex-col gap-md">
            {{ t("page_blog_description") }}
            <RCNewsletterSignup/>
          </div>
        </template>
        <template #links>
          <UButton
              v-if="permissions.blog.canCreate.value"
              :onClick="() => { ui.isCreateModalOpen = true }"
              icon="lucide:plus"
              label="Create Post"
              size="sm"
          />
        </template>
      </UPageHeader>
      <UPageBody>
        <div
            v-if="
            session &&
            (session.user?.role === 'employee' || session.user?.role === 'owner' || session.user?.role === 'member') &&
            initialDraftsStatus === 'pending' && !allDrafts.length
          "
            class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96"/>
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none"/>
        </div>
        <div v-else-if="initialDraftsStatus === 'error'" class="py-8 text-center text-error-500">
          <UIcon class="w-8 h-8 mx-auto mb-2" name="lucide:alert-circle"/>
          <p>Failed to load drafts. Please check your connection.</p>
          <UButton label="Try Again" size="sm" variant="ghost" @click="() => refreshDrafts()"/>
        </div>
        <RCSection
            v-else-if="session && (session.user?.role === 'employee' || session.user?.role === 'owner' || session.user?.role === 'member')"
            :level="2"
            description="These posts have currently not been published."
            title="Drafts"
        >
          <UBlogPosts v-if="allDrafts.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
                v-for="(post, index) in allDrafts"
                :key="post.slug"
                :authors="[]
              "
                :badge="{
                label: t(post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0'
              }"
                :class="[index === 0 && 'col-span-full']"
                :date="post.postedAt ? formatDate(post.postedAt) : ''"
                :description="getLocalizedContent(post.description, locale)"
                :image="{
                src: post.banner?.src,
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246
              }"
                :orientation="index === 0 ? 'horizontal' : 'vertical'"
                :title="getLocalizedContent(post.title, locale)"
                :to="`/blog/${post.slug}/edit`"
                :ui="{ image: 'object-center object-contain' }"
                variant="subtle"
            />
          </UBlogPosts>
          <div
              v-if="hasMoreDrafts && allDrafts.length > 0"
              class="col-span-full flex justify-center py-8"
          >
            <UButton
                :disabled="ui.isFetchingMoreDrafts"
                :loading="ui.isFetchingMoreDrafts"
                color="primary"
                icon="lucide:arrow-down"
                label="Load More Drafts"
                size="lg"
                variant="solid"
                @click="loadNextDraftsPage"
            />
          </div>
          <USeparator
              v-else-if="
              allDrafts.length > 0 && !hasMoreDrafts && ui.hasLoadedNextDraftsPage
            "
              :ui="{ label: 'text-muted' }"
              class="py-12"
              label="You've reached the end of the drafts."
          />
        </RCSection>
        <div
            v-if="initialPostsStatus === 'pending' && !allPosts.length"
            class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96"/>
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none"/>
        </div>
        <div v-else-if="initialPostsStatus === 'error'" class="py-8 text-center text-error-500">
          <UIcon class="w-8 h-8 mx-auto mb-2" name="lucide:alert-circle"/>
          <p>Failed to load posts. Please check your connection.</p>
          <UButton label="Try Again" size="sm" variant="ghost" @click="() => refreshPosts()"/>
        </div>
        <RCSection v-else :level="2" title="Posts">
          <UBlogPosts v-if="allPosts.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
                v-for="(post, index) in allPosts"
                :key="post.slug"
                :authors="[]
              "
                :badge="{
                label: t(post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0'
              }"
                :class="[index === 0 && 'col-span-full']"
                :date="post.postedAt ? formatDate(post.postedAt) : ''"
                :description="getLocalizedContent(post.description, locale)"
                :image="{
                src: post.banner?.src,
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246
              }"
                :orientation="index === 0 ? 'horizontal' : 'vertical'"
                :title="getLocalizedContent(post.title, locale)"
                :to="`/blog/${post.slug}`"
                :ui="{ image: 'object-center object-contain' }"
                variant="subtle"
            />
          </UBlogPosts>
          <UEmpty
              v-else-if="permissions.blog.canCreate.value"
              :actions="[{
              label: t('blog_empty_create_action', 'Create first post'),
              color: 'primary',
              variant: 'solid',
              icon: 'lucide:plus',
              onClick: () => { ui.isCreateModalOpen = true }
            }]"
              :description="t('blog_empty_description', 'Be the first to share something with the world!')"
              :title="t('blog_empty_title', 'No blog posts yet')"
              class="py-12"
              icon="lucide:pen-tool"
          />
          <div
              v-if="hasMorePosts && allPosts.length > 0"
              class="col-span-full flex justify-center py-8"
          >
            <UButton
                :disabled="ui.isFetchingMorePosts"
                :loading="ui.isFetchingMorePosts"
                color="primary"
                icon="lucide:arrow-down"
                label="Load More Posts"
                size="lg"
                variant="solid"
                @click="loadNextPostsPage"
            />
          </div>
          <USeparator
              v-else-if="
              allPosts.length > 0 && !hasMorePosts && ui.hasLoadedNextPostsPage
            "
              :ui="{ label: 'text-muted' }"
              class="py-12"
              label="You've reached the end of the posts."
          />
        </RCSection>
      </UPageBody>
    </UPage>

    <!-- Create Post Modal -->
    <UModal v-model:open="ui.isCreateModalOpen" title="Create New Blog Post">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Title" required>
            <UInput v-model="newPostState.title" autofocus placeholder="My Awesome Post"/>
          </UFormField>
          <UFormField help="The URL-friendly name of the post" label="Slug" required>
            <UInput v-model="newPostState.slug" placeholder="my-awesome-post"/>
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
              color="neutral"
              label="Cancel"
              variant="ghost"
              @click="ui.isCreateModalOpen = false"
          />
          <UButton
              :loading="ui.isCreating"
              color="primary"
              label="Create"
              @click="handleCreateSubmit"
          />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<style scoped></style>
