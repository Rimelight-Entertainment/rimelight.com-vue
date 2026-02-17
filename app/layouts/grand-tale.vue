<script lang="ts" setup>
const { totalHeight } = useHeaderStack();
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }">
    <ClientOnly>
      <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
        <UBanner icon="lucide:construction"
          title="Grand Tale is currently in development! Some pages may be incomplete." closable :ui="{ title: 'text-white' }" class="bg-primary-500"/>
      </RCHeaderLayer>
    </ClientOnly>

    <ClientOnly>
      <RCHeaderLayer id="global-header" :order="2">
        <RLAppHeader />
      </RCHeaderLayer>
    </ClientOnly>

    <ClientOnly>
      <RCHeaderLayer id="franchise-header" :order="3">
        <RLGrandTaleHeader />
      </RCHeaderLayer>
    </ClientOnly>

    <UMain :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-primary-900 min-h-screen">
      <slot />
    </UMain>

    <RLAppFooter />
  </div>
</template>

<style scoped></style>
