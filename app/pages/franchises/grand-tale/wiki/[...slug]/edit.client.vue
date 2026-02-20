<script setup lang="ts">
import { type Page, type PageType, type PageVersion } from "#rimelight-components/types"
import { convertVersionToPage, getLocalizedContent, getPageResolutionPath } from "#rimelight-components/utils"
import { PAGE_MAP as pageDefinitions } from "~/types"

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { t, locale } = useI18n()
const appConfig = useAppConfig()

const slugParam = route.params.slug
const slug = computed(() => {
  if (!slugParam) return ''
  return Array.isArray(slugParam) ? slugParam.join('/') : slugParam
})

const lookupSlug = computed(() => `franchises/grand-tale/wiki/${slug.value}`)
const isSaving = ref(false)

const {
  data: page,
  status: pageStatus,
  error: pageError,
  refresh: refreshPage
} = useApi<Page>(`/api/pages/find/${lookupSlug.value}`, {
  method: "GET",
  key: `edit-wiki-${slug.value}`,
})

const { permissions } = useAuth()
const isAdmin = permissions.admin.canAccess

const currentVersionId = ref<string | null>(null)
const editorRef = useTemplateRef('editor')

const localPage = ref<Page | null>(null)

watch(page, (newVal) => {
  if (newVal) {
    localPage.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true })

const resolvePage = async (idOrSlug: string): Promise<Pick<Page, 'title' | 'icon' | 'slug'>> => {
  const url = getPageResolutionPath(idOrSlug)
  if (!url) throw new Error(`[Editor] Invalid page reference: ${idOrSlug}`)
  
  try {
    const data = await $api<Page>(url, {
      query: { select: 'title,icon,slug' }
    })
    if (!data) throw new Error(`[Editor] Page not found: ${idOrSlug}`)
    return data
  } catch (e) {
    console.warn(`[Editor] Failed to resolve page: ${idOrSlug}`, e)
    throw e
  }
}

const fetchPages = async () => {
  return $api<Pick<Page, 'title' | 'slug' | 'type' | 'id'>[]>('/api/pages/list', {
    query: { select: 'title,slug,type,id' }
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
    
    // Refresh page data to update the versions selector if it's open
    await refreshPage()

    // Reset editor history so it's not marked as dirty
    await nextTick()
    editorRef.value?.resetHistory()
  } catch (e) {
    toast.add({ color: "error", title: t("toast_save-post_error_title") })
  } finally {
    isSaving.value = false
  }
}

const handleVersionNavigate = async (version: PageVersion | null) => {
  if (!version || !version.id) return
  
  await navigateTo({
    path: `/franchises/grand-tale/wiki/${slug.value}/review`,
    query: { version: version.id }
  })
}

const handleVersionApproved = async (version: PageVersion) => {
  await refreshPage()
  
  if (currentVersionId.value === version.id) {
    currentVersionId.value = null
    localPage.value = JSON.parse(JSON.stringify(page.value))
    await nextTick()
    editorRef.value?.resetHistory()
  }
}

const handleVersionRejected = async (version: PageVersion) => {
  if (currentVersionId.value === version.id) {
    currentVersionId.value = null
    localPage.value = JSON.parse(JSON.stringify(page.value))
    await nextTick()
    editorRef.value?.resetHistory()
  }
}

const handleVersionReverted = async (version: PageVersion) => {
  await refreshPage()
  currentVersionId.value = null
  localPage.value = JSON.parse(JSON.stringify(page.value))
  await nextTick()
  editorRef.value?.resetHistory()
}

const handlePublish = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return
  isSaving.value = true

  try {
    await $api(`/api/pages/id/${updatedPage.id}/publish`, {
      method: "POST"
    })

    toast.add({ color: "success", title: t("toast_publish_success") })

    // Redirect to the live page
    await nextTick()
    await navigateTo(`/franchises/grand-tale/wiki/${updatedPage.slug}`)
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

    await navigateTo(`/franchises/grand-tale/wiki/${createdPage.slug}/edit`)
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

    await router.push('/franchises/grand-tale/wiki')
  } catch (e) {
    toast.add({ color: 'error', title: t('toast_delete_error') })
  }
}

useHead({
  title: () => `Edit Wiki: ${getLocalizedContent(page.value?.title, locale) ?? appConfig.title}`
})
</script>

<template>
  <USkeleton v-if="pageStatus === 'pending'" class="h-full w-full" />

  <LazyUError v-else-if="pageError || !page" :clear="{ label: 'Back to Wiki' }" :error="{
    status: 404,
    statusText: 'Page Not Found',
    message: 'The requested wiki page could not be located.',
  }" redirect="/franchises/grand-tale/wiki" />

  <template v-else-if="localPage && localPage.id">
    <RCPageEditor 
      ref="editor"
      v-model="localPage" 
      v-model:current-version-id="currentVersionId"
      :is-saving="isSaving" 
      :is-admin="isAdmin"
      :page-definitions="pageDefinitions"
      :resolve-page="resolvePage" 
      :on-fetch-pages="fetchPages" 
      :on-delete-page="handleDelete" 
      @save="handleSave"
      @publish="handlePublish" 
      @version-navigate="handleVersionNavigate"
      @version-approved="handleVersionApproved"
      @version-rejected="handleVersionRejected"
      @version-reverted="handleVersionReverted"
    />
  </template>
</template>

<style scoped></style>
