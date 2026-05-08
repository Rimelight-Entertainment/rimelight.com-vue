<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('pages.events.lightcon.meta.title'),
});

useSeoMeta({
  title: t('pages.events.lightcon.meta.title'),
  ogTitle: t('pages.events.lightcon.meta.title'),
  description: t('pages.events.lightcon.meta.description'),
  ogDescription: t('pages.events.lightcon.meta.description'),
});

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
  <UPage>
    <UContainer>
      <UPageHeader
        :title="t('pages.events.lightcon.meta.title')"
        :description="t('pages.events.lightcon.meta.description')"
        :ui="{
          title: 'text-black',
          description: 'text-neutral-500',
        }"
      />
      <UPageBody>
        <p class="text-neutral-600">
          {{ t('pages.events.lightcon.welcome') }}
        </p>
      </UPageBody>
    </UContainer>
  </UPage>
</template>

<style scoped></style>
