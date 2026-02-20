<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types"
const route = useRoute()
const versionId = computed(() => route.query.version as string)
const slug = computed(() => route.params.slug as string)
const lookupPath = computed(() => `/api/pages/BlogPost/${slug.value}`)
</script>
<template>
  <RCPageReviewView
    :page-definitions="pageDefinitions"
    :lookup-path="lookupPath"
    :version-id="versionId"
    :cache-key-base="`blog-${slug.value}`"
    :live-url-builder="() => `/company/blog/${slug.value}`"
    :edit-url-builder="() => `/company/blog/${slug.value}/edit`"
    :review-url-builder="(s, v) => `/company/blog/${slug.value}/review?version=${v}`"
    :error-redirect-params="{ redirect: '/company/blog', label: 'Back to Blog', message: 'The blog post you are looking for does not exist or has been removed.' }"
  />
</template>