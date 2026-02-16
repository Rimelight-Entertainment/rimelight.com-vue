<script lang="ts" setup>
const route = useRoute();

const links = computed(() => [
  { label: 'Home', to: '/franchises/grand-tale' },
  { label: 'News', to: '/franchises/grand-tale/news' },
  { label: 'About', to: '/franchises/grand-tale/about' },
  { label: 'Wiki', to: '/franchises/grand-tale/wiki' },
  { label: 'Leaderboards', to: '/franchises/grand-tale/leaderboards' }
]);

const rightLinks = computed(() => [
  { label: 'Support', to: '/franchises/grand-tale/support' }
]);

const isSlideoverOpen = ref(false);

const layerId = inject<string>("header_layer_id", "grand-tale-header");
const { bottomOffsets } = useHeaderStack();
</script>

<template>
  <RCHeader class="bg-primary-950/80 backdrop-blur-xl border-b border-primary-800/50 shadow-lg" :contain="false">
    <template #left>
      <div class="flex items-center gap-6 px-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-scroll" class="text-primary-400 size-5" />
          <span class="font-black text-white uppercase tracking-widest text-sm whitespace-nowrap">Grand Tale</span>
        </div>
        <div class="h-4 w-px bg-white/10 mx-2" />
        <UNavigationMenu
          :items="links"
          variant="link"
          :ui="{
            viewportWrapper: 'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)] z-[100]',
            link: 'text-sm font-medium text-gray-400 hover:text-white transition-colors py-0 h-10'
          }"
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[layerId] || 0) - 64}px` }"
        />
      </div>
    </template>

    <template #right>
      <div class="px-4">
        <UNavigationMenu
          :items="rightLinks"
          variant="link"
          :ui="{
            link: 'text-sm font-medium text-gray-400 hover:text-white transition-colors py-0 h-10'
          }"
        />
      </div>
    </template>

    <template #collapsed-left>
      <div class="flex items-center px-4">
        <UButton
          color="neutral"
          icon="lucide:menu"
          variant="ghost"
          @click="isSlideoverOpen = true"
        />
      </div>
    </template>

    <template #collapsed-center>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-scroll" class="text-primary-400 size-4" />
        <span class="font-black text-white uppercase tracking-widest text-xs whitespace-nowrap">Grand Tale</span>
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
              content: 'w-full max-w-[280px] rounded-none'
            }"
          >
            <template #header>
               <div class="flex items-center gap-2">
                <UIcon name="i-lucide-scroll" class="text-primary-400 size-5" />
                <span class="font-black text-white uppercase tracking-widest text-sm">Grand Tale</span>
              </div>
              <UButton
                color="neutral"
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
                    link: 'text-base font-medium text-gray-400 hover:text-white transition-colors px-4 py-3'
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

