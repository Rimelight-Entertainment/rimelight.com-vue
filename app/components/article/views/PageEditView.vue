<script setup lang="ts">
import { type Page, type PageVersion, type PageDefinition } from "~/types";
import { getLocalizedContent, getPageResolutionPath } from "#shared/utils";

/* region Props */
export interface PageEditViewProps {
  /** The full lookup path for the page (uses /api/pages/find/) */
  lookupPath?: string;
  /** Direct URL to fetch the page from if not using lookupPath */
  fetchUrl?: string;
  /** Unique cache key for the API request */
  cacheKey: string;
  /** Page definitions map */
  pageDefinitions: Record<string, PageDefinition>;
  /** Base URL for navigation (e.g. /franchises/grand-tale/wiki) */
  baseUrl: string;
  /** Path to bind the hierarchy tree to. Falls back to baseUrl */
  hierarchyPath?: string;
  /** Whether the current user is an admin */
  isAdmin?: boolean;
  /** URL to redirect to after deletion or on error */
  backUrl?: string;
  /** Custom error message/params */
  errorRedirectParams?: {
    redirect: string;
    label: string;
    message: string;
  };
}

const {
  lookupPath,
  fetchUrl,
  cacheKey,
  pageDefinitions,
  baseUrl,
  hierarchyPath,
  isAdmin = false,
  backUrl,
  errorRedirectParams,
} = defineProps<PageEditViewProps>();
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

/* region State */
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t, locale } = useI18n();

const resolvedFetchUrl = computed(() => getPageResolutionPath(lookupPath || fetchUrl || ""));

const isSaving = ref(false);
const currentVersionId = ref<string | null>(null);
const editorRef = useTemplateRef<{ resetHistory: () => void }>("editor");

const {
  data: page,
  status: pageStatus,
  error: pageError,
  refresh: refreshPage,
} = useFetch<Page>(() => resolvedFetchUrl.value, {
  method: "GET",
  key: () => cacheKey,
  immediate: !!resolvedFetchUrl.value,
});

const localPage = ref<Page | null>(null);

watch(
  page,
  (newVal) => {
    if (newVal) {
      localPage.value = JSON.parse(JSON.stringify(newVal));
    }
  },
  { immediate: true },
);
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
const resolvePage = async (idOrSlug: string): Promise<Pick<Page, "title" | "icon" | "slug">> => {
  const url = getPageResolutionPath(idOrSlug);
  if (!url) throw new Error(`[Editor] Invalid page reference: ${idOrSlug}`);

  try {
    const data = await $fetch<Page>(url, {
      query: { select: "title,icon,slug" },
    });
    if (!data) throw new Error(`[Editor] Page not found: ${idOrSlug}`);
    return data;
  } catch (e) {
    console.warn(`[Editor] Failed to resolve page: ${idOrSlug}`, e);
    throw e;
  }
};

const fetchPages = async () => {
  const types = Object.keys(pageDefinitions).join(",");
  const prefix = (hierarchyPath ?? baseUrl).replace(/^\/|\/$/g, "");

  return $fetch<Pick<Page, "title" | "slug" | "type" | "id">[]>("/api/pages/list", {
    query: { select: "title,slug,type,id", types, prefix },
  });
};

const handleSave = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return;
  isSaving.value = true;

  try {
    await $fetch(`/api/pages/id/${updatedPage.id}`, {
      method: "PUT",
      body: updatedPage,
    });

    toast.add({ color: "success", title: t("toast_save-post_success_title") });

    // Refresh page data to update the versions selector if it's open
    await refreshPage();

    // Reset editor history
    await nextTick();
    editorRef.value?.resetHistory();
  } catch (e) {
    toast.add({ color: "error", title: t("toast_save-post_error_title") });
  } finally {
    isSaving.value = false;
  }
};

const handlePublish = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return;
  isSaving.value = true;

  try {
    await $fetch(`/api/pages/id/${updatedPage.id}/publish`, {
      method: "POST",
    });

    toast.add({ color: "success", title: t("toast_publish_success") });

    // Redirect to the live page
    await nextTick();
    const base = baseUrl.replace(/\/$/, "");
    const cleanBase = base.replace(/^\//, "");
    const slugToUse = updatedPage.slug.startsWith(cleanBase)
      ? updatedPage.slug
      : `${cleanBase}/${updatedPage.slug}`;
    await navigateTo(`/${slugToUse}`);
  } catch (e) {
    toast.add({ color: "error", title: t("toast_publish_error") });
  } finally {
    isSaving.value = false;
  }
};

