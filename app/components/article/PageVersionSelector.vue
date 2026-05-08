<script lang="ts" setup>
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@nuxt/ui/composables/useToast";
import { computed, ref, watch } from "vue";
import { useRC } from "#composables";
import { useI18n } from "vue-i18n";
import { tv } from "../../internal/tv";
import type { PageVersion } from "#types";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface PageVersionSelectorProps {
  pageId: string;
  isAdmin?: boolean;
  rc?: {
    root?: string;
    button?: string;
    popover?: string;
    versionItem?: string;
  };
}

const { pageId, isAdmin = false, rc: rcProp } = defineProps<PageVersionSelectorProps>();

const { rc } = useRC("PageVersionSelector", rcProp);
/* endregion */

/* region Emits */
export interface PageVersionSelectorEmits {
  "version-selected": [version: PageVersion];
  "version-approved": [version: PageVersion];
  "version-rejected": [version: PageVersion];
  "version-reverted": [version: PageVersion];
}

const emit = defineEmits<PageVersionSelectorEmits>();
/* endregion */

/* region Slots */
export interface PageVersionSelectorSlots {}

const slots = defineSlots<PageVersionSelectorSlots>();
/* endregion */

/* region Styles */
const pageVersionSelectorStyles = tv({
  slots: {
    root: "",
    buttonClass: "",
    popoverClass: "w-80 p-2",
    versionItemClass: "px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded",
    popoverHeader: "px-3 py-2 border-b border-gray-200 dark:border-gray-800",
    popoverTitle: "text-sm font-semibold",
    popoverSubtitle: "text-xs text-gray-500 dark:text-gray-400 mt-1",
    versionsList: "max-h-96 overflow-y-auto",
    liveVersionItem: "flex items-center justify-between",
    liveBadgeWrapper: "flex items-center gap-2",
    liveVersionTitle: "text-sm font-medium",
    liveVersionSubtitle: "text-xs text-gray-500 dark:text-gray-400 mt-1",
    loadingWrapper: "px-3 py-4 text-center",
    emptyWrapper: "px-3 py-4 text-center text-sm text-gray-500",
    versionEntries: "divide-y divide-gray-200 dark:divide-gray-800",
    versionEntryWrapper: "flex items-start justify-between gap-2",
    versionEntryContent: "flex-1 min-w-0",
    versionEntryHeader: "flex items-center gap-2 mb-1",
    versionEntryTime: "text-xs text-gray-500 dark:text-gray-400",
    versionEntryTitle: "text-xs text-gray-600 dark:text-gray-300 truncate",
    versionEntryApproval: "text-xs text-gray-500 dark:text-gray-400 mt-1",
    versionEntryActions: "shrink-0 flex items-center gap-1",
    pendingFooter: "px-3 py-2 border-t border-gray-200 dark:border-gray-800 mt-2",
    pendingText: "text-xs text-gray-500 dark:text-gray-400",
  },
});

const {
  root,
  buttonClass,
  popoverClass,
  versionItemClass,
  popoverHeader,
  popoverTitle,
  popoverSubtitle,
  versionsList,
  liveVersionItem,
  liveBadgeWrapper,
  liveVersionTitle,
  liveVersionSubtitle,
  loadingWrapper,
  emptyWrapper,
  versionEntries,
  versionEntryWrapper,
  versionEntryContent,
  versionEntryHeader,
  versionEntryTime,
  versionEntryTitle,
  versionEntryApproval,
  versionEntryActions,
  pendingFooter,
  pendingText,
} = pageVersionSelectorStyles();
type PageVersionSelectorVariants = VariantProps<typeof pageVersionSelectorStyles>;
/* endregion */

/* region State */
const selectedVersionId = defineModel<string | null>("currentVersionId", {
  default: null,
});

const versions = ref<PageVersion[]>([]);
const isLoading = ref(false);
const isApproving = ref<string | null>(null);
const isRejecting = ref<string | null>(null);
const isReverting = ref<string | null>(null);
const isOpen = ref(false);

const toast = useToast();
const { t } = useI18n();

const pendingVersions = computed(() => {
  return versions.value.filter((v) => v.status === "pending");
});

const currentVersionStatus = computed(() => {
  if (!selectedVersionId.value) return "approved";
  const v = versions.value.find((v) => v.id === selectedVersionId.value);
  return v?.status || "pending";
});

const currentVersion = computed(() => versions.value.find((v) => v.id === selectedVersionId.value));
/* endregion */

/* region Meta */
defineOptions({
  name: "PageVersionSelector",
});
/* endregion */

/* region Lifecycle */
watch(
  () => pageId,
  () => {
    if (pageId) fetchVersions();
  },
  { immediate: true },
);

// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
async function fetchVersions() {
  if (!pageId) return;

  isLoading.value = true;
  try {
    versions.value = await $fetch<PageVersion[]>(`/api/pages/id/${pageId}/versions`);
  } catch (error) {
    console.error("Failed to fetch versions:", error);
    try {
      toast.add({ color: "error", title: t("page_version.failed_to_load") });
    } catch (e) {}
  } finally {
    isLoading.value = false;
  }
}

function selectVersion(version: PageVersion) {
  selectedVersionId.value = version.id;
  emit("version-selected", version);
  isOpen.value = false;
}

