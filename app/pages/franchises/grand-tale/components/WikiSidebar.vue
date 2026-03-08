<script setup lang="ts">
const { t } = useI18n();

const isPageTreeModalOpen = ref(false);
const isFetchingTree = ref(false);
const treePages = ref<any[]>([]);

const handleOpenTree = async () => {
  isFetchingTree.value = true;
  try {
    const data = await $api("/api/pages/list", {
      query: {
        select: "title,slug,type,id",
        prefix: "franchises/grand-tale/wiki",
      },
    });
    treePages.value = data;
    isPageTreeModalOpen.value = true;
  } catch (e) {
    console.error("Failed to fetch pages for tree", e);
  } finally {
    isFetchingTree.value = false;
  }
};

const handleTreeNavigate = (slug: string) => {
  navigateTo(`/${slug}`);
};

const navigationItems = computed(() => [
  [
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.wiki"),
      type: "label" as const,
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.getting_started"),
      to: "/franchises/grand-tale/wiki/getting-started",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.contribution_guide"),
      to: "/franchises/grand-tale/wiki/contribution-guide",
    },
  ],
  [
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.title"),
      type: "label" as const,
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.timeline"),
      to: "/franchises/grand-tale/wiki/lore/timeline",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.characters"),
      to: "/franchises/grand-tale/wiki/lore/characters",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.locations"),
      to: "/franchises/grand-tale/wiki/lore/locations",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.species"),
      to: "/franchises/grand-tale/wiki/lore/species",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.objects"),
      to: "/franchises/grand-tale/wiki/lore/objects",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.lore.groups"),
      to: "/franchises/grand-tale/wiki/lore/groups",
    },
  ],
  [
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.game.title"),
      type: "label" as const,
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.title"),
      to: "/franchises/grand-tale/wiki/game/tales",
      children: [
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_mmo.title"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-mmo",
          children: [
            {
              label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_mmo.heroes"),
              to: "/franchises/grand-tale/wiki/game/tales/tale-mmo/heroes",
            },
          ],
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_moba"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-moba",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_ccg.title"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-ccg",
          children: [
            {
              label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_ccg.cards"),
              to: "/franchises/grand-tale/wiki/game/tales/tale-ccg/cards",
            },
          ],
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_rts"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-rts",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_platform"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-platform",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_chess"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-chess",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.tales.tale_td"),
          to: "/franchises/grand-tale/wiki/game/tales/tale-td",
        },
      ],
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.game.items"),
      to: "/franchises/grand-tale/wiki/game/items",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.game.quests.title"),
      to: "/franchises/grand-tale/wiki/game/quests",
      children: [
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.quests.character_quest"),
          to: "/franchises/grand-tale/wiki/game/quests/character-quest",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.quests.growth_quest"),
          to: "/franchises/grand-tale/wiki/game/quests/growth-quest",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.quests.guide_quest"),
          to: "/franchises/grand-tale/wiki/game/quests/guide-quest",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.quests.relationship_quest"),
          to: "/franchises/grand-tale/wiki/game/quests/relationship-quest",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.quests.story_quest"),
          to: "/franchises/grand-tale/wiki/game/quests/story-quest",
        },
      ],
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.title"),
      to: "/franchises/grand-tale/wiki/game/skills",
      children: [
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.alchemy"),
          to: "/franchises/grand-tale/wiki/game/skills/alchemy",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.archaeology"),
          to: "/franchises/grand-tale/wiki/game/skills/archaeology",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.artistry"),
          to: "/franchises/grand-tale/wiki/game/skills/artistry",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.crafting"),
          to: "/franchises/grand-tale/wiki/game/skills/crafting",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.cultivation"),
          to: "/franchises/grand-tale/wiki/game/skills/cultivation",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.foraging"),
          to: "/franchises/grand-tale/wiki/game/skills/foraging",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.runology"),
          to: "/franchises/grand-tale/wiki/game/skills/runology",
        },
        {
          label: t("pages.franchises.grandTale.wiki.sidebar.game.skills.seafaring"),
          to: "/franchises/grand-tale/wiki/game/skills/seafaring",
        },
      ],
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.game.settings"),
      to: "/franchises/grand-tale/wiki/game/settings",
    },
  ],
  [
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.series.title"),
      type: "label" as const,
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.series.children_of_the_light"),
      to: "/franchises/grand-tale/wiki/series/children-of-the-light",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.series.grand_academy"),
      to: "/franchises/grand-tale/wiki/series/grand-academy",
    },
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.series.goldy_adventures"),
      to: "/franchises/grand-tale/wiki/series/goldy-adventures",
    },
  ],
  [
    {
      label: t("pages.franchises.grandTale.wiki.sidebar.mechanics_systems"),
      type: "label" as const,
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
    <div class="px-2.5 pb-2 border-b border-grand-tale-secondary-800/30">
      <UButton
        icon="lucide:list-tree"
        label="View Page Hierarchy"
        variant="ghost"
        color="neutral"
        size="xs"
        block
        :loading="isFetchingTree"
        class="justify-start text-grand-tale-secondary-400 hover:text-grand-tale-secondary-200"
        @click="handleOpenTree"
      />
    </div>
    <UNavigationMenu
      :items="navigationItems"
      orientation="vertical"
      :ui="{
        label:
          'text-white px-2.5 py-1.5 mt-2 font-bold uppercase text-[10px] tracking-widest opacity-60',
        link: [
          'text-grand-tale-secondary-400 px-2.5 py-1.5 transition-all duration-200',
          'hover:text-white hover:before:bg-grand-tale-secondary-400',
          'aria-[current]:text-white aria-[current]:before:bg-grand-tale-secondary-400',
        ],
        separator: 'bg-grand-tale-secondary-300',
      }"
      class="w-full"
    />
  </div>

  <RCPageTreeModal
    v-model:open="isPageTreeModalOpen"
    :pages="treePages"
    base-path="franchises/grand-tale/wiki"
    :loading="isFetchingTree"
    @navigate="handleTreeNavigate"
  />
</template>
