<script lang="ts" setup>
import { useQuery, useQueryCache } from "@pinia/colada";

import { type Block, type Page, type PageVersion } from "#rimelight-components/types";

import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pageBySlugQuery } from "~/queries";
import { PAGE_MAP as pageDefinitions } from "~/types";

const router = useRouter();
const appConfig = useAppConfig();
const route = useRoute();
const { share } = useShare();
const { user } = useAuth();
const { copy } = useClipboard();
const toast = useToast();
const { t, locale } = useI18n();

const queryCache = useQueryCache();

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

const slugParam = route.params.slug;
const slug = computed(() => {
  if (!slugParam) return "";
  return Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
});

const editorBlocks = ref<Block[]>([]);
const isSaving = ref(false);
const currentVersionId = ref<string | null>(null);
const isViewingVersion = ref(false);
const displayedPage = ref<Page | null>(null);

const { state: pageState, refetch: refetchPage } = useQuery(pageBySlugQuery(slug));

const resolvePage = async (id: string) => {
  try {
    // UPDATED: Changed $fetch to $api
    return await $api<Page>(`/api/pages/id/${id}`, {
      query: { select: "title,icon,slug" },
    });
  } catch (e) {
    console.error("Failed to resolve mention:", e);
    throw e;
  }
};

const handleSave = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return;
  isSaving.value = true;

  try {
    // UPDATED: Changed $fetch to $api
    const result = await $api<{ message?: string }>(`/api/pages/id/${updatedPage.id}`, {
      method: "PUT",
      body: updatedPage,
    });

    toast.add({
      color: "success",
      title: "Version created",
      description:
        result?.message || "Your changes have been saved as a new version pending approval",
    });

    // Refresh the page data
    await refetchPage();
  } catch (e: any) {
    toast.add({
      color: "error",
      title: t("toast_save-post_error_title"),
      description: e.message || "Failed to save version",
    });
  } finally {
    isSaving.value = false;
  }
};

const handlePublish = async (pageToPublish: Page) => {
  if (!pageToPublish.id) return;
  isSaving.value = true;

  try {
    await $api(`/api/pages/id/${pageToPublish.id}/publish`, {
      method: "POST",
    });

    toast.add({
      color: "success",
      title: t("toast_publish_success", "Page Published"),
      description: t("toast_publish_success_desc", "The page has been successfully published."),
    });

    await refetchPage();
  } catch (e: any) {
    toast.add({
      color: "error",
      title: t("toast_publish_error", "Failed to publish"),
      description: e.message || "An error occurred while publishing the page",
    });
  } finally {
    isSaving.value = false;
  }
};

const handleVersionSelected = async (version: PageVersion) => {
  isViewingVersion.value = true;
  currentVersionId.value = version.id;

  displayedPage.value = convertVersionToPage(version);
};

const handleVersionApproved = async () => {
  // Refresh the page data after approval
  await refetchPage();

  // If we were viewing a version, switch back to live
  if (isViewingVersion.value) {
    currentVersionId.value = null;
    isViewingVersion.value = false;
    displayedPage.value = null;
  }
};

const handleVersionReverted = async () => {
  // Refresh the page data after revert
  await refetchPage();

  // Always switch back to live after revert
  currentVersionId.value = null;
  isViewingVersion.value = false;
  displayedPage.value = null;
};

// Watch for page state changes and reset version view if needed
watch(
  () => pageState.value.data,
  (newPage) => {
    if (newPage && !isViewingVersion.value) {
      displayedPage.value = null;
    }
  },
  { immediate: true },
);

// Computed page to display (version or live)
const localPage = ref<Page | null>(null);

// Sync localPage with live data or version data
watch(
  [() => pageState.value.data, isViewingVersion, displayedPage],
  () => {
    if (isViewingVersion.value && displayedPage.value) {
      localPage.value = displayedPage.value;
    } else if (pageState.value.data) {
      // Only update if we are not viewing a version, OR if we just switched back
      // But we need to be careful not to overwrite valid edits if just pageState refreshed?
      // Usually if pageState refreshes (e.g. after save), we want to update.
      // Deep copy to break reference
      localPage.value = JSON.parse(JSON.stringify(pageState.value.data));
    }
  },
  { immediate: true },
);

