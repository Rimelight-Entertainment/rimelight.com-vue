<script setup lang="ts">
const route = useRoute();
const { user } = useAuth();
const slug = computed(() => route.params.slug as string);
const lookupSlug = computed(() => `documents/${slug.value}`);
const canEdit = computed(() => user.value?.role === "owner" || user.value?.role === "admin");
</script>

<template>
  <RCPageLiveView
    :lookup-path="lookupSlug"
    :cache-key="`document-view-${slug}`"
    base-url="/documents"
    :can-edit="canEdit"
    :error-redirect-params="{
      redirect: '/documents',
      label: 'Back to Documents',
      message: 'The requested document could not be located.',
    }"
  />
</template>
