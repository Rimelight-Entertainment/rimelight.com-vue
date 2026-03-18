<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types"

const route = useRoute()
const { permissions } = useAuth()
const isAdmin = permissions.admin.canAccess

const slug = computed(() => route.params.slug as string)
const versionId = computed(() => route.query.version as string)

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
    :version-id="versionId"
    :page-definitions="pageDefinitions"
    base-url="/company/blog"
    :is-admin="isAdmin"
  />
</template>
