<script setup lang="ts">
import { useRoute } from "vue-router"
import { type Page, type PageType}  from "#rimelight-components/types"

import { useI18n } from "vue-i18n"

const appConfig = useAppConfig()
const route = useRoute()
const { locale } = useI18n()
const PAGE_TYPE: PageType = "BlogPost"

const slug = route.params.slug

const {
  data: post,
  status: postStatus,
  error: postError
} = await useLazyFetch<Page>(`/api/pages/${PAGE_TYPE}/${slug}`, {
  method: "GET",
  key: `/api/pages/${PAGE_TYPE}/${slug}`,
})

const resolvePage = async (id: string) => {
  try {
    return await $fetch<Page>(`/api/pages/id/${id}`, {
      query: {select: 'title,icon,slug'}
    })
  } catch (e) {
    console.error('Failed to resolve mention:', e)
    throw e
  }
}

useHead({
  title: () => getLocalizedContent(post.value?.title, locale) ?? appConfig.title
})

useSeoMeta({
  titleTemplate: `%s - me.blog`,
  title: () => getLocalizedContent(post.value?.title, locale) ?? appConfig.title,
  ogTitle: () => getLocalizedContent(post.value?.title, locale) ?? appConfig.title,
  description: () => getLocalizedContent(post.value?.description, locale) ?? appConfig.description,
  ogDescription: () => getLocalizedContent(post.value?.description, locale) ?? appConfig.description
})
</script>

<template>
  <template v-if="postStatus === 'pending'">
    <div class="flex items-center justify-center p-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
    </div>
  </template>

  <template v-else-if="postError || !post">
    <LazyUError
      :error="{
        statusCode: 404,
        statusMessage: 'Post not found',
        message: 'The blog post you are looking for does not exist or has been removed.'
      }"
      redirect="/blog"
      :clear="{ label: 'Back to Blog' }"
    />
  </template>

  <template v-else>
    <RCPageRenderer v-model="post" :resolve-page="resolvePage" />
  </template>
</template>

<style scoped></style>
