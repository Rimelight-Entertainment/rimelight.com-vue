<script lang="ts" setup>
import { type Page, type PageType } from "#rimelight-components/types";

const appConfig = useAppConfig();
const { session } = useAuth();
const { t, locale } = useI18n();

const INITIAL_LIMIT = 10;
const NEXT_LIMIT = 9;

const allDrafts = ref<Page[]>([]);
const currentDraftsOffset = ref(0);
const hasMoreDrafts = ref(true);
const isFetchingMoreDrafts = ref(false);
const hasLoadedNextPostsPage = ref(false);

const allPosts = ref<Page[]>([]);
const currentPostsOffset = ref(0);
const hasMorePosts = ref(true);
const isFetchingMorePosts = ref(false);
const hasLoadedNextDraftsPage = ref(false);

/**
 * Generic fetcher for any page type
 */
const fetchPages = async (
  type: PageType,
  status: "draft" | "published",
  limit: number,
  offset: number,
) => {
  return await $fetch<Page[]>("/api/pages/list", {
    query: { type, status, limit, offset },
  });
};

const fetchDraftsPage = (limit: number, offset: number) =>
  fetchPages("BlogPost", "draft", limit, offset);

const fetchPostsPage = (limit: number, offset: number) =>
  fetchPages("BlogPost", "published", limit, offset);

const { status: initialDraftsStatus } = await useLazyAsyncData(
  "initial-blog-drafts",
  async () => {
    const newDrafts = await fetchDraftsPage(INITIAL_LIMIT, 0);

    if (newDrafts) {
      allDrafts.value = [...newDrafts]; // Reset/Set initial
      currentDraftsOffset.value = newDrafts.length;
      hasMoreDrafts.value = newDrafts.length === INITIAL_LIMIT;
    }
  },
  {
    server: false,
    immediate: session.value?.user?.role === "owner" || session.value?.user?.role === "member",
  },
);

const { status: initialPostsStatus } = await useLazyAsyncData(
  "initial-blog-posts",
  async () => {
    const newPosts = await fetchPostsPage(INITIAL_LIMIT, 0);

    if (newPosts) {
      allPosts.value = [...newPosts];
      currentPostsOffset.value = newPosts.length;
      hasMorePosts.value = newPosts.length === INITIAL_LIMIT;
    }
  },
  { server: false },
);

const loadNextDraftsPage = async () => {
  if (!hasMoreDrafts.value || isFetchingMoreDrafts.value) return;

  isFetchingMoreDrafts.value = true;

  const newDrafts = await fetchDraftsPage(NEXT_LIMIT, currentDraftsOffset.value);

  if (newDrafts && newDrafts.length > 0) {
    allDrafts.value.push(...newDrafts);
    currentDraftsOffset.value += newDrafts.length;
    hasMoreDrafts.value = newDrafts.length === NEXT_LIMIT;
  } else {
    hasMoreDrafts.value = false;
  }

  hasLoadedNextDraftsPage.value = true;
  isFetchingMoreDrafts.value = false;
};

const loadNextPostsPage = async () => {
  if (!hasMorePosts.value || isFetchingMorePosts.value) return;

  isFetchingMorePosts.value = true;

  const newPosts = await fetchPostsPage(NEXT_LIMIT, currentPostsOffset.value);

  if (newPosts && newPosts.length > 0) {
    allPosts.value.push(...newPosts);
    currentPostsOffset.value += newPosts.length;
    hasMorePosts.value = newPosts.length === NEXT_LIMIT;
  } else {
    hasMorePosts.value = false;
  }

  hasLoadedNextPostsPage.value = true;
  isFetchingMorePosts.value = false;
};

const formatDate = (date: string | Date) => {
  return useDateFormat(date, "DD/MM/YYYY").value;
};

const links = [
  {
    icon: "lucide:rss",
    label: "RSS",
    to: "/blog/rss.xml",
    target: "_blank",
  },
];

useHead({
  title: "me.blog",
  link: [
    {
      rel: "alternate",
      type: "application/atom+xml",
      title: "rimelight.com Blog RSS",
      href: "https://rimelight.com/blog/rss.xml",
    },
  ],
});

useSeoMeta({
  title: "me.blog",
  ogTitle: "me.blog",
  description: `Read the latest blog posts from the ${appConfig.title} Blog.`,
  ogDescription: `Read the latest blog posts from the ${appConfig.title} Blog.`,
});
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
            <RCNewsletterSignup />
          </div>
        </template>
      </UPageHeader>
      <UPageBody>
        <div
          v-if="session && session.user?.role === 'employee' && initialDraftsStatus === 'pending'"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>
        <RCSection
          v-else-if="session && session.user?.role === 'employee'"
          :level="2"
          description="These posts have currently not been published."
          title="Drafts"
        >
          <UBlogPosts v-if="allDrafts.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
              v-for="(post, index) in allDrafts"
              :key="post.slug"
              :authors="[]"
              :badge="{
                label: t(post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0',
              }"
              :class="[index === 0 && 'col-span-full']"
              :date="post.postedAt ? formatDate(post.postedAt) : ''"
              :description="getLocalizedContent(post.description, locale)"
              :image="{
                src: post.banner?.src,
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246,
              }"
              :orientation="index === 0 ? 'horizontal' : 'vertical'"
              :title="getLocalizedContent(post.title, locale)"
              :to="`/blog/${post.slug}`"
              :ui="{ image: 'object-center object-contain' }"
              variant="subtle"
            />
          </UBlogPosts>
          <div
            v-if="hasMoreDrafts && allDrafts.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              :disabled="isFetchingMoreDrafts"
              :loading="isFetchingMoreDrafts"
              color="primary"
              icon="lucide:arrow-down"
              label="Load More Drafts"
              size="lg"
              variant="solid"
              @click="loadNextDraftsPage"
            />
          </div>
          <USeparator
            v-else-if="allDrafts.length > 0 && !hasMoreDrafts && hasLoadedNextDraftsPage"
            :ui="{ label: 'text-muted' }"
            class="py-12"
            label="You've reached the end of the drafts."
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
              :authors="[]"
              :badge="{
                label: t(post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0',
              }"
              :class="[index === 0 && 'col-span-full']"
              :date="post.postedAt ? formatDate(post.postedAt) : ''"
              :description="getLocalizedContent(post.description, locale)"
              :image="{
                src: post.banner?.src,
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246,
              }"
              :orientation="index === 0 ? 'horizontal' : 'vertical'"
              :title="getLocalizedContent(post.title, locale)"
              :to="`/blog/${post.slug}`"
              :ui="{ image: 'object-center object-contain' }"
              variant="subtle"
            />
          </UBlogPosts>
          <div
            v-if="hasMorePosts && allPosts.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              :disabled="isFetchingMorePosts"
              :loading="isFetchingMorePosts"
              color="primary"
              icon="lucide:arrow-down"
              label="Load More Posts"
              size="lg"
              variant="solid"
              @click="loadNextPostsPage"
            />
          </div>
          <USeparator
            v-else-if="allPosts.length > 0 && !hasMorePosts && hasLoadedNextPostsPage"
            :ui="{ label: 'text-muted' }"
            class="py-12"
            label="You've reached the end of the posts."
          />
        </RCSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
