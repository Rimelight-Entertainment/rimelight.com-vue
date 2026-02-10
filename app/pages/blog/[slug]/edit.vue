<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type Block, type Page, type PageType } from "rimelight-components/types"
import { getLocalizedContent } from "rimelight-components/utils"
import { PAGE_MAP as pageDefinitions } from "~/types"

const router = useRouter()
const appConfig = useAppConfig()
const { session, permissions } = useAuth()
const route = useRoute()
const { share } = useShare()
const { copy } = useClipboard()
const toast = useToast()
const { t, locale } = useI18n()
const PAGE_TYPE: PageType = "BlogPost"

const slug = route.params.slug

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const editorBlocks = ref<Block[]>([])
const isSaving = ref(false)

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
      query: { select: 'title,icon,slug' }
    })
  } catch (e) {
    console.error('Failed to resolve mention:', e)
    throw e
  }
}

const handleSave = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return
  isSaving.value = true

  try {
    await $fetch(`/api/pages/id/${updatedPage.id}`, {
      method: "PUT",
      body: updatedPage
    })

    toast.add({ color: "success", title: t("toast_save-post_success_title") })
  } catch (e) {
    toast.add({ color: "error", title: t("toast_save-post_error_title") })
  } finally {
    isSaving.value = false
  }
}

const handlePublish = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return
  isSaving.value = true

  try {
    await $fetch(`/api/pages/id/${updatedPage.id}/publish`, {
      method: "POST"
    })

    toast.add({ color: "success", title: t("toast_publish_success", "Page Published") })
  } catch (e) {
    toast.add({ color: "error", title: t("toast_publish_error", "Failed to publish") })
  } finally {
    isSaving.value = false
  }
}

/**
 * Handler for creating a new page
 */
const handleCreate = async (newPageData: Partial<Page>) => {
  try {
    const createdPage = await $fetch<Page>('/api/pages', {
      method: 'POST',
      body: newPageData
    })

    toast.add({ color: 'success', title: t('toast_create_success') })

    // Redirect to the new page's editor
    await router.push(`/${createdPage.slug}/edit`)
  } catch (e) {
    toast.add({ color: 'error', title: t('toast_create_error') })
  }
}

/**
 * Handler for deleting the current page
 */
const handleDelete = async (id: string) => {
  try {
    await $fetch(`/api/pages/id/${id}`, {
      method: 'DELETE'
    })

    toast.add({ color: 'success', title: t('toast_delete_success') })

    await router.push('/')
  } catch (e) {
    toast.add({ color: 'error', title: t('toast_delete_error') })
  }
}

const goBackToView = () => {
  router.push(`/blog/${slug}`)
}

watch(route, () => {
  leftDrawerOpen.value = false
  rightDrawerOpen.value = false
})

const sharePost = async () => {
  if (!post.value) {
    return
  }

  try {
    await share({
      title: getLocalizedContent(post.value.title, locale),
      text: getLocalizedContent(post.value.description, locale),
      url: typeof location !== "undefined" ? location.href : ""
    })
  } catch {
    toast.add({
      color: "error",
      title: "toast_share-post_error_title",
      description: "toast_share-post_error_description"
    })
  }
}

const copyLink = async () => {
  try {
    await copy(typeof location !== "undefined" ? location.href : "")
    toast.add({
      color: "success",
      title: "toast_copy-post-link_success_title",
      description: typeof location !== "undefined" ? location.href : ""
    })
  } catch {
    toast.add({
      color: "error",
      title: "toast_copy-post-link_error_title",
      description: "toast_copy-post-link_error_description"
    })
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
  <template v-if="postError || (!post && postStatus === 'success')">
    <LazyUError
      :error="{
        statusCode: 404,

        statusMessage: 'Post not found',

        message:
          'The blog post you are looking for does not exist or has been removed.'
      }"
      redirect="/blog"
      :clear="{ label: 'Back to Blog' }"
    />
  </template>
  <template v-else-if="post">
    <RCPageEditor
      v-model="post"
      :is-saving="isSaving"
      :page-definitions="pageDefinitions"
      :resolve-page="resolvePage"
      :on-create-page="handleCreate"
      :on-delete-page="handleDelete"
      @save="handleSave"
      @publish="handlePublish"
    />
  </template>
  <template v-else>
    <div class="flex h-64 items-center justify-center">
      <USkeleton />
    </div>
  </template>
</template>

<style scoped></style>
