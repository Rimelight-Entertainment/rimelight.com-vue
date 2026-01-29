<script setup lang="ts">
import { useHeaderStack } from "rimelight-components/composables"

const { totalHeight } = useHeaderStack()
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }">
    <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
      <UBanner
        icon="lucide:construction"
        title="This website is currently under construction! You may see placeholder or incomplete content."
        class="bg-accented"
      />
    </RCHeaderLayer>

    <RCHeaderLayer id="global-header" :order="2">
      <RLAppHeader />
    </RCHeaderLayer>

    <UMain class="bg-primary-900"
           :style="{ paddingTop: 'var(--total-header-offset)' }">
      <slot />
    </UMain>

    <LazyRLAppFooter hydrate-on-visible />
  </div>
</template>

<style scoped></style>
