<script setup lang="ts">
definePageMeta({
  layout: "wiki",
});

const route = useRoute();
const { user } = useAuth();

const slug = computed(() => {
  const s = route.params.slug;
  if (Array.isArray(s)) return s.join("/");
  return s;
});

const lookupSlug = computed(() => `franchises/grand-tale/wiki/${slug.value}`);
const canEdit = computed(() => user.value?.role === "owner" || user.value?.role === "admin");
</script>

<template>
  <RCPageLiveView
    :lookup-path="lookupSlug"
    :cache-key="`wiki-${slug}`"
    base-url="/franchises/grand-tale/wiki"
    :can-edit="canEdit"
    :error-redirect-params="{
      redirect: '/franchises/grand-tale/wiki',
      label: 'Back to Wiki',
      message: 'The requested wiki page could not be located.',
    }"
  />
</template>
