<script setup lang="ts">
import { type Page, type PageVersion } from "#rimelight-components/types";
import {
  convertVersionToPage,
  syncPageWithDefinition,
  getLocalizedContent,
  getPageResolutionPath,
} from "#rimelight-components/utils";
import { tv } from "tailwind-variants";
import { PAGE_MAP } from "~/types";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t, locale } = useI18n();
const { permissions } = useAuth();
const { totalHeight } = useHeaderStack();
const isAdmin = permissions.admin.canAccess;

const { registerDefinitions } = usePageRegistry();
registerDefinitions(PAGE_MAP as any);

const slugParam = route.params.slug;
const slug = computed(() => {
  if (!slugParam) return "";
  return Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
});

const versionId = computed(() => route.query.version as string);

const lookupSlug = computed(() => `franchises/grand-tale/wiki/${slug.value}`);

// Fetch the base page to get its ID and live state
const {
  data: page,
  status: pageStatus,
  error: pageError,
  refresh: refreshPage,
} = useApi<Page>(`/api/pages/find/${lookupSlug.value}`, {
  method: "GET",
  key: `review-wiki-base-${slug.value}`,
});

// Fetch the specific version data
const {
  data: versionData,
  status: versionStatus,
  error: versionError,
  refresh: refreshVersion,
} = useApi<PageVersion>(() => `/api/pages/versions/${versionId.value}`, {
  watch: [versionId],
  immediate: !!versionId.value,
});

const localPage = ref<Page | null>(null);

watch(
  [page, versionData],
  () => {
    if (versionId.value && versionData.value) {
      const converted = convertVersionToPage(versionData.value);

      const typeKey = Object.keys(PAGE_MAP).find(
        (k) => k.toLowerCase() === converted.type?.toLowerCase(),
      );
      const definition = typeKey ? (PAGE_MAP as any)[typeKey] : null;

      if (definition) {
        syncPageWithDefinition(converted, definition);
      }
      localPage.value = converted;
    } else if (page.value) {
      const cloned = JSON.parse(JSON.stringify(page.value));
      const typeKey = Object.keys(PAGE_MAP).find(
        (k) => k.toLowerCase() === cloned.type?.toLowerCase(),
      );
      const definition = typeKey ? (PAGE_MAP as any)[typeKey] : null;

      if (definition) {
        syncPageWithDefinition(cloned, definition);
      }
      localPage.value = cloned;
    }
  },
  { immediate: true },
);

// Compare logic (similar to PageEditor preview)
const showCompare = ref(false);
const leftWidth = ref(50);
const isResizing = ref(false);
const splitContainerRef = useTemplateRef<HTMLElement>("split-container");

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

const isActioning = ref<string | null>(null);

