<script setup lang="ts">
definePageMeta({
  layout: "grand-tale",
});

import type { ButtonProps } from "@nuxt/ui";

/* region State */
const { t } = useI18n();

const heroLinks = ref<ButtonProps[]>([
  {
    size: "xl",
    color: "grandTaleSecondary",
    label: t("pages.franchises.grandTale.home.sections.hero.actions.playNow"),
    to: "/franchises/grand-tale/download",
    ui: {
      base: "px-8 py-4 text-2xl font-black",
    },
    class:
      "uppercase transition-transform duration-300 hover:scale-110 text-white font-bold bg-grand-tale-secondary-500 hover:bg-grand-tale-secondary-600",
  },
]);

const overviewLinks = ref<ButtonProps[]>([
  {
    color: "grandTaleSecondary",
    label: t("pages.franchises.grandTale.home.sections.overview.actions.learnMore"),
    to: "/franchises/grand-tale/about",
    class: "text-white bg-grand-tale-secondary-500 hover:bg-grand-tale-secondary-500",
  },
  {
    color: "neutral",
    variant: "outline",
    trailingIcon: "lucide:arrow-right",
    label: t("pages.franchises.grandTale.home.sections.overview.actions.watchTrailer"),
    to: "/company/about",
    class: "text-white ring-white bg-transparent hover:bg-black hover:text-white",
  },
]);

const heroVideo = useTemplateRef<HTMLVideoElement>("heroVideo");
const LOOP_START = 193; // Seconds
const LOOP_END = 250; // Seconds
const isPaused = ref(false);
/* endregion */

/* region Meta */
useHead({
  title: "Grand Tale | Home",
});

useSeoMeta({
  title: "Grand Tale - An Epic RPG Journey",
  description:
    "Experience Grand Tale, an epic journey through a shattered world where every choice resonates through eternity.",
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
const onVideoTimeUpdate = (event: Event) => {
  const video = event.currentTarget as HTMLVideoElement;
  if (video.currentTime >= LOOP_END) {
    video.currentTime = LOOP_START;
  }
};

const onVideoLoadedMetadata = (event: Event) => {
  const video = event.currentTarget as HTMLVideoElement;
  video.currentTime = LOOP_START;
};

const onVideoEnded = (event: Event) => {
  const video = event.currentTarget as HTMLVideoElement;
  video.currentTime = LOOP_START;
  video.play();
  isPaused.value = false;
};

const togglePlayback = () => {
  if (!heroVideo.value) return;

  if (heroVideo.value.paused) {
    heroVideo.value.play();
    isPaused.value = false;
  } else {
    heroVideo.value.pause();
    isPaused.value = true;
  }
};
/* endregion */
</script>

<template>
  <div>
    <div class="relative overflow-hidden isolate">
      <div class="absolute inset-0 -z-20 overflow-hidden">
        <video
          ref="heroVideo"
          autoplay
          class="h-full w-full min-h-full min-w-full object-cover scale-[1.35]"
          muted
          playsinline
          @timeupdate="onVideoTimeUpdate"
          @loadedmetadata="onVideoLoadedMetadata"
          @ended="onVideoEnded"
        >
          <source
            :src="`https://cdn.rimelight.com/Videos/grandTale_home_hero_bg.mp4#t=${LOOP_START}`"
            type="video/mp4"
          />
        </video>
      </div>

      <div class="absolute inset-0 -z-10 bg-black/20" />
      <div
        class="absolute inset-x-0 bottom-0 h-1/2 -z-10 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none"
      />
      <div
        class="absolute inset-x-0 bottom-0 h-64 -z-10 backdrop-blur-xl pointer-events-none"
        style="
          mask-image: linear-gradient(to top, black, transparent);
          -webkit-mask-image: linear-gradient(to top, black, transparent);
        "
      />

      <UPageHero
        :links="heroLinks"
        :title="t('pages.franchises.grandTale.home.sections.hero.title')"
        :description="t('pages.franchises.grandTale.home.sections.hero.description')"
        orientation="vertical"
        reverse
        :ui="{ title: 'text-white', description: 'text-neutral-300' }"
        class="relative z-10"
      >
        <div class="flex h-full w-full items-center justify-center relative z-20">
          <div class="pointer-events-none">
            <NuxtImg
              src="https://cdn.rimelight.com/Franchises/Grand%20Tale/Logos/Grand%20Tale%20-%20Logotype.png"
              class="h-80 w-full -my-24"
            />
          </div>
        </div>
      </UPageHero>

      <div class="absolute bottom-8 left-8 z-50">
        <UButton
          :icon="isPaused ? 'lucide:play' : 'lucide:pause'"
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full bg-black/10 hover:bg-black/30 text-white/30 hover:text-white backdrop-blur-xs transition-all ring-1 ring-white/10"
          @click="togglePlayback"
        />
      </div>
    </div>

    <div class="relative overflow-hidden isolate">
      <div class="absolute inset-0 -z-20">
        <NuxtImg
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
          alt="Grand Tale Hero"
          class="w-full h-full object-cover opacity-30 mix-blend-overlay"
          loading="eager"
        />
      </div>
      <div class="absolute inset-0 -z-10 bg-black/93" />

      <UPageSection
        :title="t('pages.franchises.grandTale.home.sections.overview.title')"
        :description="t('pages.franchises.grandTale.home.sections.overview.description')"
        :links="overviewLinks"
        :ui="{
          title: 'font-bold uppercase leading-tight',
          description: 'text-neutral-400',
        }"
        orientation="horizontal"
      >
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

        <ScriptYouTubePlayer
          above-the-fold
          trigger="immediate"
          thumbnail-size="maxresdefault"
          video-id="QdXl3QtutQI"
          class="aspect-video relative overflow-hidden rounded-xl shadow-2xl"
        />
      </UPageSection>
    </div>

    <!-- Content Sections -->
    <section class="py-20">
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard
            v-for="i in 3"
            :key="i"
            class="bg-grand-tale-primary-800/20 border-grand-tale-secondary-700/50 hover:border-grand-tale-secondary-500/50 transition-colors"
          >
            <template #header>
              <h3 class="text-xl font-bold text-white uppercase">Feature {{ i }}</h3>
            </template>
            <p class="text-grand-tale-secondary-100/60">
              Discover the deep mechanics and rich lore that make Grand Tale a unique experience in
              the RPG landscape.
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>
  </div>
</template>
