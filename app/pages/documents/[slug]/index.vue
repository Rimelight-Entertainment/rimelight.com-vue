<script setup lang="ts">
const route = useRoute();
const { user } = useAuth();
const slug = computed(() => route.params.slug as string);
const canEdit = computed(() => user.value?.role === "owner" || user.value?.role === "admin");

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <RCPageLiveView
    :lookup-path="slug"
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
