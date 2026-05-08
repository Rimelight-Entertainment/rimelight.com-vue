<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from "vue";
import { type Page, type PageVersion, type PageDefinition } from "#types";
import {
  convertVersionToPage,
  syncPageWithDefinition,
  getLocalizedContent,
  getPageResolutionPath,
} from "#utils";
import { usePageRegistry, useHeaderStack, useRC } from "#composables";
import { useI18n } from "vue-i18n";
import { useToast } from "@nuxt/ui/composables/useToast";
import { tv } from "../../../internal/tv";

/* region Props */
export interface PageReviewViewProps {
  /** The full lookup path for the page (e.g. franchises/grand-tale/wiki/my-page) */
  lookupPath: string;
  /** Current version ID being reviewed */
  versionId?: string | null;
  /** Page definitions map */
  pageDefinitions: Record<string, PageDefinition>;
  /** Base URL for navigation (e.g. /franchises/grand-tale/wiki) */
  baseUrl: string;
  /** Whether the current user is an admin who can approve/reject */
  isAdmin?: boolean;
  /** Custom RL styles */
  rc?: {
    header?: string;
    headerGroup?: string;
    splitContainer?: string;
    editorColumn?: string;
    resizer?: string;
    previewColumn?: string;
    headerText?: string;
    headerHighLight?: string;
    headerSeparator?: string;
  };
}

const {
  lookupPath,
  versionId,
  pageDefinitions,
  baseUrl,
  isAdmin = false,
  rc: rcProp,
} = defineProps<PageReviewViewProps>();

const { rc } = useRC("PageReviewView", rcProp);
/* endregion */

/* region Emits */
export interface PageReviewViewEmits {
  approved: [version: PageVersion];
  rejected: [version: PageVersion];
}

const emit = defineEmits<PageReviewViewEmits>();
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
const reviewStyles = tv({
  slots: {
    header: "h-12 w-full bg-muted",
    headerGroup: "flex items-center gap-xs",
    splitContainer: "flex w-full min-h-0",
    editorColumn: "relative",
    resizer:
      "sticky flex flex-col items-center justify-center w-6 cursor-col-resize group px-1 py-16 self-start",
    previewColumn: "sticky self-start overflow-y-auto min-h-0",
    headerText: "text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap",
    headerHighLight: "text-neutral-900 dark:text-white",
    headerSeparator: "h-4 mx-1",
  },
});

const {
  header: headerStyles,
  headerGroup,
  splitContainer,
  editorColumn,
  resizer,
  previewColumn,
  headerText,
  headerHighLight,
  headerSeparator,
} = reviewStyles();
/* endregion */

/* region State */
const { t, locale } = useI18n();
const { totalHeight } = useHeaderStack();
const { registerDefinitions } = usePageRegistry();
const toast = useToast();
const route = useRoute();

registerDefinitions(pageDefinitions);

// Fetch the base page
const {
  data: page,
  status: pageStatus,
  error: pageError,
  refresh: refreshPage,
} = useFetch<Page>(() => getPageResolutionPath(lookupPath), {
  method: "GET",
  key: `review-base-${lookupPath}`,
});

// Fetch the specific version data
const {
  data: versionData,
  status: versionStatus,
  error: versionError,
  refresh: refreshVersion,
} = useFetch<PageVersion>(() => (versionId ? `/api/pages/versions/${versionId}` : ""), {
  watch: [() => versionId],
  immediate: !!versionId,
});

const localPage = ref<Page | null>(null);

watch(
  [page, versionData],
  () => {
    if (versionId && versionData.value) {
      const converted = convertVersionToPage(versionData.value);

      const typeKey = Object.keys(pageDefinitions).find(
        (k) => k.toLowerCase() === converted.type?.toLowerCase(),
      );
      const definition = typeKey ? pageDefinitions[typeKey] : null;

      if (definition) {
        syncPageWithDefinition(converted, definition);
      }
      localPage.value = converted;
    } else if (page.value) {
      const cloned = JSON.parse(JSON.stringify(page.value));
      const typeKey = Object.keys(pageDefinitions).find(
        (k) => k.toLowerCase() === cloned.type?.toLowerCase(),
      );
      const definition = typeKey ? pageDefinitions[typeKey] : null;

      if (definition) {
        syncPageWithDefinition(cloned, definition);
      }
      localPage.value = cloned;
    }
  },
  { immediate: true },
);

