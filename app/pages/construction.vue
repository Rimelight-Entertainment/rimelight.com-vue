<script setup lang="ts">
useHead({
  title: "Under Construction",
});

definePageMeta({
  layout: "blank",
});

const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
    <div class="z-10 w-full max-w-md space-y-8 text-center">
      <div class="flex flex-col items-center gap-4">
        <RCLogo class="h-12 w-auto" variant="full" />
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          THIS SITE IS CURRENTLY IN CONSTRUCTION
        </h1>
        <p class="text-neutral-400">
          We're working hard to bring you something amazing. Please sign in if you have access.
        </p>
      </div>

      <div class="mt-8 rounded-2xl bg-neutral-900/50 p-8 backdrop-blur-xl ring-1 ring-white/10">
        <ClientOnly>
          <RCAuthSignInForm />
          <template #placeholder>
            <div class="flex h-[300px] items-center justify-center">
              <RCLogo class="h-8 animate-pulse opacity-20" variant="mark" />
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="flex justify-center gap-6 pt-4 text-xs text-neutral-500">
        <span>&copy; {{ new Date().getFullYear() }} Rimelight Entertainment</span>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
      <div class="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
    </div>
  </div>
</template>
