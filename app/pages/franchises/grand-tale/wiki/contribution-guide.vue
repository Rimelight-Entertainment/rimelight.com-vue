<script setup lang="ts">
definePageMeta({
    layout: 'wiki'
});

useHead({
    title: "Contribution Guide | Grand Tale Wiki",
});

const rules = [
    {
        title: "Accuracy",
        description: "Ensure all information is verified against in-game data or official developer statements."
    },
    {
        title: "Tone",
        description: "Maintain a neutral, encyclopedic tone. Avoid first-person perspectives unless in a specific tips section."
    },
    {
        title: "Formatting",
        description: "Use standard headers, bold text for key terms, and properly link to other wiki articles."
    },
    {
        title: "Media",
        description: "Only upload high-quality screenshots and ensure they are properly categorized."
    }
];
</script>

<template>
    <div class="space-y-16">
        <section class="space-y-6">
            <div
                class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
                Community
            </div>
            <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">Contributing to <br />
                <span class="text-primary-500">The Great Library</span></h1>
            <p class="text-xl text-primary-100/60 font-light max-w-2xl leading-relaxed">
                Help us build the most comprehensive database for Grand Tale. Your knowledge helps other players master
                the shards and uncover the mysteries of Aethelgard.
            </p>
        </section>

        <hr class="border-primary-800/30" />

        <section class="space-y-8">
            <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <UIcon name="i-lucide-scroll" class="text-primary-500" />
                General Rules
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="rule in rules" :key="rule.title"
                    class="p-6 bg-primary-950/30 border border-primary-800/50 space-y-2">
                    <h3 class="font-bold text-white uppercase tracking-tight">{{ rule.title }}</h3>
                    <p class="text-sm text-primary-100/60 leading-relaxed">{{ rule.description }}</p>
                </div>
            </div>
        </section>

        <section class="space-y-8">
            <h2 class="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <UIcon name="i-lucide-git-pull-request" class="text-primary-500" />
                How to Submit
            </h2>

            <div class="space-y-6 prose prose-invert prose-primary max-w-none">
                <p class="text-primary-100/60">
                    Currently, the wiki is in a semi-closed state. To contribute, you must have a verified Rimelight
                    account with at least 10 hours of playtime in Grand Tale.
                </p>

                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-4 p-4 bg-primary-900/40 border border-primary-800/50">
                        <div
                            class="flex-none w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
                            1</div>
                        <div>
                            <p class="text-white font-bold">Draft your article</p>
                            <p class="text-sm text-primary-100/40">Use our internal Markdown editor to create your
                                content.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4 p-4 bg-primary-900/40 border border-primary-800/50">
                        <div
                            class="flex-none w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
                            2</div>
                        <div>
                            <p class="text-white font-bold">Submit for Review</p>
                            <p class="text-sm text-primary-100/40">Our Wiki Guardians will review your submission for
                                accuracy and formatting.</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4 p-4 bg-primary-900/40 border border-primary-800/50">
                        <div
                            class="flex-none w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
                            3</div>
                        <div>
                            <p class="text-white font-bold">Earn Rewards</p>
                            <p class="text-sm text-primary-100/40">Approved contributions earn you unique badges and
                                in-game Soulstone dust.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="p-8 bg-primary-500/10 border border-primary-500/20 text-center space-y-4">
            <h3 class="text-xl font-bold text-white">Ready to help?</h3>
            <p class="text-primary-100/60 max-w-lg mx-auto">Join the Wiki Development channel in our Discord to
                coordinate with other contributors.</p>
            <UButton color="primary" icon="ic:baseline-discord">Join Discord</UButton>
        </section>
    </div>
</template>