// Compare logic
const showCompare = ref(false);
const leftWidth = ref(50);
const isResizing = ref(false);
const splitContainerRef = useTemplateRef<HTMLElement>("split-container");

const isActioning = ref<string | null>(null);
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
const resolvePage = async (idOrSlug: string): Promise<Pick<Page, "title" | "icon" | "slug">> => {
  const url = getPageResolutionPath(idOrSlug);
  if (!url) throw new Error(`[Review] Invalid page reference: ${idOrSlug}`);

  try {
    const data = await $fetch<Page>(url, {
      query: { select: "title,icon,slug" },
    });
    if (!data) throw new Error(`[Review] Page not found: ${idOrSlug}`);
    return data;
  } catch (e) {
    console.warn(`[Review] Failed to resolve page: ${idOrSlug}`, e);
    throw e;
  }
};

const startResizing = () => {
  isResizing.value = true;
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopResizing);
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isResizing.value || !splitContainerRef.value) return;

  const containerRect = splitContainerRef.value.getBoundingClientRect();
  let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

  // Constrain bounds
  newWidth = Math.min(Math.max(newWidth, 20), 80);

  // Snap logic
  if (Math.abs(newWidth - 50) < 1.5) {
    leftWidth.value = 50;
  } else {
    leftWidth.value = newWidth;
  }
};

const stopResizing = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopResizing);
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
};