async function approveVersion(version: PageVersion) {
  if (!isAdmin) return;

  isApproving.value = version.id;
  try {
    const result = await $fetch<{ message?: string }>(`/api/pages/versions/${version.id}/approve`, {
      method: "POST",
    });

    try {
      toast.add({
        color: "success",
        title: t("page_version.approved_successfully"),
        description: result?.message || "The page has been updated with the approved version",
      });
    } catch (e) {}

    emit("version-approved", version);
    await fetchVersions();

    if (selectedVersionId.value === version.id) {
      selectedVersionId.value = null;
    }
  } catch (error: any) {
    console.error("Failed to approve version:", error);
    try {
      toast.add({
        color: "error",
        title: t("page_version.failed_to_approve"),
        description: error.message || "An error occurred",
      });
    } catch (e) {}
  } finally {
    isApproving.value = null;
  }
}

async function rejectVersion(version: PageVersion) {
  if (!isAdmin) return;

  isRejecting.value = version.id;
  try {
    const result = await $fetch<{ message?: string }>(`/api/pages/versions/${version.id}/reject`, {
      method: "POST",
    });

    try {
      toast.add({
        color: "success",
        title: t("page_version.rejected_successfully", "Version rejected"),
        description: result?.message || "the version has been rejected",
      });
    } catch (e) {}

    emit("version-rejected", version);
    await fetchVersions();
  } catch (error: any) {
    console.error("Failed to reject version:", error);
    try {
      toast.add({
        color: "error",
        title: t("page_version.failed_to_reject", "Failed to reject version"),
        description: error.message || "An error occurred",
      });
    } catch (e) {}
  } finally {
    isRejecting.value = null;
  }
}

async function revertVersion(version: PageVersion) {
  if (!isAdmin) return;

  isReverting.value = version.id;
  try {
    const result = await $fetch<{ message?: string }>(`/api/pages/versions/${version.id}/revert`, {
      method: "POST",
    });

    try {
      toast.add({
        color: "success",
        title: t("page_version.reverted_successfully"),
        description: result?.message || "The page has been reverted to this version.",
      });
    } catch (e) {}

    emit("version-reverted", version);
    await fetchVersions();
    selectedVersionId.value = null;
  } catch (error: any) {
    console.error("Failed to revert version:", error);
    try {
      toast.add({
        color: "error",
        title: t("page_version.failed_to_revert"),
        description: error.message || "An error occurred",
      });
    } catch (e) {}
  } finally {
    isReverting.value = null;
  }
}

function selectLiveVersion() {
  selectedVersionId.value = null;
  isOpen.value = false;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
}

defineExpose({
  approveVersion,
  rejectVersion,
  revertVersion,
  fetchVersions,
  currentVersionStatus,
  currentVersion,
});
/* endregion */
</script>

<template>
  <UPopover
    v-model:open="isOpen"
    :popper="{ placement: 'bottom-start' }"
    :class="root({ class: rc.root })"
  >
    <UButton
      :loading="isLoading"
      color="neutral"
      icon="lucide:git-branch"
      :label="t('common.versions')"
      size="xs"
      variant="ghost"
      :class="buttonClass({ class: rc.button })"
    />

    <template #content>
      <div :class="popoverClass({ class: rc.popover })">
        <div :class="popoverHeader()">
          <h3 :class="popoverTitle()">Page Versions</h3>
          <p :class="popoverSubtitle()">View and manage page versions</p>
        </div>

        <div :class="versionsList()">
          <div
            :class="[
              versionItemClass({ class: rc.versionItem }),
              { 'bg-primary-50 dark:bg-primary-900/20': !selectedVersionId },
            ]"
            @click="selectLiveVersion"
          >
            <div :class="liveVersionItem()">
              <div class="flex-1">
                <div :class="liveBadgeWrapper()">
                  <UBadge color="success" size="xs"> Live </UBadge>
                  <span :class="liveVersionTitle()">Current Version</span>
                </div>
                <p :class="liveVersionSubtitle()">The published version of this page</p>
              </div>
            </div>
          </div>

          <div v-if="isLoading" :class="loadingWrapper()">
            <USkeleton class="h-4 w-full mb-2" />
            <USkeleton class="h-3 w-3/4" />
          </div>

          <div v-else-if="versions.length === 0" :class="emptyWrapper()">No versions yet</div>

          <div v-else :class="versionEntries()">
            <div
              v-for="version in versions"
              :key="version.id"
              :class="[
                versionItemClass({ class: rc.versionItem }),
                { 'bg-primary-50 dark:bg-primary-900/20': selectedVersionId === version.id },
              ]"
              @click="selectVersion(version)"
            >
              <div :class="versionEntryWrapper()">
                <div :class="versionEntryContent()">
                  <div :class="versionEntryHeader()">
                    <UBadge :color="getStatusColor(version.status)" size="xs">
                      {{ version.status }}
                    </UBadge>
                    <span :class="versionEntryTime()">
                      {{ formatDate(version.createdAt) }}
                    </span>
                  </div>
                  <p :class="versionEntryTitle()">
                    {{ version.title?.en || version.title || "Untitled" }}
                  </p>
                  <p
                    v-if="version.approvedBy && version.approvedAt"
                    :class="versionEntryApproval()"
                  >
                    Approved {{ formatDate(version.approvedAt) }}
                  </p>
                </div>

                <div
                  v-if="selectedVersionId === version.id && isAdmin"
                  :class="versionEntryActions()"
                >
                  <UButton
                    :loading="isReverting === version.id"
                    color="warning"
                    icon="lucide:rotate-ccw"
                    size="xs"
                    title="Revert to this version"
                    variant="ghost"
                    @click.stop="revertVersion(version)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pendingVersions.length > 0 && isAdmin" :class="pendingFooter()">
          <p :class="pendingText()">
            {{ pendingVersions.length }} pending version{{
              pendingVersions.length !== 1 ? "s" : ""
            }}
            awaiting approval
          </p>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style scoped></style>
