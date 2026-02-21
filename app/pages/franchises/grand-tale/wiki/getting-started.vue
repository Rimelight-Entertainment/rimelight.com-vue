<script setup lang="ts">
definePageMeta({
  layout: "wiki",
});

useHead({
  title: "Getting Started | Grand Tale Wiki",
});
</script>

<template>
  <div class="space-y-16">
    <section class="space-y-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 text-grand-tale-secondary-400 text-xs font-bold uppercase tracking-widest"
      >
        Getting Started
      </div>
      <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">
        Welcome to <br />
        <span class="text-grand-tale-secondary-500">Grand Tale</span>
      </h1>
      <p class="text-xl text-grand-tale-secondary-100/60 font-light max-w-2xl leading-relaxed">
        Your comprehensive guide to understanding the world, mechanics, and lore of Grand Tale.
        Start here if you're new to the game.
      </p>
    </section>

    <hr class="border-grand-tale-secondary-800/30" />

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:book-open" class="text-grand-tale-secondary-500" />
        New Players
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UCard class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Combat Basics</h3>
          </template>
          <p class="text-grand-tale-secondary-100/60 text-sm leading-relaxed mb-4">
            Learn the fundamentals of combat, including weapon types, skill rotations, and defensive
            mechanics.
          </p>
          <UButton variant="link" color="grandTaleSecondary" class="p-0">Read Guide</UButton>
        </UCard>

        <UCard class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Soul Resonance</h3>
          </template>
          <p class="text-grand-tale-secondary-100/60 text-sm leading-relaxed mb-4">
            Understand the core mechanic that powers your abilities and connects you to the world.
          </p>
          <UButton variant="link" color="grandTaleSecondary" class="p-0">Read Guide</UButton>
        </UCard>

        <UCard class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">World Navigation</h3>
          </template>
          <p class="text-grand-tale-secondary-100/60 text-sm leading-relaxed mb-4">
            Master fast travel, waypoints, and exploration mechanics to traverse the shattered
            world.
          </p>
          <UButton variant="link" color="grandTaleSecondary" class="p-0">Read Guide</UButton>
        </UCard>

        <UCard class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50">
          <template #header>
            <h3 class="text-lg font-bold text-white uppercase">Character Creation</h3>
          </template>
          <p class="text-grand-tale-secondary-100/60 text-sm leading-relaxed mb-4">
            Choose your origin, customize your appearance, and understand starting stats.
          </p>
          <UButton variant="link" color="grandTaleSecondary" class="p-0">Read Guide</UButton>
        </UCard>
      </div>
    </section>

    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
        <UIcon name="lucide:scroll-text" class="text-grand-tale-secondary-500" />
        Lore Seekers
      </h2>

      <div class="space-y-4">
        <p class="text-grand-tale-secondary-100/60 leading-relaxed">
          Dive into the chronology of the Cataclysm and the rise of the Nine Factions. The world of
          Grand Tale is rich with history, mysteries, and interconnected storylines.
        </p>
        <div class="flex gap-4">
          <UButton color="grandTaleSecondary" variant="outline">Timeline of Events</UButton>
          <UButton color="grandTaleSecondary" variant="outline">The Nine Factions</UButton>
        </div>
      </div>

      <UCard class="bg-grand-tale-primary-800/10 border-grand-tale-secondary-800/50">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div
            class="p-4 bg-grand-tale-primary-500/20 rounded-none border border-grand-tale-secondary-500/30"
          >
            <UIcon name="lucide:info" class="size-8 text-grand-tale-secondary-400" />
          </div>
          <div class="space-y-2">
            <h4 class="font-bold text-white uppercase">Alpha Notice</h4>
            <p class="text-sm text-grand-tale-secondary-100/40">
              Many articles are currently being drafted by the development team. If you encounter
              missing information or placeholder images, please report it via the Support portal.
            </p>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
