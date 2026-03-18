<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()

const slug = computed(() => route.params.slug as string)
const canEdit = computed(() => user.value?.role === "owner" || user.value?.role === "admin")

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
  <RCPageLiveView
    :lookup-path="slug"
    :cache-key="`blog-${slug}`"
    base-url="/company/blog"
    :can-edit="canEdit"
    :error-redirect-params="{
      redirect: '/company/blog',
      label: 'Back to Blog',
      message: 'The requested blog post could not be located.'
    }"
  />
</template>
