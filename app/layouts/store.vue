<script lang="ts" setup>
const { totalHeight } = useHeaderStack()
</script>

<template>
  <NuxtLayout name="default">
    <template #franchise-header>
      <ClientOnly>
        <RCHeaderLayer id="store-header" :order="3">
          <RLStoreHeader />
        </RCHeaderLayer>
      </ClientOnly>
    </template>

    <template #main>
      <UMain
        :style="{ paddingTop: 'var(--total-header-offset)' }"
        class="bg-white min-h-screen flex flex-col"
      >
        <UPage class="flex-1">
          <template #left>
            <UPageAside class="hidden lg:block w-64 border-r bg-white border-black">
              <RLStoreSidebar />
            </UPageAside>
          </template>

          <UPageBody>
            <slot />
          </UPageBody>
        </UPage>
      </UMain>
    </template>

    <div
      id="snipcart"
      hidden
      data-api-key="MzQyMzlhNmItNjY2ZS00N2Y0LWE0YTYtNmRjZWVjYWJmMmQ4NjM5MDczNzgzOTYzNDc4NzUy"
    ></div>
  </NuxtLayout>
</template>

<style scoped></style>
