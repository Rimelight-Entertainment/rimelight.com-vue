<script setup lang="ts">
definePageMeta({
    layout: 'guides'
});

useHead({
    title: "Calculators | Grand Tale Guides",
});

const calculators = [
    {
        title: "DPS Calculator",
        icon: "i-lucide-sword",
        description: "Calculate your true damage per second based on attack speed, crit rate, and elemental scaling."
    },
    {
        title: "Effective HP (EHP)",
        icon: "i-lucide-shield",
        description: "Determine your actual survivability against physical and magical hits by factoring in armor and resistances."
    },
    {
        title: "Resonance Finder",
        icon: "i-lucide-sparkles",
        description: "Identify the optimal Soulstone combinations to trigger your hero's secret passive abilities."
    },
    {
        title: "Resource Yield",
        icon: "i-lucide-pickaxe",
        description: "Estimate materials gathered per hour based on your current tool tier and gathering efficiency stats."
    }
];
</script>

<template>
    <div class="space-y-16">
        <section class="space-y-6">
            <div
                class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
                Tools
            </div>
            <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">Game <br /> <span
                    class="text-primary-500">Calculators</span></h1>
            <p class="text-xl text-primary-100/60 font-light max-w-2xl leading-relaxed">
                Crunch the numbers to gain a competitive edge. From damage optimization to survival thresholds, our math
                tools do the heavy lifting for you.
            </p>
        </section>

        <hr class="border-primary-800/30" />

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="calc in calculators" :key="calc.title"
                class="group p-6 bg-primary-950/30 border border-primary-800/50 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all cursor-pointer">
                <div class="flex items-start gap-4">
                    <div class="p-3 bg-primary-500/20 group-hover:bg-primary-500/30 transition-colors">
                        <UIcon :name="calc.icon" class="size-6 text-primary-400" />
                    </div>
                    <div class="space-y-1">
                        <h3
                            class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                            {{ calc.title }}</h3>
                        <p class="text-sm text-primary-100/60 leading-relaxed">{{ calc.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <UCard class="bg-primary-800/10 border-primary-800/50 border-dashed">
            <div class="text-center py-6 space-y-2">
                <p class="text-primary-100/40 text-sm">Have a complex formula suggestion?</p>
                <UButton variant="link" color="primary">Submit Calculation Request</UButton>
            </div>
        </UCard>
    </div>
</template>
