<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()

useHead({
  title: t("home_meta_title")
})

useSeoMeta({
  title: t("home_meta_title"),
  ogTitle: t("home_meta_title"),
  description: appConfig.description,
  ogDescription: appConfig.description
})
</script>

<template>
  <UPage> </UPage>
</template>

<style scoped></style>
