<script setup lang="ts">
import { type Page, type PageType, type PageVersion } from "#rimelight-components/types"
import { convertVersionToPage } from "#rimelight-components/utils"
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

const resolvePage = async (id: string) => {
  return $api<Page>(`/api/pages/id/${id}`, {
    query: { select: 'title,icon,slug' }
  })
}

const fetchPages = async () => {
  return $api<Pick<Page, 'title' | 'slug' | 'type'>[]>('/api/pages/list')
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
  if (!version || !version.id) {
    // Navigate back to live version
    localPage.value = JSON.parse(JSON.stringify(page.value))
    currentVersionId.value = null
    await nextTick()
    editorRef.value?.resetHistory()
    return
  }

  try {
    const versionData = await $api<PageVersion>(`/api/pages/versions/${version.id}`)
    
    // Use the utility to ensure proper Page structure
    const newPage = convertVersionToPage(versionData)
    
    // Sync with definition immediately so the UI doesn't see unhydrated data
    const definition = (pageDefinitions as any)[newPage.type]
    if (definition) {
      syncPageWithDefinition(newPage, definition)
    }
    
    localPage.value = newPage
    currentVersionId.value = version.id
    
    // Reset history so it starts clean from this version
    await nextTick()
    editorRef.value?.resetHistory()
  } catch (e) {
    console.error("Failed to load version:", e)
    toast.add({ color: 'error', title: 'Failed to load version' })
  }
}

const handleVersionApproved = async (version: PageVersion) => {
  // If we were viewing this version, or it was just approved to live, 
  // we should refresh the page data
  await refreshPage()
  
  // If we were viewing this version, go back to live (which is now this version)
  if (currentVersionId.value === version.id) {
    currentVersionId.value = null
    localPage.value = JSON.parse(JSON.stringify(page.value))
    await nextTick()
    editorRef.value?.resetHistory()
  }
}

const handleVersionRejected = async (version: PageVersion) => {
  // If we were viewing the version that was just rejected, go back to live
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
