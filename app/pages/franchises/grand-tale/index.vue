<script setup lang="ts">
definePageMeta({
  layout: 'grand-tale'
});

useHead({
  title: "Grand Tale | Home",
});

useSeoMeta({
  title: "Grand Tale - An Epic RPG Journey",
  description: "Experience Grand Tale, an epic journey through a shattered world where every choice resonates through eternity.",
});
</script>

<template>
  <div>
    <!-- Hero Section for Grand Tale -->
    <section class="relative min-h-[60vh] flex items-center overflow-hidden border-b border-primary-800/30">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-primary-950/50 via-primary-950 to-primary-900" />
        <NuxtImg 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
          alt="Grand Tale Hero"
          class="w-full h-full object-cover opacity-30 mix-blend-overlay"
          loading="eager"
        />
      </div>

      <UContainer class="relative z-10 py-20">
        <div class="max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
            Now in Closed Alpha
          </div>
          <h1 class="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Your Story <br /> <span class="text-primary-500">Unwritten</span>
          </h1>
          <p class="text-xl text-primary-100/70 max-w-xl font-light leading-relaxed">
            Grand Tale is the next generation open-world RPG from Rimelight Entertainment. Explore a living world shaped by player agency and emergent storytelling.
          </p>
          <div class="flex gap-4 pt-4">
            <UButton size="xl" color="primary" class="font-bold px-8">Play Now</UButton>
            <UButton size="xl" variant="outline" class="font-bold px-8">Watch Trailer</UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Content Sections -->
    <section class="py-20">
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard v-for="i in 3" :key="i" class="bg-primary-800/20 border-primary-700/50 hover:border-primary-500/50 transition-colors">
            <template #header>
              <h3 class="text-xl font-bold text-white uppercase">Feature {{ i }}</h3>
            </template>
            <p class="text-primary-100/60">
              Discover the deep mechanics and rich lore that make Grand Tale a unique experience in the RPG landscape.
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>
  </div>
</template>
