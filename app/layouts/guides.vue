<script lang="ts" setup>
</script>

<template>
    <NuxtLayout name="grand-tale">
        <UPage class="flex-1">
            <template #left>
                <UPageAside class="bg-grand-tale-primary-800 w-64 border-r border-grand-tale-secondary-500">
                    <RLGuidesSidebar />
                </UPageAside>
            </template>

            <UContainer class="py-12 lg:py-20">
                <slot />
            </UContainer>
        </UPage>
    </NuxtLayout>
</template>

<style scoped></style>
