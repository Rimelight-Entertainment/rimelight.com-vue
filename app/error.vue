<script setup lang="ts">
import type { NuxtError } from "#app";

export interface ErrorProps {
  error: NuxtError;
}

const { error } = defineProps<ErrorProps>();

useSeoMeta({
  title: "Page not found",
  description: "We are sorry but this page could not be found.",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UError :error="error" />
    </NuxtLayout>
  </UApp>
</template>

<style scoped></style>
