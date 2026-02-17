<script setup lang="ts">
const { t } = useI18n();

// Navigation items for Guides
const navigationItems = computed(() => [
    [
        {
            label: 'Guides Explorer',
            type: 'label' as const
        },
        {
            label: 'Featured Guides',
            to: '/franchises/grand-tale/guides'
        }
    ],
    [
        {
            label: 'Categories',
            type: 'label' as const
        },
        {
            label: 'New Players',
            to: '/franchises/grand-tale/guides/getting-started'
        },
        {
            label: 'Hero Builds',
            to: '/franchises/grand-tale/guides/builds'
        },
        {
            label: 'Endgame Content',
            to: '/franchises/grand-tale/guides/endgame'
        },
        {
            label: 'Resources & Crafting',
            to: '/franchises/grand-tale/guides/crafting'
        }
    ],
    [
        {
            label: 'Media',
            type: 'label' as const
        },
        {
            label: 'Video Guides',
            to: '/franchises/grand-tale/guides/videos'
        }
    ],
    [
        {
            label: 'Tools',
            type: 'label' as const
        },
        {
            label: 'Build Planners',
            to: '/franchises/grand-tale/guides/build-planners'
        },
        {
            label: 'Calculators',
            to: '/franchises/grand-tale/guides/calculators'
        }
    ]
]);
</script>

<template>
    <div class="space-y-8 p-md">
        <UNavigationMenu :items="navigationItems" orientation="vertical" :ui="{
            label: 'text-[10px] font-black uppercase tracking-[0.1em]',
            link: 'text-[11px] text-dimmed py-1'
        }" class="w-full" />

        <!-- Community Tip -->
        <div class="px-4 py-6 bg-primary-900/50 border border-primary-800/50 rounded-none space-y-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 text-center">Pro Tip</h3>
            <p class="text-xs text-primary-100/60 leading-relaxed text-center italic">
                "Elemental syncing is key in Void Raids. Always check your team's Soulstone synergy before entering."
            </p>
            <UButton block size="xs" color="primary" variant="ghost" class="text-[10px] font-bold">Share a Tip</UButton>
        </div>
    </div>
</template>
