<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";

const route = useRoute();
const { permissions } = useAuth();
const isAdmin = permissions?.admin?.canAccess ?? true;

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
  <RCPageReviewView
    :lookup-path="slug"
    :cache-key="`document-review-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/documents"
    :is-admin="isAdmin"
    :error-redirect-params="{
      redirect: '/documents',
      label: 'Back to Documents',
      message: 'The requested document could not be located.',
    }"
  />
</template>