const handleUnpublish = async (updatedPage: Page): Promise<void> => {
  if (!updatedPage.id) return;
  isSaving.value = true;

  try {
    await $fetch(`/api/pages/id/${updatedPage.id}/unpublish`, {
      method: "POST",
    });

    toast.add({
      color: "success",
      title: t("toast_unpublish_success", "Successfully unpublished"),
    });

    await refreshPage();
  } catch (e) {
    toast.add({ color: "error", title: t("toast_unpublish_error", "Failed to unpublish") });
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = async (id: string) => {
  try {
    await $fetch(`/api/pages/id/${id}`, {
      method: "DELETE",
    });

    toast.add({ color: "success", title: t("toast_delete_success") });

    if (backUrl) {
      await router.push(backUrl);
    } else {
      await router.push(baseUrl);
    }
  } catch (e) {
    toast.add({ color: "error", title: t("toast_delete_error") });
  }
};

const handleVersionNavigate = async (version: PageVersion) => {
  if (!version?.id || !localPage.value?.slug) return;

  const base = baseUrl.replace(/\/$/, "");
  const cleanBase = base.replace(/^\//, "");
  const slugToUse = localPage.value.slug.startsWith(cleanBase)
    ? localPage.value.slug
    : `${cleanBase}/${localPage.value.slug}`;

  await navigateTo({
    path: `/${slugToUse}/review`,
    query: { version: version.id },
  });
};

const handleNavigateToPage = async (slug: string) => {
  const base = baseUrl.replace(/\/$/, "");
  const cleanBase = base.replace(/^\//, "");
  const slugToUse = slug.startsWith(cleanBase) ? slug : `${cleanBase}/${slug}`;

  await navigateTo(`/${slugToUse}/edit`);
};

const handleVersionApproved = async (version: PageVersion) => {
  await refreshPage();

  if (currentVersionId.value === version.id) {
    currentVersionId.value = null;
    localPage.value = JSON.parse(JSON.stringify(page.value));
    await nextTick();
    editorRef.value?.resetHistory();
  }
};

const handleVersionRejected = async (version: PageVersion) => {
  if (currentVersionId.value === version.id) {
    currentVersionId.value = null;
    localPage.value = JSON.parse(JSON.stringify(page.value));
    await nextTick();
    editorRef.value?.resetHistory();
  }
};

const handleVersionReverted = async (version: PageVersion) => {
  await refreshPage();
  currentVersionId.value = null;
  localPage.value = JSON.parse(JSON.stringify(page.value));
  await nextTick();
  editorRef.value?.resetHistory();
};
/* endregion */
</script>

<template>
  <USkeleton v-if="pageStatus === 'pending'" class="h-full w-full" />

  <LazyUError
    v-else-if="pageError || !page"
    :clear="{ label: errorRedirectParams?.label || 'Back' }"
    :error="{
      status: 404,
      statusText: 'Page Not Found',
      message: errorRedirectParams?.message || 'The requested page could not be located.',
    }"
    :redirect="errorRedirectParams?.redirect || baseUrl"
  />

  <template v-else-if="localPage && localPage.id">
    <RLPageEditor
      ref="editor"
      v-model="localPage"
      v-model:current-version-id="currentVersionId"
      :is-saving="isSaving"
      :is-admin="isAdmin"
      :base-path="(hierarchyPath ?? baseUrl).replace(/^\/|\/$/g, '')"
      :page-definitions="pageDefinitions"
      :resolve-page="resolvePage"
      :on-fetch-pages="fetchPages"
      :on-delete-page="handleDelete"
      :on-navigate-to-page="handleNavigateToPage"
      @save="handleSave"
      @publish="handlePublish"
      @unpublish="handleUnpublish"
      @version-navigate="handleVersionNavigate"
      @version-approved="handleVersionApproved"
      @version-rejected="handleVersionRejected"
      @version-reverted="handleVersionReverted"
    />
  </template>
</template>