/**
 * Handler for creating a new page
 */
const handleCreate = async (newPageData: Partial<Page>) => {
  try {
    const createdPage = await $api<Page>("/api/pages", {
      method: "POST",
      body: newPageData,
    });

    toast.add({ color: "success", title: t("toast_create_success") });

    // Redirect to the new page's editor
    router.push(`/admin/editor/${createdPage.slug}`);
  } catch (e) {
    toast.add({ color: "error", title: t("toast_create_error") });
  }
};

/**
 * Handler for deleting the current page
 */
const handleDelete = async (id: string) => {
  try {
    await $api(`/api/pages/id/${id}`, {
      method: "DELETE",
    });

    toast.add({ color: "success", title: t("toast_delete_success") });

    // Redirect back to the dashboard/listing
    router.push("/");
  } catch (e) {
    toast.add({ color: "error", title: t("toast_delete_error") });
  }
};

const goBackToView = () => {
  router.push(`/blog/${slug}`);
};

watch(route, () => {
  leftDrawerOpen.value = false;
  rightDrawerOpen.value = false;
});

const sharePage = async () => {
  if (!pageState.value.data) {
    return;
  }

  try {
    await share({
      title: getLocalizedContent(pageState.value.data.title, locale),
      text: getLocalizedContent(pageState.value.data.description, locale),
      url: typeof location !== "undefined" ? location.href : "",
    });
  } catch {
    toast.add({
      color: "error",
      title: "toast_share-post_error_title",
      description: "toast_share-post_error_description",
    });
  }
};

const copyLink = async () => {
  try {
    await copy(typeof location !== "undefined" ? location.href : "");
    toast.add({
      color: "success",
      title: "toast_copy-post-link_success_title",
      description: typeof location !== "undefined" ? location.href : "",
    });
  } catch {
    toast.add({
      color: "error",
      title: "toast_copy-post-link_error_title",
      description: "toast_copy-post-link_error_description",
    });
  }
};

useHead({
  title: () => {
    if (pageState.value.status === "success") {
      return getLocalizedContent(pageState.value.data.title, locale);
    }
    return appConfig.title;
  },
});

useSeoMeta({
  titleTemplate: `%s - me.blog`,
  title: () => {
    const state = pageState.value;
    return state.status === "success"
      ? getLocalizedContent(state.data.title, locale)
      : appConfig.title;
  },
  ogTitle: () => {
    const state = pageState.value;
    return state.status === "success"
      ? getLocalizedContent(state.data.title, locale)
      : appConfig.title;
  },
  description: () => {
    const state = pageState.value;
    return state.status === "success"
      ? getLocalizedContent(state.data.description, locale)
      : appConfig.description;
  },
  ogDescription: () => {
    const state = pageState.value;
    return state.status === "success"
      ? getLocalizedContent(state.data.description, locale)
      : appConfig.description;
  },
});
</script>

<template>
  <template v-if="pageState.status === 'pending'">
    <div class="flex h-64 items-center justify-center">
      <USkeleton />
    </div>
  </template>
  <template v-else-if="pageState.status === 'error'">
    <LazyUError
      :clear="{ label: 'Back to Blog' }"
      :error="{
        statusCode: 404,

        statusMessage: 'Post not found',

        message: 'The blog post you are looking for does not exist or has been removed.',
      }"
      redirect="/blog"
    />
  </template>
  <template v-else>
    <div class="relative">
      <RCPageEditor
        v-if="localPage"
        v-model="localPage"
        v-model:current-version-id="currentVersionId"
        :is-viewing-version="isViewingVersion"
        :is-admin="user?.role === 'owner' || user?.role === 'admin'"
        :is-saving="isSaving"
        :on-create-page="handleCreate"
        :on-delete-page="handleDelete"
        :on-fetch-pages="() => $api('/api/pages/list')"
        :on-navigate-to-page="(slug: string) => router.push(`/${slug}/edit`)"
        :page-definitions="pageDefinitions"
        :resolve-page="resolvePage"
        @save="handleSave"
        @version-navigate="handleVersionSelected"
        @version-approved="handleVersionApproved"
        @version-reverted="handleVersionReverted"
        @publish="handlePublish"
      />
    </div>
  </template>
</template>

<style scoped></style>
