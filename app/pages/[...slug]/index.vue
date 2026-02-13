<script lang="ts" setup>
import {useRoute} from "vue-router"
import {type Page} from "rimelight-components/types"

import {useI18n} from "vue-i18n"

const appConfig = useAppConfig()
const route = useRoute()
const {locale} = useI18n()

const slug = Array.isArray(route.params.slug)
    ? route.params.slug.join('/')
    : route.params.slug

const {
  data: page,
  status: pageStatus,
  error: pageError
} = await useLazyFetch<Page>(`/api/pages/find/${slug}`, {
  method: "GET",
  key: `catch-all-${slug}`,
})

const resolvePage = async (id: string) => {
  return await $fetch<Page>(`/api/pages/id/${id}`, {
    query: {select: 'title,icon,slug'}
  })
}

useHead({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title
})

useSeoMeta({
  titleTemplate: `%s - ${appConfig.title}`,
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  ogTitle: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  description: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description,
  ogDescription: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description
})
</script>

<template>
  <div v-if="pageStatus === 'pending'" class="flex items-center justify-center p-12">
    <UIcon class="animate-spin" name="i-heroicons-arrow-path" />
  </div>

  <template v-else-if="pageError || !page">
    <LazyUError
      :clear="{ label: 'Return Home' }"
      :error="{
        statusCode: 404,
        statusMessage: 'Page Not Found',
        message: 'The requested page could not be located.'
      }"
      redirect="/"
    />
  </template>

  <main v-else>
    <RCPageRenderer v-model="page" :resolve-page="resolvePage" />
  </main>
</template>

<style scoped></style>
