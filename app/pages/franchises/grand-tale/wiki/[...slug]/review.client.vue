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

const versionId = computed(() => route.query.version as string);
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
  <RLPageReviewView
    :lookup-path="lookupSlug"
    :version-id="versionId"
    :page-definitions="pageDefinitions"
    base-url="/franchises/grand-tale/wiki"
    :is-admin="isAdmin"
  />
</template>
