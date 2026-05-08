<script setup lang="ts">
import { type Page } from "~/types";
import { getLocalizedContent, getPageResolutionPath } from "#shared/utils";

/* region Props */
export interface PageLiveViewProps {
  /** The full lookup path for the page (uses /api/pages/find/) */
  lookupPath?: string;
  /** Direct URL to fetch the page from if not using lookupPath */
  fetchUrl?: string;
  /** Unique cache key for the API request */
  cacheKey: string;
  /** Base URL for navigation (e.g. /franchises/grand-tale/wiki) */
  baseUrl: string;
  /** Whether the current user can edit the page */
  canEdit?: boolean;
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
  baseUrl,
  canEdit = false,
  errorRedirectParams,
} = defineProps<PageLiveViewProps>();
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

/* region State */
const { locale } = useI18n();
const appConfig = useAppConfig();
const route = useRoute();

const resolvedFetchUrl = computed(() => getPageResolutionPath(lookupPath || fetchUrl || ""));

const {
  data: page,
  status: pageStatus,
  error: pageError,
} = await useFetch<Page>(() => resolvedFetchUrl.value, {
  key: cacheKey,
  immediate: !!resolvedFetchUrl.value,
});

const resolvePage = async (id: string) => {
  return $fetch<Page>(`/api/pages/id/${id}`, {
    query: { select: "title,icon,slug" },
  });
};

const editUrl = computed(() => {
  const base = baseUrl.replace(/\/$/, "");

  if (page.value?.slug) {
    const slug = page.value.slug;
    const cleanBase = base.replace(/^\//, "");
    if (slug.startsWith(cleanBase)) {
      return `/${slug}/edit`;
    }
    return `${base}/${slug}/edit`;
  }

  const s = route.params.slug;
  const slugParam = Array.isArray(s) ? s.join("/") : (s as string);
  if (!slugParam) return `${base}/edit`;
  return `${base}/${slugParam}/edit`;
});

// SEO
useHead({
  title: () => (getLocalizedContent(page.value?.title, locale) ?? appConfig.title) as string,
});

useSeoMeta({
  title: () => (getLocalizedContent(page.value?.title, locale) ?? appConfig.title) as string,
  ogTitle: () => (getLocalizedContent(page.value?.title, locale) ?? appConfig.title) as string,
  description: () =>
    (getLocalizedContent(page.value?.description, locale) ?? appConfig.description) as string,
  ogDescription: () =>
    (getLocalizedContent(page.value?.description, locale) ?? appConfig.description) as string,
});
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
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

  <RLPageRenderer
    v-else
    v-model="page"
    :resolve-page="resolvePage"
    :can-edit="canEdit"
    :edit-url="editUrl"
  />
</template>
