<script setup lang="ts">
import { type Page, type PageType } from "#rimelight-components/types"

const route = useRoute()
const { user } = useAuth()
const { locale } = useI18n()
const appConfig = useAppConfig()

const PAGE_TYPE: PageType = "BlogPost"
const slug = route.params.slug

const canEdit = computed(() => user.value?.role === 'owner' || user.value?.role === 'admin')

const {
  data: page,
  status: pageStatus,
  error: pageError
} = await useApi<Page>(`/api/pages/${PAGE_TYPE}/${slug}`, {
  method: "GET",
  key: `blog-${slug}`,
})

const resolvePage = async (id: string) => {
  return $api<Page>(`/api/pages/id/${id}`, {
    query: { select: "title,icon,slug" },
  })
}

useHead({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title
})

useSeoMeta({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  ogTitle: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  description: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description,
  ogDescription: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description
})
</script>

<template>
  <USkeleton v-if="pageStatus === 'pending'" class="h-full w-full" />

  <LazyUError
    v-else-if="pageError || !page"
    :clear="{ label: 'Back to Blog' }"
    :error="{
      status: 404,
      statusText: 'Post Not Found',
      message: 'The blog post you are looking for does not exist or has been removed.',
    }"
    redirect="/blog"
  />

  <RCPageRenderer
    v-else
    v-model="page"
    :resolve-page="resolvePage"
    :can-edit="canEdit"
    :edit-url="`/blog/${slug}/edit`"
  />
</template>

<style scoped></style>

