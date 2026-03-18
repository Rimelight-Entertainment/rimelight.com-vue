<script lang="ts" setup>
import { type Page } from "#rimelight-components/types"
import type { ButtonProps } from "@nuxt/ui"

const { t, locale } = useI18n()
const { origin } = useRequestURL()

const { data: latestPosts, status: postsStatus } = useLazyAsyncData(
  "latest-blog-posts",
  () =>
    $api<Page[]>("/api/pages", {
      query: { type: "BlogPost", status: "published", limit: 3, offset: 0 },
      timeout: 10000
    }),
  { server: false }
)

const formatDate = (date: string | Date) => {
  return useDateFormat(date, "DD/MM/YYYY").value
}

useHead({
  title: "Rimelight Entertainment | Home"
})

useSeoMeta({
  title: "Rimelight Entertainment",
  ogTitle: "Rimelight Entertainment",
  description: "Tell your story.",
  ogDescription: "Tell your story."
})

const heroLinks = ref<ButtonProps[]>([
  {
    color: "primary",
    label: t("pages.home.sections.hero.actions.joinUs"),
    to: "/auth/sign-up",
    class: "text-white bg-primary-500 hover:bg-primary-600"
  },
  {
    color: "neutral",
    variant: "outline",
    trailingIcon: "lucide:arrow-right",
    label: t("pages.home.sections.hero.actions.learnMore"),
    to: "/company/about",
    class: "text-white ring-white bg-transparent hover:bg-black hover:text-white"
  }
])

const featuredProjects = [
  {
    tags: ["franchise", "fantasy", "social"],
    title: "Grand Tale",
    description: t("pages.home.sections.projects.content.grandTale.description"),
    image: "/images/placeholders/placeholder_home_projects_grand-tale.png",
    to: "/franchises/grand-tale"
  }
]