const handleApprove = async () => {
  if (!versionId || !isAdmin) return;
  isActioning.value = "approving";
  try {
    await $fetch(`/api/pages/versions/${versionId}/approve`, { method: "POST" });
    toast.add({
      color: "success",
      title: t("page_version.approved_successfully", "Version approved"),
    });
    await refreshPage();
    emit("approved", versionData.value!);
    // Default navigation to live page
    if (page.value?.slug) {
      const base = baseUrl.replace(/\/$/, "");
      const cleanBase = base.replace(/^\//, "");
      const slugToUse = page.value.slug.startsWith(cleanBase)
        ? page.value.slug
        : `${cleanBase}/${page.value.slug}`;
      await navigateTo(`/${slugToUse}`);
    }
  } catch (e: any) {
    toast.add({
      color: "error",
      title: t("page_version.failed_to_approve", "Failed to approve"),
      description: e.message,
    });
  } finally {
    isActioning.value = null;
  }
};

const handleReject = async () => {
  if (!versionId || !isAdmin) return;
  isActioning.value = "rejecting";
  try {
    await $fetch(`/api/pages/versions/${versionId}/reject`, { method: "POST" });
    toast.add({
      color: "success",
      title: t("page_version.rejected_successfully", "Version rejected"),
    });
    await refreshPage();
    emit("rejected", versionData.value!);
    // Default navigation to edit page
    if (page.value?.slug) {
      const base = baseUrl.replace(/\/$/, "");
      const cleanBase = base.replace(/^\//, "");
      const slugToUse = page.value.slug.startsWith(cleanBase)
        ? page.value.slug
        : `${cleanBase}/${page.value.slug}`;
      await navigateTo(`/${slugToUse}/edit`);
    }
  } catch (e: any) {
    toast.add({
      color: "error",
      title: t("page_version.failed_to_reject", "Failed to reject"),
      description: e.message,
    });
  } finally {
    isActioning.value = null;
  }
};

const cursorClass = computed(() => {
  if (isResizing.value) return "cursor-grabbing";
  return "cursor-grab";
});

const relativeSlug = computed(() => {
  if (page.value?.slug) return page.value.slug;
  const base = baseUrl.replace(/^\/|\/$/g, "");
  return lookupPath.replace(base, "").replace(/^\/|\/$/g, "");
});
/* endregion */
</script>

<template>
  <div
    v-if="pageStatus === 'pending' || (versionId && versionStatus === 'pending')"
    class="h-full w-full py-20 px-4"
  >
    <USkeleton class="h-12 w-3/4 mb-4" />
    <USkeleton class="h-64 w-full mb-8" />
    <USkeleton class="h-48 w-full" />
  </div>

  <LazyUError
    v-else-if="pageError || versionError || !localPage"
    :clear="{ label: 'Back' }"
    :error="{
      status: 404,
      statusText: 'Version Not Found',
      message: 'The requested page version could not be located.',
    }"
    :redirect="baseUrl"
  />

  <template v-else>
    <RLHeaderLayer id="review-header" :order="3">
      <RLHeader :contain="false" :class="headerStyles({ class: rc.header })">
        <template #left>
          <div :class="headerGroup({ class: [rc.headerGroup, 'ml-4'] })">
            <span :class="headerText({ class: rc.headerText })">
              Reviewing:
              <span :class="headerHighLight({ class: rc.headerHighLight })">{{
                getLocalizedContent(localPage?.title, locale)
              }}</span>
            </span>

            <USeparator
              orientation="vertical"
              :class="headerSeparator({ class: rc.headerSeparator })"
            />

            <RLPageVersionSelector
              v-if="page?.id"
              :page-id="page.id"
              :current-version-id="versionId || undefined"
              :is-admin="isAdmin"
              @version-selected="
                (v: PageVersion) => navigateTo({ query: { ...route.query, version: v.id } })
              "
              @version-approved="() => refreshPage()"
              @version-rejected="() => refreshPage()"
            />
          </div>
        </template>

        <template #right>
          <div :class="headerGroup({ class: [rc.headerGroup, 'mr-4'] })">
            <UButton
              icon="lucide:external-link"
              :label="t('page_editor.view_page', 'View Page')"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="navigateTo(`/${relativeSlug}`)"
            />
            <UButton
              :icon="showCompare ? 'lucide:eye-off' : 'lucide:eye'"
              :label="showCompare ? 'Hide' : 'Compare'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="showCompare = !showCompare"
            />

            <USeparator
              orientation="vertical"
              :class="headerSeparator({ class: rc.headerSeparator })"
            />

            <template v-if="isAdmin && versionId && versionData?.status === 'pending'">
              <UButton
                icon="lucide:x"
                :label="t('common.reject', 'Reject')"
                color="error"
                variant="soft"
                size="xs"
                :loading="isActioning === 'rejecting'"
                @click="handleReject"
              />
              <UButton
                icon="lucide:check"
                :label="t('common.approve', 'Approve Version')"
                color="primary"
                size="xs"
                variant="solid"
                :loading="isActioning === 'approving'"
                @click="handleApprove"
              />
            </template>
            <template v-else-if="versionId && versionData?.status === 'approved'">
              <UBadge color="success" size="xs" variant="soft">Version Already Approved</UBadge>
            </template>
            <template v-else-if="versionId && versionData?.status === 'rejected'">
              <UBadge color="error" size="xs" variant="soft">Version Rejected</UBadge>
            </template>
          </div>
        </template>
      </RLHeader>
    </RLHeaderLayer>

    <div ref="split-container" :class="splitContainer({ class: rc.splitContainer })">
      <!-- Reviewed Version (Left Column) -->
      <div
        :class="editorColumn({ class: rc.editorColumn })"
        :style="{
          width: showCompare ? `${leftWidth}%` : '100%',
          height: `calc(100vh - ${totalHeight}px)`,
        }"
        class="overflow-y-auto"
      >
        <RLPageRenderer
          v-if="localPage"
          :key="versionId || 'live'"
          v-model="localPage"
          :resolve-page="resolvePage"
          class="h-full"
        />
      </div>

      <!-- Resizer -->
      <div
        v-if="showCompare"
        :class="[cursorClass, resizer({ class: rc.resizer })]"
        :style="{ top: `${totalHeight}px`, height: `calc(100vh - ${totalHeight}px)` }"
        @mousedown="startResizing"
        @dblclick="leftWidth = 50"
      >
        <USeparator orientation="vertical" class="h-full" />
      </div>

      <!-- Live Version (Right Column) -->
      <div
        v-if="showCompare"
        :class="previewColumn({ class: rc.previewColumn })"
        :style="{
          width: `${100 - leftWidth}%`,
          height: `calc(100vh - ${totalHeight}px)`,
        }"
      >
        <RLPageRenderer
          v-if="page"
          :key="'live-base-' + page.id"
          :model-value="page"
          :resolve-page="resolvePage"
          class="opacity-70 grayscale-[0.2] pointer-events-none select-none h-full"
        />
      </div>
    </div>
  </template>
</template>
