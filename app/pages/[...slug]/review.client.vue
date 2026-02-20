<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types"
const route = useRoute()
const versionId = computed(() => route.query.version as string)

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})
const lookupPath = computed(() => slug.value)
</script>
<template>
  <RCPageReviewView
    :page-definitions="pageDefinitions"
    :lookup-path="lookupPath"
    :version-id="versionId"
    :cache-key-base="`catch-all-${slug.value}`"
    :live-url-builder="() => `/${slug.value}`"
    :edit-url-builder="() => `/${slug.value}/edit`"
    :review-url-builder="(s, v) => `/${slug.value}/review?version=${v}`"
    :error-redirect-params="{ redirect: '/', label: 'Return Home', message: 'The requested page could not be located.' }"
  />
</template>