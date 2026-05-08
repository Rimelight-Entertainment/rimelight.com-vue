<script setup lang="ts">
import type { NuxtError } from "#app";

export interface ErrorProps {
  error: NuxtError;
}

const { error } = defineProps<ErrorProps>();

const { t } = useI18n();

useSeoMeta({
  title: "Page not found",
  description: "We are sorry but this page could not be found.",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UError :error="error" :ui="{ statusMessage: 'text-black', links: 'gap-6' }">
        <template #links>
          <UButton
            size="lg"
            color="primary"
            variant="solid"
            class="text-white bg-primary-500 hover:bg-primary-600"
            @click="() => clearError({ redirect: '/' })"
          >
            {{ t('error.clear') }}
          </UButton>
        </template>
      </UError>
    </NuxtLayout>
  </UApp>
</template>

<style scoped></style>
