<script setup lang="ts">
const { t } = useI18n();

// Navigation items grouped by section
const navigationItems = computed(() => [
  // Getting Started Group
  [
    {
      label: 'Getting Started',
      icon: 'i-lucide-book-open',
      to: '/franchises/grand-tale/wiki/getting-started'
    }
  ],
  // Page Categories Group
  [
    {
      label: 'Characters',
      icon: 'i-lucide-users',
      to: '/franchises/grand-tale/wiki/categories/characters'
    },
    {
      label: 'Locations',
      icon: 'i-lucide-map-pin',
      to: '/franchises/grand-tale/wiki/categories/locations'
    },
    {
      label: 'Species',
      icon: 'i-lucide-dna',
      to: '/franchises/grand-tale/wiki/categories/species'
    },
    {
      label: 'Items',
      icon: 'i-lucide-sword',
      to: '/franchises/grand-tale/wiki/categories/items'
    },
    {
      label: 'Skills',
      icon: 'i-lucide-sparkles',
      to: '/franchises/grand-tale/wiki/categories/skills'
    },
    {
      label: 'Heroes',
      icon: 'i-lucide-shield-check',
      to: '/franchises/grand-tale/wiki/categories/heroes'
    }
  ]
]);
</script>

<template>
  <aside class="space-y-8">
    <div class="space-y-4">
      <h2 class="text-xs font-bold uppercase tracking-widest text-primary-500 px-4">Wiki Explorer</h2>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        variant="link"
        class="w-full"
        :ui="{
          link: 'text-sm font-medium text-primary-100/60 hover:text-white transition-colors px-4 py-2'
        }"
      />
    </div>

    <!-- Stats or Contribution Info -->
    <div class="px-4 py-6 bg-primary-900/50 border border-primary-800/50 rounded-none space-y-4">
      <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Wiki Stats</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-lg font-bold text-white">1,248</div>
          <div class="text-[9px] text-primary-100/40 uppercase font-bold">Articles</div>
        </div>
        <div>
          <div class="text-lg font-bold text-white">52</div>
          <div class="text-[9px] text-primary-100/40 uppercase font-bold">Contributors</div>
        </div>
      </div>
      <UButton block size="xs" color="primary" variant="outline" icon="i-lucide-plus" class="text-[10px] font-bold">Contribute</UButton>
    </div>
  </aside>
</template>
