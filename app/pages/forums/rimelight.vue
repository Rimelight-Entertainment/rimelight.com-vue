<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t("pages.forums.rimelight.meta.title"),
});

useSeoMeta({
  title: t("pages.forums.rimelight.meta.title"),
  ogTitle: t("pages.forums.rimelight.meta.title"),
  description: t("pages.forums.rimelight.meta.description"),
  ogDescription: t("pages.forums.rimelight.meta.description"),
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
        :title="t('pages.forums.rimelight.meta.title')"
        :description="t('pages.forums.rimelight.meta.description')"
        :ui="{
          title: 'text-black',
          description: 'text-neutral-500',
        }"
      />
      <UPageBody>
        <p class="text-neutral-600">
          {{ t("pages.forums.rimelight.welcome") }}
        </p>
      </UPageBody>
    </UContainer>
  </UPage>
</template>

<style scoped></style>
