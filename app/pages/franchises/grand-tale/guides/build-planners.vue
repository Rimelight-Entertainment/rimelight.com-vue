<script setup lang="ts">
definePageMeta({
    layout: 'guides'
});

useHead({
    title: "Build Planners | Grand Tale Guides",
});
</script>

<template>
    <div class="space-y-16">
        <section class="space-y-6">
            <div
                class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
                Tools
            </div>
            <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">Build <br /> <span
                    class="text-primary-500">Planners</span></h1>
            <p class="text-xl text-primary-100/60 font-light max-w-2xl leading-relaxed">
                Optimize your hero's potential. Experiment with ability points, gear synergy, and resonance effects
                before committing your resources in-game.
            </p>
        </section>

        <hr class="border-primary-800/30" />

        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UCard class="bg-primary-800/10 border-primary-800/50">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UIcon name="i-lucide-user-plus" class="text-primary-500 size-6" />
                        <h3 class="text-lg font-bold text-white uppercase">New Draft</h3>
                    </div>
                </template>
                <p class="text-primary-100/60 text-sm mb-6">
                    Start from scratch with a Level 1 hero and map out their entire progression path to Level 100.
                </p>
                <UButton color="primary" block>Create New Build</UButton>
            </UCard>

            <UCard class="bg-primary-800/10 border-primary-800/50">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UIcon name="i-lucide-library" class="text-primary-500 size-6" />
                        <h3 class="text-lg font-bold text-white uppercase">My Library</h3>
                    </div>
                </template>
                <p class="text-primary-100/60 text-sm mb-6">
                    Access and edit your previously saved builds or share them with the community.
                </p>
                <UButton color="primary" variant="outline" block>View Saved Builds</UButton>
            </UCard>
        </section>

        <section class="p-8 bg-primary-950/50 border border-primary-800/50 text-center space-y-4">
            <UIcon name="i-lucide-construction" class="size-12 text-primary-500/50" />
            <h3 class="text-xl font-bold text-white italic truncate">Interactive Planner - Coming Soon</h3>
            <p class="text-primary-100/40 text-sm max-w-md mx-auto">
                We are currently integrating the real-time hero data API. Soon you'll be able to drag-and-drop gear
                items
                directly into your builds.
            </p>
        </section>
    </div>
</template>
