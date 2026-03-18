<script setup lang="ts">
definePageMeta({
  layout: "grand-tale"
})

useHead({
  title: "Grand Tale | Latest News"
})

const newsItems = [
  {
    title: "Closed Alpha Phase 2 Begins",
    date: "February 15, 2026",
    category: "Development",
    excerpt:
      "We're excited to announce the start of our second Alpha testing phase, featuring the new 'Shattered Peaks' region.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
  },
  {
    title: "Meet the Heroes: Kaelen the Voidweaver",
    date: "February 10, 2026",
    category: "Lore",
    excerpt:
      "Learn about the tragic history and devastating powers of the first playable hero in Grand Tale.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop"
  },
  {
    title: "Dev Diary: Building a Living World",
    date: "February 05, 2026",
    category: "Dev Diary",
    excerpt:
      "A deep dive into the TaleEngine and how it handles persistent world states across millions of players.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop"
  }
]

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
  <div class="py-20">
    <UContainer>
      <div class="max-w-4xl mx-auto space-y-12">
        <div class="space-y-4">
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            Transmissions
          </h1>
          <div class="h-1 w-20 bg-grand-tale-primary-500" />
        </div>

        <div class="grid grid-cols-1 gap-12">
          <article
            v-for="(item, index) in newsItems"
            :key="index"
            class="group flex flex-col md:flex-row gap-8 items-start border-b border-grand-tale-secondary-800/30 pb-12 last:border-0"
          >
            <div
              class="w-full md:w-1/3 aspect-video bg-grand-tale-primary-900 overflow-hidden border border-grand-tale-secondary-800/50"
            >
              <NuxtImg
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
              />
            </div>
            <div class="flex-1 space-y-4">
              <div class="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                <span class="text-grand-tale-secondary-500">{{ item.category }}</span>
                <span class="text-grand-tale-secondary-100/40">{{ item.date }}</span>
              </div>
              <h2
                class="text-2xl font-bold text-white group-hover:text-grand-tale-secondary-400 transition-colors uppercase leading-tight"
              >
                {{ item.title }}
              </h2>
              <p class="text-grand-tale-secondary-100/60 leading-relaxed line-clamp-3">
                {{ item.excerpt }}
              </p>
              <UButton variant="link" color="grandTaleSecondary" class="p-0"
                >Read Transmission</UButton
              >
            </div>
          </article>
        </div>
      </div>
    </UContainer>
  </div>
</template>
