<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types"
definePageMeta({ layout: 'wiki' })
const route = useRoute()
const versionId = computed(() => route.query.version as string)

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})
const lookupPath = computed(() => `franchises/grand-tale/wiki/${slug.value}`)
</script>
<template>
  <RCPageReviewView
    :page-definitions="pageDefinitions"
    :lookup-path="lookupPath"
    :version-id="versionId"
    :cache-key-base="`wiki-${slug.value}`"
    :live-url-builder="() => `/franchises/grand-tale/wiki/${slug.value}`"
    :edit-url-builder="() => `/franchises/grand-tale/wiki/${slug.value}/edit`"
    :review-url-builder="(s, v) => `/franchises/grand-tale/wiki/${slug.value}/review?version=${v}`"
    :error-redirect-params="{ redirect: '/franchises/grand-tale/wiki', label: 'Back to Wiki', message: 'The requested wiki page could not be located.' }"
  />
</template>