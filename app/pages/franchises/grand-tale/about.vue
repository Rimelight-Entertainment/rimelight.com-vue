<script setup lang="ts">
definePageMeta({
  layout: 'grand-tale'
});

useHead({
  title: "About Grand Tale",
});
</script>

<template>
  <div class="py-20">
    <UContainer>
      <div class="max-w-4xl mx-auto space-y-12">
        <div class="space-y-4">
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">About the Vision</h1>
          <div class="h-1 w-20 bg-primary-500" />
        </div>

        <div class="prose prose-invert prose-primary max-w-none">
          <p class="text-xl text-primary-100/80 leading-relaxed">
            Grand Tale began as a dream to create a world where players aren't just participants, but architects of their own legend. 
          </p>
          <p class="text-primary-100/60 leading-relaxed">
            Our team at Rimelight Entertainment has spent years developing the proprietary <i>TaleEngine</i>, designed specifically to handle complex branching narratives and persistent world states at scale.
          </p>
          
          <h2 class="text-2xl font-bold text-white uppercase mt-12 mb-6">Built for Players</h2>
          <p class="text-primary-100/60 leading-relaxed">
            We believe in transparency and community-driven development. Grand Tale is being built in the open, with regular updates and feedback loops with our alpha testers.
          </p>

          <NuxtImg 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop"
            alt="Development team"
            class="w-full aspect-video object-cover rounded-none border border-primary-800/50 my-12"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
