<script lang="ts" setup>
</script>

<template>
    <NuxtLayout name="grand-tale">
        <UPage class="flex-1">
            <template #left>
                <UPageAside class="bg-neutral-800 w-64 border-none">
                    <RLWikiSidebar />
                </UPageAside>
            </template>

            <UContainer class="py-12 lg:py-20">
                <slot />
            </UContainer>
        </UPage>
    </NuxtLayout>
</template>

<style scoped></style>
