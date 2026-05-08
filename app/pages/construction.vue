<script setup lang="ts">
/* region State */
const { t } = useI18n();
/* endregion */

/* region Meta */
useHead({
  title: "Under Construction",
});

definePageMeta({
  layout: "blank",
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
    <div class="z-10 w-full max-w-md space-y-8 text-center">
      <div class="flex flex-col items-center gap-sm">
        <RLLogo class="h-12 w-auto" variant="mark" />
        <h1 class="text-3xl font-bold text-white sm:text-4xl">
          THIS WEBSITE IS CURRENTLY IN CONSTRUCTION
        </h1>
        <p class="text-neutral-400">Please sign in if you have access.</p>
      </div>

      <UCard class="bg-black">
        <ClientOnly>
          <RLAuthSignInForm
            :recovery="false"
            :terms="false"
            :rc="{
              label: 'text-white',
              description: 'text-neutral-500',
              rememberCheckboxIndicator:
                'data-[state=checked]:bg-primary-500 data-[state=checked]:text-white',
              rememberText: 'text-white',
              submit: 'text-white bg-primary-500 hover:bg-primary-600',
            }"
          />
        </ClientOnly>
      </UCard>

      <div class="flex justify-center gap-xs text-xs text-neutral-500">
        <span>&copy; {{ new Date().getFullYear() }} Rimelight Entertainment</span>
      </div>
    </div>
  </div>
</template>
