<script setup lang="ts">
const { t } = useI18n();

const navigationItems = computed(() => [
  [
    {
      label: "Wiki",
      type: "label" as const,
    },
    {
      label: "Getting Started",
      to: "/franchises/grand-tale/wiki/getting-started",
    },
    {
      label: "Contribution Guide",
      to: "/franchises/grand-tale/wiki/contribution-guide",
    },
  ],
  [
    {
      label: "Tales",
      type: "label" as const,
    },
    {
      label: "Chronology",
      to: "/franchises/grand-tale/wiki/tales/chronology",
    },
    {
      label: "World Lore",
      to: "/franchises/grand-tale/wiki/tales/world-lore",
    },
  ],
  [
    {
      label: "Lore",
      type: "label" as const,
    },
    {
      label: "Characters",
      to: "/franchises/grand-tale/wiki/lore/characters",
    },
    {
      label: "Locations",
      to: "/franchises/grand-tale/wiki/lore/locations",
    },
    {
      label: "Species",
      to: "/franchises/grand-tale/wiki/lore/species",
    },
    {
      label: "Items",
      to: "/franchises/grand-tale/wiki/lore/items",
    },
    {
      label: "Objects",
      to: "/franchises/grand-tale/wiki/lore/objects",
    },
    {
      label: "Groups",
      to: "/franchises/grand-tale/wiki/lore/groups",
    },
    {
      label: "Skills",
      to: "/franchises/grand-tale/wiki/lore/skills",
    },
    {
      label: "Heroes",
      to: "/franchises/grand-tale/wiki/lore/heroes",
    },
  ],
  [
    {
      label: "Mechanics & Systems",
      type: "label" as const,
    }
  ],
])

</script>

<template>
  <div class="flex flex-col gap-md px-md">
    <UNavigationMenu
      :items="navigationItems"
      orientation="vertical"
      :ui="{
        label: 'text-white',
        link: 'text-grand-tale-secondary-500',
      }"
      class="w-full"
    />
  </div>
</template>
