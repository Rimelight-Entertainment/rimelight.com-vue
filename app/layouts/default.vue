<script lang="ts" setup>
const {totalHeight} = useHeaderStack();
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }">
    <ClientOnly>
      <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
        <UBanner :ui="{ title: 'text-white' }"
                 class="bg-primary-500"
                 icon="lucide:construction"
                 title="This website is currently under construction! You may see placeholder or incomplete content."/>
      </RCHeaderLayer>
    </ClientOnly>

    <ClientOnly>
      <RCHeaderLayer id="global-header" :order="2">
        <RLAppHeader/>
      </RCHeaderLayer>
    </ClientOnly>

    <UMain :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-white">
      <slot/>
    </UMain>

    <RLAppFooter/>
  </div>
</template>

<style scoped></style>
