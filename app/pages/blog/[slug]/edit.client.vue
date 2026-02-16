<script setup lang="ts">
import { type Page, type PageType } from "#rimelight-components/types"
import { PAGE_MAP as pageDefinitions } from "~/types"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { t, locale } = useI18n()
const appConfig = useAppConfig()

const slug = route.params.slug as string
const isSaving = ref(false)
const PAGE_TYPE: PageType = "BlogPost"

const {
  data: page,
  status: pageStatus,
  error: pageError
} = useApi<Page>(`/api/pages/${PAGE_TYPE}/${slug}`, {
  method: "GET",
  key: `edit-blog-${slug}`,
})

const localPage = ref<Page | null>(null)

watch(page, (newVal) => {
  if (newVal) {
    localPage.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true })

const resolvePage = async (id: string) => {
  return $api<Page>(`/api/pages/id/${id}`, {
    query: { select: 'title,icon,slug' }
  })
}

const handleSave = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return
  isSaving.value = true

  try {
    await $api(`/api/pages/id/${updatedPage.id}`, {
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
    await $api(`/api/pages/id/${updatedPage.id}/publish`, {
      method: "POST"
    })

    toast.add({ color: "success", title: t("toast_publish_success") })
  } catch (e) {
    toast.add({ color: "error", title: t("toast_publish_error") })
  } finally {
    isSaving.value = false
  }
}

const handleCreate = async (newPageData: Partial<Page>) => {
  try {
    const createdPage = await $api<Page>('/api/pages', {
      method: 'POST',
      body: newPageData
    })

    toast.add({ color: 'success', title: t('toast_create_success') })

    await router.push(`/blog/${createdPage.slug}/edit`)
  } catch (e) {
    toast.add({ color: 'error', title: t('toast_create_error') })
  }
}

const handleDelete = async (id: string) => {
  try {
    await $api(`/api/pages/id/${id}`, {
      method: 'DELETE'
    })

    toast.add({ color: 'success', title: t('toast_delete_success') })

    await router.push('/blog')
  } catch (e) {
    toast.add({ color: 'error', title: t('toast_delete_error') })
  }
}

useHead({
  title: () => `Edit Post: ${getLocalizedContent(page.value?.title, locale) ?? appConfig.title}`
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

  <template v-else-if="localPage && localPage.id">
    <RCPageEditor
      v-model="localPage"
      :is-saving="isSaving"
      :page-definitions="pageDefinitions"
      :resolve-page="resolvePage"
      :on-create-page="handleCreate"
      :on-delete-page="handleDelete"
      @save="handleSave"
      @publish="handlePublish"
    />
  </template>
</template>

<style scoped></style>
