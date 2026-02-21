<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";

const route = useRoute();
const { permissions } = useAuth();
const isAdmin = permissions.admin.canAccess;

const slug = computed(() => route.params.slug as string);
</script>

<template>
  <RCPageEditView
    :lookup-path="slug"
    :cache-key="`edit-blog-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/company/blog"
    :hierarchy-path="''"
    :is-admin="isAdmin"
    back-url="/company/blog"
    :error-redirect-params="{
      redirect: '/company/blog',
      label: 'Back to Blog',
      message: 'The requested blog post could not be located.',
    }"
  />
</template>
