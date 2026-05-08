<script setup lang="ts">
/* region Props */
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

/* region State */
const { t } = useI18n();
const layerId = inject<string>("header_layer_id", "store-header");
const { bottomOffsets } = useHeaderStack();

const links = computed(() => [
  { label: "Home", to: "/franchises/grand-tale" },
  { label: "News", to: "/franchises/grand-tale/news" },
  { label: "About", to: "/franchises/grand-tale/about" },
  { label: "Wiki", to: "/franchises/grand-tale/wiki" },
  { label: "Guides", to: "/franchises/grand-tale/guides" },
  { label: "Forums", to: "/franchises/grand-tale/forums" },
  { label: "Leaderboards", to: "/franchises/grand-tale/leaderboards" },
]);
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <RLHeader :contain="false" class="bg-white border-b border-black">
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <UButton
          variant="link"
          :label="t('pages.store.meta.title')"
          to="/store"
          class="text-sm font-black tracking-widest uppercase text-black hover:text-primary-500"
        />
        <UNavigationMenu
          :items="links"
          variant="link"
          :ui="{
            viewportWrapper:
              'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)] z-[100]',
            link: 'text-sm font-medium text-black hover:text-primary-500',
          }"
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[layerId] || 0) - 64}px` }"
        />
      </div>
    </template>

    <template #right>
      <div class="flex flex-row items-center gap-xs">
        <UButton
          variant="ghost"
          icon="lucide:shopping-cart"
          :label="t('pages.store.header.cart')"
          class="snipcart-checkout text-black transition-colors duration-200 hover:text-primary-500"
        />
        <UButton
          class="text-black hover:bg-neutral-200"
          color="neutral"
          icon="lucide:shopping-bag"
          :label="t('app.header.links.store.content.side.orders')"
          to="/store/orders"
          variant="ghost"
        />
        <UButton
          class="text-black hover:bg-neutral-200"
          color="neutral"
          icon="lucide:headset"
          :label="t('app.header.links.store.content.side.customer_support')"
          to="/franchises/grand-tale/support"
          variant="ghost"
        />
      </div>
    </template>

    <template #collapsed-right>
      <div class="flex flex-row items-center gap-sm">
        <ClientOnly>
          <UButton
            variant="ghost"
            icon="lucide:shopping-cart"
            :label="t('pages.store.header.cart')"
            class="snipcart-checkout text-black transition-colors duration-200 hover:text-primary-500"
          />
        </ClientOnly>
        <UButton
          class="text-black hover:bg-neutral-200"
          color="neutral"
          icon="lucide:shopping-bag"
          :label="t('app.header.links.store.content.side.orders')"
          to="/store/orders"
          variant="ghost"
        />
        <UButton
          class="text-black hover:bg-neutral-200"
          color="neutral"
          icon="lucide:headset"
          :label="t('app.header.links.store.content.side.customer_support')"
          to="/franchises/grand-tale/support"
          variant="ghost"
        />
      </div>
    </template>
  </RLHeader>
</template>
