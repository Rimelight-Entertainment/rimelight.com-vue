<script lang="ts" setup>
import {type Page} from "#rimelight-components/types"
import type {ButtonProps} from '@nuxt/ui'

const {t, locale} = useI18n();

const {data: latestPosts, status: postsStatus} = useLazyAsyncData(
  "latest-blog-posts",
  () => $api<Page[]>("/api/pages", {
    query: {type: "BlogPost", status: "published", limit: 3, offset: 0},
    timeout: 10000
  }),
  {server: false}
)

const formatDate = (date: string | Date) => {
  return useDateFormat(date, "DD/MM/YYYY").value
}

useHead({
  title: "Rimelight Entertainment",
});

useSeoMeta({
  title: "Rimelight Entertainment",
  ogTitle: "Rimelight Entertainment",
  description: "Creating worlds beyond imagination.",
  ogDescription: "Creating worlds beyond imagination.",
});

const heroLinks = ref<ButtonProps[]>([
  {
    color: 'primary',
    label: t('home_hero_actions_01'),
    to: '/auth/sign-up',
    class: 'text-white bg-primary-500 hover:bg-primary-600'
  },
  {
    color: 'neutral',
    variant: 'outline',
    trailingIcon: 'lucide:arrow-right',
    label: t('home_hero_actions_02'),
    to: '/company/about',
    class: 'text-neutral-300 ring-neutral-300 bg-transparent hover:bg-neutral-800/50'
  },
])

const featuredProjects = [
  {
    tags: ["Franchise", "Fantasy", "Social"],
    title: "Grand Tale",
    description: "A high-fantasy social life-sim game which hosts sub-games of multiple genres.",
    image: "/images/placeholders/placeholder_home_projects_grand-tale.png",
    to: "/franchises/grand-tale"
  }
]

const ctaLinks = ref<ButtonProps[]>([
  {
    color: 'primary',
    label: t('home_cta_actions_01'),
    to: '/auth/sign-up',
    class: 'text-white bg-primary-500 hover:bg-primary-600'
  },
  {
    variant: 'outline',
    color: 'neutral',
    label: t('home_cta_actions_02'),
    to: '/company/careers',
    class: 'text-black ring-black bg-transparent hover:bg-neutral-800/50'
  }
])
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
      <NuxtImg alt="Hero background" class="h-full w-full object-cover"
               src="/images/placeholders/placeholder_home_hero_background.jpg"/>
    </div>

    <div class="absolute inset-0 -z-10 bg-black/50"/>

    <UPageHero :description="t('home_hero_description')" :links="heroLinks" :title="t('home_hero_title')"
               :ui="{ title: 'text-white', description: 'text-neutral-300' }" class="relative z-0"
               orientation="vertical"
               reverse>
      <div class="flex h-full w-full items-center justify-center">
        <div class="pointer-events-none">
          <RCLogo class="h-48 w-full" variant="mark"/>
        </div>
      </div>
    </UPageHero>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20 bg-black">
      <NuxtImg alt="Projects background" class="h-full w-full object-cover"
               src="/images/placeholders/placeholder_home_projects_background.jpg"/>
    </div>
    <div class="absolute inset-0 -z-10 bg-black/90"/>

    <UPageSection :ui="{
    title: 'font-bold uppercase leading-tight',
    description: 'text-neutral-400',
  }" orientation="horizontal">
      <template #title>
        Pushing the boundaries of <span class="text-primary-500">interactive media</span>
      </template>

      <template #description>
        Founded in 2023, Rimelight Entertainment is independent and player-focused. We don't just create games; we
        create living, breathing worlds that respect your time and intelligence.
      </template>

      <template #body>
        <div class="grid grid-cols-2 gap-lg">
          <div>
            <div class="text-4xl font-bold text-white">3+</div>
            <div class="text-sm text-neutral-500 uppercase tracking-widest">Titles in Development</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-white">50+</div>
            <div class="text-sm text-neutral-500 uppercase tracking-widest">Global Creators</div>
          </div>
        </div>
      </template>

      <div
        class="relative aspect-video bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center group">
        <div class="absolute inset-0 bg-linear-to-tr from-primary-900/20 to-neutral-900/20"/>
        <UIcon class="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-300"
               name="lucide:play"/>
      </div>
    </UPageSection>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg alt="Projects background" class="h-full w-full object-cover"
               src="/images/placeholders/placeholder_home_projects_background.jpg"/>
    </div>
    <div class="absolute inset-0 -z-10"/>

    <UPageSection>
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-4xl text-black md:text-5xl font-bold uppercase tracking-tight">Our Projects</h2>
          <div class="h-1 w-24 bg-primary-500"/>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-lg">
        <NuxtLink v-for="(project, index) in featuredProjects" :key="index" :to="project.to"
                  class="block relative h-128 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
          <UCard
            class="group h-full w-full overflow-hidden">
            <div class="absolute inset-0 z-0">
              <NuxtImg :alt="project.title" :src="project.image"
                       class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                       loading="lazy"/>
              <div class="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent"/>
            </div>

            <div class="absolute inset-0 p-lg flex flex-col gap-sm justify-end z-10">
              <div class="flex gap-sm">
                <UBadge v-for="tag in project.tags" :key="tag" :label="tag"
                        class="text-white font-bold uppercase tracking-wider" color="primary" variant="solid"/>
              </div>
              <h3 class="text-3xl font-bold uppercase text-white">
                {{ project.title }}
              </h3>
              <p class="text-neutral-400">
                {{ project.description }}
              </p>
              <UButton class="font-bold uppercase tracking-widest -ml-2" label="Discover"
                       trailing-icon="lucide:arrow-right" variant="link"/>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>
  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg alt="CTA background" class="h-full w-full object-cover"
               src="/images/placeholders/placeholder_home_cta_background.jpg"/>
    </div>

    <UPageSection :description="t('home_news_description')" :title="t('home_news_title')">
      <UBlogPosts v-if="latestPosts?.length" class="grid md:grid-cols-2 lg:grid-cols-3">
        <UBlogPost v-for="post in latestPosts" :key="post.slug" :authors="[]" :badge="{
          label: t(post.type),
          color: 'primary',
          variant: 'outline',
          class: 'rounded-none p-0 ring-0'
        }" :date="post.postedAt ? formatDate(post.postedAt) : ''"
                   :description="getLocalizedContent(post.description, locale)" :image="{
            src: post.banner?.src,
            alt: post.banner?.alt,
          }" :title="getLocalizedContent(post.title, locale)" :to="`/company/blog/${post.slug}`"
                   :ui="{ image: 'object-center object-contain' }" variant="subtle"/>
      </UBlogPosts>

      <div v-else-if="postsStatus === 'pending'" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none"/>
      </div>

      <div v-if="latestPosts?.length" class="flex justify-center mt-12">
        <UButton color="neutral" to="/company/blog" trailing-icon="lucide:arrow-right" variant="link">
          View All News
        </UButton>
      </div>
    </UPageSection>


  </div>

  <div class="relative overflow-hidden isolate">
    <div class="absolute inset-0 -z-20">
      <NuxtImg alt="CTA background" class="h-full w-full object-cover"
               src="/images/placeholders/placeholder_home_cta_background.jpg"/>
    </div>

    <UPageCTA :description="t('home_cta_description')" :links="ctaLinks" :title="t('home_cta_title')"
              :ui="{ title: 'text-black', description: 'text-black' }" variant="naked"/>
  </div>
</template>

<style scoped></style>
