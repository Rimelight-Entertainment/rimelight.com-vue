<script lang="ts" setup>
const { totalHeight } = useHeaderStack();
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }">
    <slot name="banner">
      <ClientOnly>
        <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
          <UBanner
            :ui="{ icon: 'text-white', title: 'text-white' }"
            class="bg-primary-500"
            icon="lucide:construction"
            title="This website is currently under development. You may see placeholder or incomplete content."
          />
        </RCHeaderLayer>
      </ClientOnly>
    </slot>

    <slot name="header">
      <ClientOnly>
        <RCHeaderLayer id="global-header" :order="2">
          <RLAppHeader />
        </RCHeaderLayer>
      </ClientOnly>
    </slot>

    <slot name="franchise-header" />

    <slot name="main">
      <UMain :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-white">
        <slot />
      </UMain>
    </slot>

    <slot name="footer">
      <RLAppFooter />
    </slot>
  </div>
</template>

<style scoped></style>
