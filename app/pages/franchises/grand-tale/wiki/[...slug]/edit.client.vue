<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types";

const route = useRoute();
const { permissions } = useAuth();
const isAdmin = permissions.admin.canAccess;

const slugParam = route.params.slug;
const slug = computed(() => {
  if (!slugParam) return "";
  return Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
});

const lookupSlug = computed(() => `franchises/grand-tale/wiki/${slug.value}`);

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
  <RCPageEditView
    :lookup-path="lookupSlug"
    :cache-key="`edit-wiki-${slug}`"
    :page-definitions="pageDefinitions"
    base-url="/franchises/grand-tale/wiki"
    :is-admin="isAdmin"
    back-url="/franchises/grand-tale/wiki"
    :error-redirect-params="{
      redirect: '/franchises/grand-tale/wiki',
      label: 'Back to Wiki',
      message: 'The requested wiki page could not be located.',
    }"
  />
</template>
