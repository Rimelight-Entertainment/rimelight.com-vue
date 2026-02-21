<script lang="ts" setup>
const route = useRoute();

const links = computed(() => [
  { label: "Home", to: "/franchises/grand-tale" },
  { label: "News", to: "/franchises/grand-tale/news" },
  { label: "About", to: "/franchises/grand-tale/about" },
  { label: "Wiki", to: "/franchises/grand-tale/wiki" },
  { label: "Guides", to: "/franchises/grand-tale/guides" },
  { label: "Leaderboards", to: "/franchises/grand-tale/leaderboards" },
]);

const rightLinks = computed(() => [{ label: "Support", to: "/franchises/grand-tale/support" }]);

const isSlideoverOpen = ref(false);

const layerId = inject<string>("header_layer_id", "grand-tale-header");
const { bottomOffsets } = useHeaderStack();

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
  <RCHeader
    class="bg-grand-tale-primary-700 border-b border-grand-tale-secondary-400 shadow-lg"
    :contain="false"
  >
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <div class="flex items-center gap-2">
          <UIcon name="lucide:scroll" class="text-grand-tale-secondary-400 size-5" />
          <span class="font-black text-white uppercase tracking-widest text-sm whitespace-nowrap"
            >Grand Tale</span
          >
        </div>
        <div class="h-4 w-px bg-white/10" />
        <UNavigationMenu
          :items="links"
          variant="link"
          :ui="{
            viewportWrapper:
              'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)] z-[100]',
            link: 'text-sm font-medium text-grand-tale-secondary-400 hover:text-white',
          }"
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[layerId] || 0) - 64}px` }"
        />
      </div>
    </template>

    <template #right>
      <div class="flex flex-row items-center gap-md">
        <UNavigationMenu
          :items="rightLinks"
          variant="link"
          :ui="{
            link: 'text-sm font-medium text-grand-tale-secondary-500 hover:text-white transition-colors py-0 h-10',
          }"
        />
        <UButton
          variant="solid"
          label="Play Now"
          class="bg-grand-tale-secondary-400 text-white hover:bg-grand-tale-secondary-600"
        />
      </div>
    </template>

    <template #collapsed-left>
      <div class="flex items-center px-4">
        <UButton
          color="grandTaleSecondary"
          icon="lucide:menu"
          variant="ghost"
          @click="isSlideoverOpen = true"
        />
      </div>
    </template>

    <template #collapsed-center>
      <div class="flex items-center gap-2">
        <UIcon name="lucide:scroll" class="text-grand-tale-secondary-400 size-4" />
        <span class="font-black text-white uppercase tracking-widest text-xs whitespace-nowrap"
          >Grand Tale</span
        >
      </div>
    </template>

    <template #collapsed-right>
      <div class="flex items-center px-4 justify-end">
        <ClientOnly>
          <USlideover
            v-model:open="isSlideoverOpen"
            title="Grand Tale"
            :ui="{
              header: 'flex items-center justify-between',
              content: 'w-full max-w-[280px] rounded-none',
            }"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="lucide:scroll" class="text-grand-tale-secondary-400 size-5" />
                <span class="font-black text-white uppercase tracking-widest text-sm"
                  >Grand Tale</span
                >
              </div>
              <UButton
                color="grandTaleSecondary"
                icon="lucide:x"
                variant="ghost"
                @click="isSlideoverOpen = false"
              />
            </template>
            <template #body>
              <div class="flex flex-col gap-4">
                <UNavigationMenu
                  :items="[...links, ...rightLinks]"
                  orientation="vertical"
                  variant="link"
                  class="w-full"
                  :ui="{
                    link: 'text-base font-medium text-grand-tale-secondary-500 hover:text-white transition-colors px-4 py-3',
                  }"
                  @click="isSlideoverOpen = false"
                />
              </div>
            </template>
          </USlideover>
        </ClientOnly>
      </div>
    </template>
  </RCHeader>
</template>
