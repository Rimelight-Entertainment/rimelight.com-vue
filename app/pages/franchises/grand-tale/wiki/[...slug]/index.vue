<script setup lang="ts">
definePageMeta({ layout: 'wiki' })
const route = useRoute()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})
const lookupPath = computed(() => `franchises/grand-tale/wiki/${slug.value}`)
</script>
<template>
  <RCPageLiveView
    :lookup-path="lookupPath"
    :cache-key="`wiki-${slug.value}`"
    :edit-url-builder="() => `/franchises/grand-tale/wiki/${slug.value}/edit`"
    :error-redirect-params="{ redirect: '/franchises/grand-tale/wiki', label: 'Back to Wiki', message: 'The requested wiki page could not be located.' }"
  />
</template>