const ctaLinks = ref<ButtonProps[]>([
  {
    color: "primary",
    label: t("pages.home.sections.cta.actions.createAccount"),
    to: "/auth/sign-up",
    class: "text-white bg-primary-500 hover:bg-primary-600"
  },
  {
    variant: "outline",
    color: "neutral",
    label: t("pages.home.sections.cta.actions.exploreCareers"),
    to: "/company/careers",
    class: "text-black ring-black bg-transparent hover:bg-black hover:text-white"
  }
])

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
  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <!--        <video-->
      <!--          autoplay-->
      <!--          class="h-full w-full object-cover"-->
      <!--          loop-->
      <!--          muted-->
      <!--          playsinline-->
      <!--          poster="/images/placeholders/placeholder_header_store.webp"-->
      <!--        >-->
      <!--          <source src="/videos/hero-background.mp4" type="video/mp4"/>-->
      <!--        </video>-->
      <NuxtImg
        alt="Hero background"
        class="h-full w-full object-cover"
        src="/images/placeholders/placeholder_home_hero_background.png"
      />
    </div>

    <div class="absolute inset-0 -z-10 bg-black/30" />

    <UPageHero
      :links="heroLinks"
      :title="t('pages.home.sections.hero.title')"
      :description="t('pages.home.sections.hero.description')"
      orientation="vertical"
      reverse
      :ui="{ title: 'text-white', description: 'text-neutral-300' }"
      class="relative z-0"
    >
      <div class="flex h-full w-full items-center justify-center">
        <div class="pointer-events-none">
          <RCLogo class="h-48 w-full" variant="mark" />
        </div>
      </div>
    </UPageHero>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg
        alt="Projects background"
        class="h-full w-full object-cover"
        src="/images/placeholders/placeholder_home_company_background.jpg"
      />
    </div>
    <div class="absolute inset-0 -z-10 bg-black/93" />

    <UPageSection
      :ui="{
        title: 'font-bold uppercase leading-tight',
        description: 'text-neutral-400'
      }"
      orientation="horizontal"
    >
      <template #title>
        {{ t("pages.home.sections.company.title", { interactive: "interactive media" }) }}
      </template>

      <template #description>
        {{ t("pages.home.sections.company.description") }}
      </template>

      <template #body>
        <div class="grid grid-cols-2 gap-lg">
          <div>
            <div class="text-4xl font-bold text-white">3+</div>
            <div class="text-sm text-neutral-500 uppercase tracking-widest">
              {{ t("pages.home.sections.company.stats.titles.label") }}
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-white">50+</div>
            <div class="text-sm text-neutral-500 uppercase tracking-widest">
              {{ t("pages.home.sections.company.stats.creators.label") }}
            </div>
          </div>
        </div>
      </template>

      <ClientOnly>
        <ScriptYouTubePlayer
          above-the-fold
          trigger="immediate"
          thumbnail-size="maxresdefault"
          video-id="uH1Hw6SDI1M"
          class="aspect-video relative overflow-hidden rounded-xl shadow-2xl"
          :params="{
            origin: origin
          }"
        />
        <template #fallback>
          <div
            class="aspect-video relative overflow-hidden rounded-xl shadow-2xl bg-neutral-900 animate-pulse flex items-center justify-center"
          >
            <UIcon name="i-lucide:play" class="size-12 text-neutral-700" />
          </div>
        </template>
      </ClientOnly>
    </UPageSection>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg
        alt="Projects background"
        class="h-full w-full object-cover"
        src="/images/placeholders/placeholder_home_projects_background.jpg"
      />
    </div>
    <div class="absolute inset-0 -z-10" />

    <UPageSection>
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-4xl text-black md:text-5xl font-bold uppercase tracking-tight">
            Our Projects
          </h2>
          <div class="h-1 w-24 bg-primary-500" />
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-lg">
        <NuxtLink
          v-for="(project, index) in featuredProjects"
          :key="index"
          :to="project.to"
          class="block relative h-128 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] group"
        >
          <UCard
            class="relative h-full w-full overflow-hidden isolate transition-transform duration-700 ease-out group-hover:scale-[1.02] rounded-[inherit] will-change-transform"
          >
            <div class="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
              <NuxtImg
                :alt="project.title"
                :src="project.image"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent"
              />
            </div>

            <div class="absolute inset-0 p-lg flex flex-col gap-sm justify-end z-10">
              <div class="flex gap-sm">
                <UBadge
                  v-for="tag in project.tags"
                  :key="tag"
                  :label="t('pages.home.sections.projects.tags.' + tag)"
                  class="text-white font-bold uppercase tracking-wider bg-primary-500"
                  color="primary"
                  variant="solid"
                />
              </div>
              <h3 class="text-3xl font-bold uppercase text-white">
                {{ project.title }}
              </h3>
              <p class="text-neutral-400">
                {{ project.description }}
              </p>
              <UButton
                class="font-bold uppercase tracking-widest -ml-2 pointer-events-none"
                :label="t('pages.home.sections.projects.actions.discover')"
                trailing-icon="lucide:arrow-right"
                variant="link"
              />
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg
        alt="CTA background"
        class="h-full w-full object-cover"
        src="/images/placeholders/placeholder_home_news_background.jpg"
      />
    </div>

    <div class="absolute inset-0 -z-10 bg-black/80" />

    <UPageSection
      :description="t('pages.home.sections.news.description')"
      :title="t('pages.home.sections.news.title')"
      :ui="{ title: 'text-white' }"
    >
      <ClientOnly>
        <UBlogPosts v-if="latestPosts?.length" class="grid md:grid-cols-2 lg:grid-cols-3">
          <UBlogPost
            v-for="post in latestPosts"
            :key="post.slug"
            :authors="[]"
            :badge="{
              label: t('common.types.' + post.type),
              color: 'primary',
              variant: 'outline',
              class: 'rounded-none p-0 ring-0'
            }"
            :date="post.postedAt ? formatDate(post.postedAt) : ''"
            :description="getLocalizedContent(post.description, locale)"
            :image="{
              src:
                post.banner?.src || '/images/placeholders/placeholder_home_projects_grand-tale.png',
              alt: post.banner?.alt
            }"
            :title="getLocalizedContent(post.title, locale)"
            :to="`/company/blog/${post.slug}`"
            :ui="{ image: 'object-center object-cover', title: 'text-black' }"
            class="bg-white"
            variant="soft"
          />
        </UBlogPosts>

        <div v-else-if="postsStatus === 'pending'" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>

        <template #fallback>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
          </div>
        </template>
      </ClientOnly>

      <div v-if="latestPosts?.length" class="flex justify-center mt-12">
        <UButton
          color="primary"
          to="/company/blog"
          trailing-icon="lucide:arrow-right"
          variant="link"
        >
          {{ t("pages.home.sections.news.actions.viewAll") }}
        </UButton>
      </div>
    </UPageSection>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg
        alt="CTA background"
        class="h-full w-full object-cover"
        src="/images/placeholders/placeholder_home_cta_background.jpg"
      />
    </div>

    <UPageCTA
      :links="ctaLinks"
      :title="t('pages.home.sections.cta.title')"
      :description="t('pages.home.sections.cta.description')"
      :ui="{ title: 'text-black', description: 'text-black' }"
      variant="naked"
    />
  </div>
</template>

<style scoped></style>