const handleApprove = async () => {
  if (!versionId.value || !isAdmin.value) return;
  isActioning.value = "approving";
  try {
    await $api(`/api/pages/versions/${versionId.value}/approve`, { method: "POST" });
    toast.add({
      color: "success",
      title: t("page_version.approved_successfully", "Version approved"),
    });
    await refreshPage();
    // Go to live page after approval
    await navigateTo(`/franchises/grand-tale/wiki/${slug.value}`);
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
  if (!versionId.value || !isAdmin.value) return;
  isActioning.value = "rejecting";
  try {
    await $api(`/api/pages/versions/${versionId.value}/reject`, { method: "POST" });
    toast.add({
      color: "success",
      title: t("page_version.rejected_successfully", "Version rejected"),
    });
    await refreshPage();
    // Go to edit page after rejection
    await navigateTo(`/franchises/grand-tale/wiki/${slug.value}/edit`);
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

const resolvePage = async (idOrSlug: string): Promise<Pick<Page, "title" | "icon" | "slug">> => {
  const url = getPageResolutionPath(idOrSlug);
  if (!url) throw new Error(`[Review] Invalid page reference: ${idOrSlug}`);

  try {
    const data = await $api<Page>(url, {
      query: { select: "title,icon,slug" },
    });
    if (!data) throw new Error(`[Review] Page not found: ${idOrSlug}`);
    return data;
  } catch (e) {
    console.warn(`[Review] Failed to resolve page: ${idOrSlug}`, e);
    throw e;
  }
};

useHead({
  title: () => `Reviewing: ${getLocalizedContent(localPage.value?.title, locale) ?? "Version"}`,
});

// Styles matching PageEditor
const reviewStyles = tv({
  slots: {
    header: "h-12 w-full bg-muted",
    headerGroup: "flex items-center gap-xs",
    splitContainer: "flex w-full min-h-0",
    editorColumn: "relative",
    resizer:
      "sticky flex flex-col items-center justify-center w-6 cursor-col-resize group px-1 py-16 self-start",
    previewColumn: "sticky self-start overflow-y-auto min-h-0",
  },
});

const {
  header: headerStyles,
  headerGroup,
  splitContainer,
  editorColumn,
  resizer,
  previewColumn,
} = reviewStyles();

const cursorClass = computed(() => {
  if (isResizing.value) return "cursor-grabbing";
  return "cursor-grab";
});
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
    :clear="{ label: 'Back to Wiki' }"
    :error="{
      status: 404,
      statusText: 'Version Not Found',
      message: 'The requested page version could not be located.',
    }"
    redirect="/franchises/grand-tale/wiki"
  />

  <template v-else>
    <RCHeaderLayer id="review-header" :order="3">
      <RCHeader :contain="false" :class="headerStyles()">
        <template #left>
          <div :class="headerGroup({ class: 'ml-4' })">
            <span
              class="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap"
            >
              Reviewing:
              <span class="text-neutral-900 dark:text-white">{{
                getLocalizedContent(localPage?.title, locale)
              }}</span>
            </span>

            <USeparator orientation="vertical" class="h-4 mx-1" />

            <RCPageVersionSelector
              v-if="page?.id"
              :page-id="page.id"
              :current-version-id="versionId"
              :is-admin="isAdmin"
              @version-selected="(v) => navigateTo({ query: { version: v.id } })"
              @version-approved="() => refreshPage()"
              @version-rejected="() => refreshPage()"
            />
          </div>
        </template>

        <template #right>
          <div :class="headerGroup({ class: 'mr-4' })">
            <UButton
              icon="lucide:external-link"
              :label="t('page_editor.view_page', 'View Page')"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="navigateTo(`/franchises/grand-tale/wiki/${slug}`)"
            />
            <UButton
              :icon="showCompare ? 'lucide:eye-off' : 'lucide:eye'"
              :label="showCompare ? 'Hide' : 'Compare'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="showCompare = !showCompare"
            />

            <USeparator orientation="vertical" class="h-4 mx-1" />

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
      </RCHeader>
    </RCHeaderLayer>

    <div ref="split-container" :class="splitContainer()">
      <!-- Reviewed Version (Left Column) -->
      <div
        :class="editorColumn()"
        :style="{
          width: showCompare ? `${leftWidth}%` : '100%',
          height: `calc(100vh - ${totalHeight}px)`,
        }"
        class="overflow-y-auto"
      >
        <RCPageRenderer
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
        :class="[cursorClass, resizer()]"
        :style="{ top: `${totalHeight}px`, height: `calc(100vh - ${totalHeight}px)` }"
        @mousedown="startResizing"
        @dblclick="leftWidth = 50"
      >
        <USeparator orientation="vertical" class="h-full" />
      </div>

      <!-- Live Version (Right Column) -->
      <div
        v-if="showCompare"
        :class="previewColumn()"
        :style="{
          width: `${100 - leftWidth}%`,
          height: `calc(100vh - ${totalHeight}px)`,
        }"
      >
        <RCPageRenderer
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

<style scoped></style>
