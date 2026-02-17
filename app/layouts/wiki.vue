<script lang="ts" setup>
const { totalHeight } = useHeaderStack();
</script>

<template>
    <div :style="{ '--total-header-offset': `${totalHeight}px` }" class="min-h-screen bg-primary-900 flex flex-col">
        <ClientOnly>
            <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
                <UBanner class="bg-accented" icon="lucide:construction"
                    title="Grand Tale is currently in development! Some pages may be incomplete." closable />
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

        <UPage :style="{ paddingTop: 'var(--total-header-offset)' }" class="flex-1">
            <template #left>
                <UPageAside class="bg-neutral-800 w-64 border-none">
                    <RLWikiSidebar />
                </UPageAside>
            </template>

            <UContainer class="py-12 lg:py-20">
                <slot />
            </UContainer>
        </UPage>

        <RLAppFooter />
    </div>
</template>

<style scoped></style>
