<script setup lang="ts">
definePageMeta({
  layout: 'grand-tale'
});

useHead({
  title: "Grand Tale | Support",
});
</script>

<template>
  <div class="py-20">
    <UContainer>
      <div class="max-w-4xl mx-auto space-y-16">
        <div class="text-center space-y-4">
          <h1 class="text-4xl font-black uppercase tracking-tighter text-white">How can we help?</h1>
          <p class="text-grand-tale-secondary-100/60 max-w-xl mx-auto">Having issues in the world of Grand Tale? Our dedicated support team is here to assist you.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UCard class="bg-grand-tale-primary-800/20 border-grand-tale-secondary-700/50">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="lucide:bug" class="text-grand-tale-secondary-500 size-6" />
                <h3 class="text-lg font-bold text-white uppercase">Report a Bug</h3>
              </div>
            </template>
            <p class="text-sm text-grand-tale-secondary-100/60 mb-6">Found something broken? Let us know so we can fix it for everyone.</p>
            <UButton block color="grand-tale-primary">Submit Report</UButton>
          </UCard>

          <UCard class="bg-grand-tale-primary-800/20 border-grand-tale-secondary-700/50">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="lucide:shield-question" class="text-grand-tale-secondary-500 size-6" />
                <h3 class="text-lg font-bold text-white uppercase">Account Recovery</h3>
              </div>
            </template>
            <p class="text-sm text-grand-tale-secondary-100/60 mb-6">Lost access to your account? We'll help you get back into the game.</p>
            <UButton block variant="outline" color="grand-tale-secondary">Start Recovery</UButton>
          </UCard>
        </div>

        <div class="bg-grand-tale-primary-900/50 border border-grand-tale-secondary-800/50 p-8 text-center space-y-6">
          <h3 class="text-xl font-bold text-white uppercase">Join the Community</h3>
          <p class="text-grand-tale-secondary-100/60">Our Discord servers are the fastest way to get help from other players and developers.</p>
          <div class="flex justify-center gap-4">
             <UButton icon="i-ic:baseline-discord" class="bg-[#5865F2] hover:bg-[#4752C4]">Official Discord</UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
