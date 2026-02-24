<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
    <div class="z-10 w-full max-w-md space-y-8 text-center">
      <div class="flex flex-col items-center gap-4">
        <RCLogo class="h-12 w-auto" variant="full" />
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Account Recovery
        </h1>
        <p class="text-neutral-400 text-sm">
          Password recovery is currently unavailable. Please contact support if you need assistance.
        </p>
      </div>

      <div class="mt-8">
        <UButton
          to="/auth/sign-in"
          variant="link"
          color="primary"
          icon="lucide:arrow-left"
        >
          Back to Sign In
        </UButton>
      </div>

      <div class="flex justify-center gap-6 pt-4 text-xs text-neutral-500">
        <span>&copy; {{ new Date().getFullYear() }} Rimelight Entertainment</span>
      </div>
    </div>
  </div>
</template>
