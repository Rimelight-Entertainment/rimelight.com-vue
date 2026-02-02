<script lang="ts" setup>
import {useHeaderStack} from "rimelight-components/composables"

const {totalHeight} = useHeaderStack()
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }">
    <ClientOnly>
      <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
        <UBanner
          class="bg-accented"
          icon="lucide:construction"
          title="This website is currently under construction! You may see placeholder or incomplete content."
        />
      </RCHeaderLayer>
    </ClientOnly>

    <ClientOnly>
      <RCHeaderLayer id="global-header" :order="2">
        <RLAppHeader />
      </RCHeaderLayer>
    </ClientOnly>

    <UMain :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-primary-900">
      <slot />
    </UMain>

    <LazyRLAppFooter hydrate-on-visible />
  </div>
</template>

<style scoped></style>
