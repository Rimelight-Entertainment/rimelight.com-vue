<script setup lang="ts">
const route = useRoute()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})
const lookupPath = computed(() => slug.value)
</script>
<template>
  <RCPageLiveView
    :lookup-path="lookupPath"
    :cache-key="`catch-all-${slug.value}`"
    :edit-url-builder="() => `/${slug.value}/edit`"
    :error-redirect-params="{ redirect: '/', label: 'Return Home', message: 'The requested page could not be located.' }"
  />
</template>