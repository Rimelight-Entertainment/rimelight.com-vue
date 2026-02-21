<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";

const route = useRoute();
const { permissions } = useAuth();
const isAdmin = permissions?.admin?.canAccess ?? true;

const slug = computed(() => route.params.slug as string);
const lookupSlug = computed(() => `documents/${slug.value}`);
</script>

<template>
  <RCPageEditView
    :lookup-path="lookupSlug"
    :cache-key="`document-edit-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/documents"
    :hierarchy-path="''"
    :is-admin="isAdmin"
    back-url="/documents"
    :error-redirect-params="{
      redirect: '/documents',
      label: 'Back to Documents',
      message: 'The requested document could not be located.',
    }"
  />
</template>
