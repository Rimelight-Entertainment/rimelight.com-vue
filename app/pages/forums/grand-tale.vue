<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t("pages.forums.grand_tale.meta.title"),
});

useSeoMeta({
  title: t("pages.forums.grand_tale.meta.title"),
  ogTitle: t("pages.forums.grand_tale.meta.title"),
  description: t("pages.forums.grand_tale.meta.description"),
  ogDescription: t("pages.forums.grand_tale.meta.description"),
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
        :title="t('pages.forums.grand_tale.meta.title')"
        :description="t('pages.forums.grand_tale.meta.description')"
        :ui="{
          title: 'text-black',
          description: 'text-neutral-500',
        }"
      />
      <UPageBody>
        <p class="text-neutral-600">
          {{ t("pages.forums.grand_tale.welcome") }}
        </p>
      </UPageBody>
    </UContainer>
  </UPage>
</template>

<style scoped></style>
