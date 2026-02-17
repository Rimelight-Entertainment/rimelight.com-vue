<script lang="ts" setup>
</script>

<template>
  <NuxtLayout name="default">
    <template #banner>
      <ClientOnly>
        <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
          <UBanner icon="lucide:construction"
            title="Grand Tale is currently in development! Some pages may be incomplete." closable
            :ui="{ title: 'text-white' }" class="bg-primary-500" />
        </RCHeaderLayer>
      </ClientOnly>
    </template>

    <template #franchise-header>
      <ClientOnly>
        <RCHeaderLayer id="franchise-header" :order="3">
          <RLGrandTaleHeader />
        </RCHeaderLayer>
      </ClientOnly>
    </template>

    <template #main>
      <UMain :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-primary-900 min-h-screen">
        <slot />
      </UMain>
    </template>
  </NuxtLayout>
</template>

<style scoped></style>
