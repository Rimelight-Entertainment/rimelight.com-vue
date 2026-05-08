<script setup lang="ts">
definePageMeta({
  layout: "wiki",
});

useHead({
  title: "Grand Tale Wiki",
});

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
const { data: articleCount } = await useFetch<number>(() => "/api/pages/count", {
  query: { slugPrefix: "franchises/grand-tale/wiki" },
});
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div class="space-y-16">
    <section class="space-y-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 text-grand-tale-secondary-400 text-xs font-bold uppercase tracking-widest"
      >
        Wiki Home
      </div>
      <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">
        The Great Library <br />
        of
        <span class="text-grand-tale-secondary-500">Aethelgard</span>
      </h1>
      <p class="text-xl text-grand-tale-secondary-100/60 font-light max-w-2xl leading-relaxed">
        Welcome to the central knowledge hub of Grand Tale. Here you will find detailed
        documentation on everything from the smallest shards of Soulstone to the legendary figures
        who shaped history.
      </p>
      <div class="flex flex-col md:flex-row gap-6 items-start lg:items-center">
        <div
          class="bg-grand-tale-primary-950/50 border border-grand-tale-secondary-800/50 p-6 flex gap-4 w-full max-w-xl"
        >
          <UInput
            icon="lucide:search"
            placeholder="Search the library..."
            size="xl"
            class="flex-1"
            color="neutral"
            variant="outline"
            :ui="{
              base: 'bg-grand-tale-primary-800/20 border-grand-tale-secondary-800/50 focus:border-grand-tale-secondary-500/50 transition-colors',
            }"
          />
          <UButton color="neutral" icon="lucide:arrow-right" size="xl" />
        </div>

        <div class="flex gap-12 px-6">
          <div>
            <div class="text-3xl font-black text-white leading-none">
              {{ articleCount?.toLocaleString() ?? 0 }}
            </div>
            <div
              class="text-xs text-grand-tale-secondary-400 uppercase font-black tracking-widest mt-1"
            >
              Articles
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-white leading-none">52</div>
            <div
              class="text-xs text-grand-tale-secondary-400 uppercase font-black tracking-widest mt-1"
            >
              Contributors
            </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="border-grand-tale-secondary-800/30" />

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:compass" class="text-grand-tale-secondary-500" />
        Quick Navigation
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink to="/franchises/grand-tale/wiki/getting-started" class="group">
          <UCard
            class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div
                class="p-3 bg-grand-tale-primary-500/20 rounded-none border border-grand-tale-secondary-500/30"
              >
                <UIcon name="lucide:book-open" class="size-6 text-grand-tale-secondary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3
                  class="text-lg font-bold text-white group-hover:text-grand-tale-secondary-400 uppercase"
                >
                  Getting Started
                </h3>
                <p class="text-sm text-grand-tale-secondary-100/60">
                  New to Grand Tale? Start here to learn the basics.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <NuxtLink to="/franchises/grand-tale/wiki/lore/characters" class="group">
          <UCard
            class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div
                class="p-3 bg-grand-tale-primary-500/20 rounded-none border border-grand-tale-secondary-500/30"
              >
                <UIcon name="lucide:users" class="size-6 text-grand-tale-secondary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3
                  class="text-lg font-bold text-white group-hover:text-grand-tale-secondary-400 uppercase"
                >
                  Characters
                </h3>
                <p class="text-sm text-grand-tale-secondary-100/60">
                  Explore the heroes, villains, and legends of the world.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <NuxtLink to="/franchises/grand-tale/wiki/lore/locations" class="group">
          <UCard
            class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div
                class="p-3 bg-grand-tale-primary-500/20 rounded-none border border-grand-tale-secondary-500/30"
              >
                <UIcon name="lucide:map-pin" class="size-6 text-grand-tale-secondary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3
                  class="text-lg font-bold text-white group-hover:text-grand-tale-secondary-400 uppercase"
                >
                  Locations
                </h3>
                <p class="text-sm text-grand-tale-secondary-100/60">
                  Discover the regions, cities, and landmarks.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <NuxtLink to="/franchises/grand-tale/wiki/lore/heroes" class="group">
          <UCard
            class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all h-full"
          >
            <div class="flex items-start gap-4">
              <div
                class="p-3 bg-grand-tale-primary-500/20 rounded-none border border-grand-tale-secondary-500/30"
              >
                <UIcon name="lucide:shield-check" class="size-6 text-grand-tale-secondary-400" />
              </div>
              <div class="space-y-2 flex-1">
                <h3
                  class="text-lg font-bold text-white group-hover:text-grand-tale-secondary-400 uppercase"
                >
                  Heroes
                </h3>
                <p class="text-sm text-grand-tale-secondary-100/60">
                  Master the playable heroes and their abilities.
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </section>

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:flame" class="text-grand-tale-secondary-500" />
        Trending Articles
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NuxtLink v-for="i in 4" :key="i" to="#" class="group">
          <div
            class="p-6 bg-white/5 border border-grand-tale-secondary-800/30 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all flex flex-col items-start gap-3"
          >
            <div class="text-[10px] font-black text-grand-tale-secondary-500 uppercase">Lore</div>
            <div class="text-lg font-bold text-white group-hover:text-grand-tale-secondary-400">
              Featured Article {{ i }}
            </div>
            <div class="text-xs text-grand-tale-secondary-100/40 text-left line-clamp-2">
              A summary of the most important developments in this specific area of interest.
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
