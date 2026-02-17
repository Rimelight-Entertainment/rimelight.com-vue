<script setup lang="ts">
const { t } = useI18n();

// Navigation items grouped by section
const navigationItems = computed(() => [
  [
    {
      label: 'Wiki Explorer',
      type: 'label' as const
    },
    {
      label: 'Getting Started',
      to: '/franchises/grand-tale/wiki/getting-started'
    },
    {
      label: 'Contribution Guide',
      to: '/franchises/grand-tale/wiki/contribution-guide'
    }
  ],
  [
    {
      label: 'Tales',
      type: 'label' as const
    },
    {
      label: 'Chronology',
      to: '/franchises/grand-tale/wiki/tales/chronology'
    },
    {
      label: 'World Lore',
      to: '/franchises/grand-tale/wiki/tales/world-lore'
    }
  ],
  [
    {
      label: 'Lore',
      type: 'label' as const
    },
    {
      label: 'Characters',
      to: '/franchises/grand-tale/wiki/lore/characters'
    },
    {
      label: 'Locations',
      to: '/franchises/grand-tale/wiki/lore/locations'
    },
    {
      label: 'Species',
      to: '/franchises/grand-tale/wiki/lore/species'
    },
    {
      label: 'Items',
      to: '/franchises/grand-tale/wiki/lore/items'
    },
    {
      label: 'Skills',
      to: '/franchises/grand-tale/wiki/lore/skills'
    },
    {
      label: 'Heroes',
      to: '/franchises/grand-tale/wiki/lore/heroes'
    }
  ],
  [
    {
      label: 'Mechanics & Systems',
      type: 'label' as const
    },
    {
      label: 'Combat Fundamentals',
      to: '/franchises/grand-tale/wiki/mechanics/combat'
    },
    {
      label: 'Soulstone Resonance',
      to: '/franchises/grand-tale/wiki/mechanics/soulstone'
    },
    {
      label: 'Damage Formulas',
      to: '/franchises/grand-tale/wiki/mechanics/damage'
    }
  ],
  [
    {
      label: 'Community',
      type: 'label' as const
    },
    {
      label: 'Contribute',
      to: '#'
    }
  ]
]);
</script>

<template>
  <div class="space-y-8 p-md">
    <UNavigationMenu :items="navigationItems" orientation="vertical" :ui="{
      label: 'text-[10px] font-black uppercase tracking-[0.1em]',
      link: 'text-[11px] text-dimmed py-1'
    }" class="w-full" />

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
    </div>
  </div>
</template>
