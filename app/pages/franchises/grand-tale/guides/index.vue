<script setup lang="ts">
definePageMeta({
  layout: "guides"
})

useHead({
  title: "Guides | Grand Tale"
})

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
  <div class="space-y-16">
    <!-- Header -->
    <section class="space-y-6 max-w-4xl">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 text-grand-tale-secondary-400 text-xs font-bold uppercase tracking-widest"
      >
        Game Guides
      </div>
      <h1 class="text-7xl font-black uppercase tracking-tighter text-white leading-none">
        Master the <span class="text-grand-tale-secondary-500 text-shadow-glow">Soulstream</span>
      </h1>
      <p class="text-2xl text-grand-tale-secondary-100/60 font-light leading-relaxed">
        Welcome to the ultimate guide hub for Grand Tale. Whether you're a new traveler or a
        seasoned hero, our community-curated guides will help you navigate the mysteries of
        Aethelgard.
      </p>
    </section>

    <hr class="border-grand-tale-secondary-800/30" />

    <!-- Categories -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <UCard
        class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all group"
      >
        <div class="space-y-6">
          <div
            class="size-16 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 flex items-center justify-center"
          >
            <UIcon name="lucide:graduation-cap" class="size-8 text-grand-tale-secondary-500" />
          </div>
          <div class="space-y-2">
            <h2
              class="text-2xl font-bold text-white uppercase tracking-tight group-hover:text-grand-tale-secondary-400"
            >
              New Player Experience
            </h2>
            <p class="text-grand-tale-secondary-100/60 leading-relaxed">
              Master the basics of combat, exploration, and the Soulstone system.
            </p>
          </div>
          <UButton
            variant="link"
            color="grandTaleSecondary"
            icon="lucide:arrow-right"
            trailing
            class="px-0 font-black uppercase tracking-widest text-xs"
            >Explore Basics</UButton
          >
        </div>
      </UCard>

      <UCard
        class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all group"
      >
        <div class="space-y-6">
          <div
            class="size-16 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 flex items-center justify-center"
          >
            <UIcon name="lucide:swords" class="size-8 text-grand-tale-secondary-500" />
          </div>
          <div class="space-y-2">
            <h2
              class="text-2xl font-bold text-white uppercase tracking-tight group-hover:text-grand-tale-secondary-400"
            >
              Hero Builds
            </h2>
            <p class="text-grand-tale-secondary-100/60 leading-relaxed">
              In-depth analysis of hero abilities and optimal equipment synergies.
            </p>
          </div>
          <UButton
            variant="link"
            color="grandTaleSecondary"
            icon="lucide:arrow-right"
            trailing
            class="px-0 font-black uppercase tracking-widest text-xs"
            >View Builds</UButton
          >
        </div>
      </UCard>

      <UCard
        class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50 hover:bg-grand-tale-primary-500/5 hover:border-grand-tale-secondary-500/50 transition-all group"
      >
        <div class="space-y-6">
          <div
            class="size-16 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 flex items-center justify-center"
          >
            <UIcon name="lucide:crown" class="size-8 text-grand-tale-secondary-500" />
          </div>
          <div class="space-y-2">
            <h2
              class="text-2xl font-bold text-white uppercase tracking-tight group-hover:text-grand-tale-secondary-400"
            >
              Endgame Strategies
            </h2>
            <p class="text-grand-tale-secondary-100/60 leading-relaxed">
              Advanced tactics for raids, world bosses, and high-level competitive play.
            </p>
          </div>
          <UButton
            variant="link"
            color="grandTaleSecondary"
            icon="lucide:arrow-right"
            trailing
            class="px-0 font-black uppercase tracking-widest text-xs"
            >Master Endgame</UButton
          >
        </div>
      </UCard>
    </div>

    <!-- Featured Guides -->
    <section class="space-y-8">
      <h3 class="text-3xl font-black uppercase tracking-tighter text-white">
        Latest Community Guides
      </h3>
      <div class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="p-6 bg-grand-tale-primary-800/10 border border-grand-tale-secondary-800/30 flex items-center justify-between group hover:border-grand-tale-secondary-500/50 transition-colors"
        >
          <div class="flex items-center gap-6">
            <div class="text-grand-tale-secondary-500/50 font-black text-2xl tabular-nums">
              0{{ i }}
            </div>
            <div>
              <h4
                class="text-xl font-bold text-white group-hover:text-grand-tale-secondary-400 uppercase transition-colors"
              >
                Advanced Elemental Syncing in Void Raids
              </h4>
              <p class="text-sm text-grand-tale-secondary-100/40">
                Posted by SoulScribe • 2 hours ago
              </p>
            </div>
          </div>
          <UIcon
            name="lucide:chevron-right"
            class="size-6 text-grand-tale-secondary-800 group-hover:text-grand-tale-secondary-500 transition-colors"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-shadow-glow {
  text-shadow: 0 0 20px rgba(var(--color-grand-tale-secondary-500), 0.4);
}
</style>
