<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type Block, type Page } from "rimelight-components/types"
import { getLocalizedContent } from "rimelight-components/utils"
import { PAGE_MAP as pageDefinitions } from "~/types"
import { useQuery, useQueryCache } from "@pinia/colada"
import { pageBySlugQuery } from "~/queries"

const router = useRouter()
const appConfig = useAppConfig()
const route = useRoute()
const { share } = useShare()
const { copy } = useClipboard()
const toast = useToast()
const { t, locale } = useI18n()

const queryCache = useQueryCache()

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const slugParam = route.params.slug
const slug = computed(() => {
  if (!slugParam) return ''
  return Array.isArray(slugParam) ? slugParam.join('/') : slugParam
})

const editorBlocks = ref<Block[]>([])
const isSaving = ref(false)

const {
  state: pageState,
} = useQuery(pageBySlugQuery(slug))

const resolvePage = async (id: string) => {
  try {
    // UPDATED: Changed $fetch to $api
    return await $api<Page>(`/api/pages/id/${id}`, {
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
    // UPDATED: Changed $fetch to $api
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
    router.push(`/admin/editor/${createdPage.slug}`)
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

    // Redirect back to the dashboard/listing
    router.push('/')
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

const sharePage = async () => {
  if (!pageState.value.data) {
    return
  }

  try {
    await share({
      title: getLocalizedContent(pageState.value.data.title, locale),
      text: getLocalizedContent(pageState.value.data.description, locale),
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
  title: () => {
    if (pageState.value.status === 'success') {
      return getLocalizedContent(pageState.value.data.title, locale)
    }
    return appConfig.title
  }
})

useSeoMeta({
  titleTemplate: `%s - me.blog`,
  title: () => {
    const state = pageState.value
    return state.status === 'success'
        ? getLocalizedContent(state.data.title, locale)
        : appConfig.title
  },
  ogTitle: () => {
    const state = pageState.value
    return state.status === 'success'
        ? getLocalizedContent(state.data.title, locale)
        : appConfig.title
  },
  description: () => {
    const state = pageState.value
    return state.status === 'success'
        ? getLocalizedContent(state.data.description, locale)
        : appConfig.description
  },
  ogDescription: () => {
    const state = pageState.value
    return state.status === 'success'
        ? getLocalizedContent(state.data.description, locale)
        : appConfig.description
  }
})
</script>

<template>
  <template v-if="pageState.status === 'pending'">
    <div class="flex h-64 items-center justify-center">
      <USkeleton />
    </div>
  </template>
  <template v-else-if="pageState.status === 'error'">
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
  <template v-else>
    <RCPageEditor
        v-model="pageState.data"
        :is-saving="isSaving"
        :page-definitions="pageDefinitions"
        :resolve-page="resolvePage"
        :on-create-page="handleCreate"
        :on-delete-page="handleDelete"
        @save="handleSave"
    />
  </template>
</template>

<style scoped>

</style>