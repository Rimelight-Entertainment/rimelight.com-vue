<script setup lang="ts">
import { PAGE_MAP as pageDefinitions } from "~/types"
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const lookupPath = computed(() => `/api/pages/BlogPost/${slug.value}`)
</script>
<template>
  <RCPageEditView
    :page-definitions="pageDefinitions"
    :lookup-path="lookupPath"
    :cache-key="`blog-${slug.value}`"
    :live-url-builder="() => `/company/blog/${slug.value}`"
    :review-url-builder="(s, versionId) => `/company/blog/${slug.value}/review?version=${versionId}`"
    back-url="/company/blog"
    :error-redirect-params="{ redirect: '/company/blog', label: 'Back to Blog', message: 'The blog post you are looking for does not exist or has been removed.' }"
  />
</template>