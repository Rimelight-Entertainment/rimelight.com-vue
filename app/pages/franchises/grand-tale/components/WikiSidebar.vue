<script setup lang="ts">
const { t } = useI18n();

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
      label: 'Objects',
      to: '/franchises/grand-tale/wiki/lore/objects'
    },
    {
      label: 'Groups',
      to: '/franchises/grand-tale/wiki/lore/groups'
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
const { data: articleCount } = await useApi<number>(() => '/api/pages/count', {
  query: { slugPrefix: 'franchises/grand-tale/wiki' }
});
</script>

<template>
  <div class="flex flex-col gap-md px-md">
    <UNavigationMenu :items="navigationItems" orientation="vertical" :ui="{
      label: 'text-white',
      link: 'text-grand-tale-secondary-500',
    }" class="w-full" />

    <!-- Stats or Contribution Info -->
    <UCard class="bg-grand-tale-priamry-900 border-grand-tale-secondary-500">
      <h3 class="text-sm uppercase text-grand-tale-secondary-500">Wiki Stats</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-lg font-bold text-white">{{ articleCount?.toLocaleString() ?? 0 }}</div>
          <div class="text-[9px] text-grand-tale-secondary-100/40 uppercase font-bold">Articles</div>
        </div>
        <div>
          <div class="text-lg font-bold text-white">52</div>
          <div class="text-[9px] text-grand-tale-secondary-100/40 uppercase font-bold">Contributors</div>
        </div>
      </div>
    </UCard>
  </div>
</template>
