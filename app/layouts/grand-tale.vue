<script lang="ts" setup>
</script>

<template>
  <NuxtLayout name="default">
    <template #franchise-header>
      <ClientOnly>
        <RCHeaderLayer id="franchise-header" :order="3">
          <RLGrandTaleHeader />
        </RCHeaderLayer>
      </ClientOnly>
    </template>

    <template #main>
      <UMain :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-grand-tale-primary-900 min-h-screen">
        <slot />
      </UMain>
    </template>
  </NuxtLayout>
</template>

<style scoped></style>
