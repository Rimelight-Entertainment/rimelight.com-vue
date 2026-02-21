<script setup lang="ts">
const { t } = useI18n();

// Navigation items for Guides
const navigationItems = computed(() => [
  [
    {
      label: "Guides Explorer",
      type: "label" as const,
    },
    {
      label: "Featured Guides",
      to: "/franchises/grand-tale/guides",
    },
  ],
  [
    {
      label: "Categories",
      type: "label" as const,
    },
    {
      label: "New Players",
      to: "/franchises/grand-tale/guides/getting-started",
    },
    {
      label: "Hero Builds",
      to: "/franchises/grand-tale/guides/builds",
    },
    {
      label: "Endgame Content",
      to: "/franchises/grand-tale/guides/endgame",
    },
    {
      label: "Resources & Crafting",
      to: "/franchises/grand-tale/guides/crafting",
    },
  ],
  [
    {
      label: "Media",
      type: "label" as const,
    },
    {
      label: "Video Guides",
      to: "/franchises/grand-tale/guides/videos",
    },
  ],
  [
    {
      label: "Tools",
      type: "label" as const,
    },
    {
      label: "Build Planners",
      to: "/franchises/grand-tale/guides/build-planners",
    },
    {
      label: "Calculators",
      to: "/franchises/grand-tale/guides/calculators",
    },
  ],
]);

/* region Props */
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

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
