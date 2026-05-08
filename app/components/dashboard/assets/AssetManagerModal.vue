<script lang="ts" setup>
import type { TreeItem } from "@nuxt/ui";
import draggable from "vuedraggable/src/vuedraggable";
import { useClipboard } from "@vueuse/core";
import { tv } from "../../../internal/tv";

/* region Props */
export interface AssetManagerModalProps {
  rc?: {
    root?: string;
  };
  selectionMode?: boolean;
}

const { rc: rcProp, selectionMode = false } = defineProps<AssetManagerModalProps>();
const { rc } = useRC("AssetManagerModal", rcProp);
const { t } = useI18n();
const { copy } = useClipboard();
const toast = useToast();
const route = useRoute();
const appConfig = useAppConfig();
/* endregion */

/* region Emits */
export interface AssetManagerModalEmits {
  close: [];
  select: [key: string];
}

const emit = defineEmits<AssetManagerModalEmits>();
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
const assetManagerStyles = tv({
  slots: {
    root: "flex flex-col h-[70vh] w-full overflow-hidden",
    main: "flex flex-1 min-h-0 overflow-hidden",
    sidebar: "w-64 border-r border-default flex flex-col overflow-hidden bg-elevated/30",
    sidebarContent: "flex-1 overflow-y-auto p-sm",
    sidebarFooter: "p-sm border-t border-default bg-elevated/50",
    content: "flex-1 flex flex-col min-w-0 overflow-hidden",
    toolbar:
      "p-sm border-b border-default flex items-center justify-between bg-elevated/10 shrink-0",
    grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-md p-md overflow-y-auto flex-1 min-h-0 items-start content-start",
    item: "group relative aspect-square flex flex-col gap-xs p-sm rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 transition-colors bg-neutral-100/50 dark:bg-neutral-900 overflow-hidden",
    preview:
      "flex-1 min-h-0 w-full rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center",
    previewImage: "w-full h-full object-contain",
    itemInfo: "flex flex-col gap-none overflow-hidden shrink-0",
    itemLabel: "text-[11px] font-semibold truncate leading-tight",
    itemSize: "text-[10px] text-dimmed",
    actions:
      "absolute top-sm right-sm flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded-md backdrop-blur-sm",
  },
});

const {
  root,
  main,
  sidebar,
  sidebarContent,
  sidebarFooter,
  content,
  toolbar,
  grid,
  item,
  preview,
  previewImage,
  itemInfo,
  itemLabel,
  itemSize,
  actions,
} = assetManagerStyles();
/* endregion */

/* region State */
interface TreeItemExtended extends TreeItem {
  fullPath: string;
  children?: TreeItemExtended[];
}

const open = defineModel<boolean>("open", { default: false });
const { permissions: authPermissions } = useAuth();

const {
  assets,
  status,
  selectedPath,
  selectedKeys,
  localFolders,
  isProcessing,
  refresh,
  uploadAsset,
  deleteAsset,
  moveAsset,
  batchDelete,
  downloadAsset,
  addLocalFolder,
  splitFilename,
} = useAssetManagement();

const isDragging = ref(false);
const draggedItem = ref<any>(null);
const dropTarget = ref<any>(null);

const breadcrumbs = computed(() => {
  const crumbs = [{ label: "Root", path: "" }];
  if (selectedPath.value) {
    const parts = selectedPath.value.split("/");
    let currentPath = "";
    parts.forEach((part) => {
      currentPath += (currentPath ? "/" : "") + part;
      crumbs.push({ label: part, path: currentPath });
    });
  }
  return crumbs;
});

// --- New Folder State ---
const showNewFolderModal = ref(false);
const newFolderName = ref("");

// --- Upload State ---
const showUploadModal = ref(false);
const pendingFiles = ref<File[]>([]);
const uploadFileBasename = ref("");
const uploadFileExtension = ref("");
const uploadTargetFolder = ref("");

// --- Move/Rename State ---
const showMoveModal = ref(false);
const movingAsset = ref<any>(null);
const moveTargetBasename = ref("");
const moveTargetFolder = ref("");

const fileInput = ref<HTMLInputElement | null>(null);

const modalUploadTargetValue = computed({
  get: () => findNodeByPath(uploadTargetFolder.value, treeItems.value) || treeItems.value[0],
  set: (val: any) => {
    const selected = Array.isArray(val) ? val[0] : val;
    if (!selected) return;
    const path = typeof selected === "object" ? (selected.fullPath ?? "") : selected;
    uploadTargetFolder.value = path === "Root" ? "" : path;
  },
});

const modalMoveTargetValue = computed({
  get: () => findNodeByPath(moveTargetFolder.value, treeItems.value) || treeItems.value[0],
  set: (val: any) => {
    const selected = Array.isArray(val) ? val[0] : val;
    if (!selected) return;
    const path = typeof selected === "object" ? (selected.fullPath ?? "") : selected;
    moveTargetFolder.value = path === "Root" ? "" : path;
  },
});

const treeItems = computed<TreeItemExtended[]>(() => {
  const rootNode: TreeItemExtended[] = [
    {
      label: "Root",
      fullPath: "",
      icon: "lucide:home",
      defaultExpanded: true,
      children: [],
    },
  ];

  if (!assets.value) return rootNode;

  const foldersSet = new Set<string>();

  assets.value.forEach((asset) => {
    const parts = asset.key.split("/");
    if (parts.length > 1) {
      let currentPath = "";
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += (currentPath ? "/" : "") + parts[i];
        if (currentPath) foldersSet.add(currentPath);
      }
    }
  });

  localFolders.value.forEach((f) => {
    if (f && typeof f === "string") foldersSet.add(f);
  });

  const sortedFolders = Array.from(foldersSet).sort();

  const findOrCreateNode = (
    parent: TreeItemExtended[],
    path: string,
    label: string,
  ): TreeItemExtended => {
    let node = parent.find((n) => n.label === label);
    if (!node) {
      node = {
        label,
        fullPath: path,
        children: [],
      };
      parent.push(node);
    }
    return node;
  };

  sortedFolders.forEach((folderPath) => {
    if (typeof folderPath !== "string") return;
    const parts = folderPath.split("/");
    const first = rootNode[0];
    if (!first || !first.children) return;

    let currentLevel = first.children as TreeItemExtended[];
    let currentFullPath = "";

    parts.forEach((part) => {
      currentFullPath += (currentFullPath ? "/" : "") + part;
      const node = findOrCreateNode(currentLevel, currentFullPath, part);
      currentLevel = node.children as TreeItemExtended[];
    });
  });

  return rootNode;
});

const currentNode = computed(() => {
  return findNodeByPath(selectedPath.value, treeItems.value) || treeItems.value[0];
});

const activeTreeValue = computed({
  get: () => currentNode.value,
  set: (val: any) => {
    const selected = Array.isArray(val) ? val[0] : val;
    if (!selected) return;
    const path = typeof selected === "object" ? (selected.fullPath ?? "") : selected;
    selectedPath.value = path === "Root" ? "" : path;
  },
});

const gridItems = computed(() => {
  const folders =
    currentNode.value?.children?.map((n) => ({
      key: n.fullPath,
      label: n.label,
      type: "folder" as const,
    })) || [];

  const assetsInDir =
    assets.value
      ?.filter((asset) => {
        const parts = asset.key.split("/");
        const assetPath = parts.slice(0, -1).join("/");
        return assetPath === selectedPath.value;
      })
      .map((a) => ({ ...a, type: "asset" as const })) || [];

  return [...folders, ...assetsInDir];
});

const localGridItems = ref<any[]>([]);
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
watch(
  gridItems,
  (val) => {
    localGridItems.value = [...val];
  },
  { immediate: true },
);

watch(open, (isOpen) => {
  if (isOpen) refresh();
});
/* endregion */

/* region Logic */
function findNodeByPath(path: string, nodes: TreeItemExtended[]): TreeItemExtended | undefined {
  const normalizedPath = path === "/" || path === "Root" || !path ? "" : path;
  for (const node of nodes) {
    if (node.fullPath === normalizedPath) return node;
    if (node.children?.length) {
      const found = findNodeByPath(normalizedPath, node.children);
      if (found) return found;
    }
  }
  return undefined;
}

function triggerFilePicker() {
  fileInput.value?.click();
}

function handleFileSelected(event: Event | { target: { files: File | File[] } }) {
  const filesInput = (event.target as any).files;
  if (!filesInput) return;

  const filesList = Array.isArray(filesInput) ? filesInput : Array.from(filesInput as FileList);
  if (filesList.length > 0) {
    pendingFiles.value = filesList;
    uploadTargetFolder.value = selectedPath.value;

    if (filesList.length === 1) {
      const { basename, extension } = splitFilename(filesList[0].name);
      uploadFileBasename.value = basename;
      uploadFileExtension.value = extension;
    } else {
      uploadFileBasename.value = "";
      uploadFileExtension.value = "";
    }

    showUploadModal.value = true;
  }
}

async function performUpload() {
  if (pendingFiles.value.length === 0) return;

  const filesToUpload =
    pendingFiles.value.length === 1 ? (pendingFiles.value[0] as File) : pendingFiles.value;

  const success = await uploadAsset(
    filesToUpload,
    uploadTargetFolder.value,
    pendingFiles.value.length === 1 ? uploadFileBasename.value : undefined,
  );

  if (success) {
    showUploadModal.value = false;
    pendingFiles.value = [];
    uploadFileBasename.value = "";
    uploadFileExtension.value = "";
  }
}

function triggerNewFolder() {
  newFolderName.value = "";
  showNewFolderModal.value = true;
}

function confirmNewFolder() {
  const newPath = addLocalFolder(newFolderName.value, selectedPath.value);
  if (newPath) {
    selectedPath.value = newPath;
    showNewFolderModal.value = false;
    newFolderName.value = "";
  }
}

function triggerMove(asset: any) {
  movingAsset.value = asset;
  const parts = asset.key.split("/");
  const fullFilename = parts.pop()!;
  const lastDot = fullFilename.lastIndexOf(".");

  moveTargetFolder.value = parts.join("/");
  if (lastDot === -1) {
    moveTargetBasename.value = fullFilename;
  } else {
    moveTargetBasename.value = fullFilename.substring(0, lastDot);
  }
  showMoveModal.value = true;
}

async function performMove() {
  if (!movingAsset.value || !moveTargetBasename.value) return;
  const success = await moveAsset(
    movingAsset.value.key,
    moveTargetFolder.value,
    moveTargetBasename.value,
  );
  if (success) {
    showMoveModal.value = false;
  }
}

function toggleSelection(key: string) {
  const index = selectedKeys.value.indexOf(key);
  if (index > -1) {
    selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
  } else {
    selectedKeys.value = [...selectedKeys.value, key];
  }
}

function handleDragStart(evt: any) {
  isDragging.value = true;
  if (evt.oldIndex !== undefined) {
    draggedItem.value = localGridItems.value[evt.oldIndex];
  }
}

function handleDragMove(evt: any) {
  const related = evt.relatedContext?.element;
  if (related && related.type === "folder") {
    dropTarget.value = related;
  } else {
    dropTarget.value = null;
  }
  return false;
}

async function handleDragEnd() {
  const asset = draggedItem.value;
  const folder = dropTarget.value;

  if (asset && folder && asset.type === "asset" && asset.key && folder.type === "folder") {
    const fileName = asset.key.split("/").pop() || "";
    const lastDot = fileName.lastIndexOf(".");
    const basename = lastDot === -1 ? fileName : fileName.substring(0, lastDot);
    const success = await moveAsset(asset.key, folder.key, basename);
    if (!success) {
      // Optional: Notify or handle failure
    }
  }

  isDragging.value = false;
  draggedItem.value = null;
  dropTarget.value = null;
  localGridItems.value = [...gridItems.value];
}

function isImage(contentType?: string, key?: string) {
  if (contentType?.startsWith("image/")) return true;
  const ext = key?.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(date: string | Date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const dateStr = `${day}/${month}/${year} ${hours}:${minutes}`;
  return t("modals.assetManager.item.last_modified", { date: dateStr });
}

function getAssetUrl(key: string): string {
  const cdnBase = (appConfig.cdn as string) || "";
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  // If CDN is configured, use it directly (Cloudflare handles subfolders in the path)
  if (cdnBase && typeof cdnBase === "string" && cdnBase.startsWith("http")) {
    return `${cdnBase.replace(/\/$/, "")}/${encodedKey}`;
  }

  // Fallback to local API endpoint
  if (!defaultWindow) return `/api/assets/${encodedKey}`;
  return `${defaultWindow.location.origin}/api/assets/${encodedKey}`;
}

async function copyAssetUrl(key: string) {
  try {
    const url = getAssetUrl(key);
    await copy(url);
    toast.add({
      title: t("modals.assetManager.item.copy_url_success"),
      description: url,
      color: "success",
    });
  } catch {
    toast.add({
      title: t("modals.assetManager.item.copy_url_failed"),
      description: t("swatch.copy_error_description"),
      color: "error",
    });
  }
}
/* endregion */
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('modals.assetManager.header.title')"
    :description="t('modals.assetManager.header.description')"
    :ui="{
      content: 'sm:max-w-6xl max-h-[90vh] flex flex-col',
      body: 'p-0 flex-1 overflow-hidden min-h-0',
      header: 'flex items-center justify-between shrink-0',
    }"
  >
    <template #body>
      <div :class="root({ class: rc.root })">
        <div :class="main()">
          <!-- Sidebar: Folder Tree -->
          <div :class="sidebar()">
            <div :class="sidebarContent()">
              <UTree
                v-model="activeTreeValue"
                :items="treeItems"
                :get-key="(i: any) => (i.fullPath === '' ? 'Root' : i.fullPath)"
                color="primary"
                variant="neutral"
                :multiple="false"
                class="w-full"
              />
            </div>
          </div>

          <!-- Content Area -->
          <div :class="content()">
            <div :class="toolbar()">
              <div class="flex items-center gap-none overflow-hidden h-6">
                <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.path">
                  <span
                    v-if="idx > 0"
                    class="text-dimmed opacity-50 shrink-0 text-xs text-center px-1"
                    >/</span
                  >
                  <button
                    class="text-xs font-semibold truncate hover:text-primary hover:bg-primary-500/10 px-1.5 py-0.5 rounded transition-colors whitespace-nowrap"
                    @click="selectedPath = crumb.path"
                  >
                    {{ crumb.label }}
                  </button>
                </template>
              </div>
              <div class="flex items-center gap-sm shrink-0 ml-md">
                <div v-if="selectedKeys.length > 0" class="flex items-center gap-xs mr-sm">
                  <span class="text-xs font-bold text-primary-600 dark:text-primary-400">{{
                    t("modals.assetManager.toolbar.selected_count", { count: selectedKeys.length })
                  }}</span>
                  <UButton
                    icon="lucide:trash-2"
                    size="xs"
                    variant="ghost"
                    color="error"
                    @click="
                      () => {
                        batchDelete();
                      }
                    "
                  />
                  <UButton
                    icon="lucide:x"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    @click="selectedKeys = []"
                  />
                </div>
                <span class="text-[10px] text-dimmed uppercase">{{
                  t("modals.assetManager.toolbar.items_count", { count: gridItems.length })
                }}</span>
                <UButton
                  icon="lucide:rotate-ccw"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  :loading="status === 'pending'"
                  @click="refresh()"
                />
              </div>
            </div>

            <div
              v-if="status === 'pending' && !assets.length"
              class="flex flex-1 items-center justify-center"
            >
              <UIcon name="lucide:loader-2" class="size-8 animate-spin text-primary" />
            </div>

            <div
              v-else-if="!gridItems.length"
              class="flex-1 flex items-center justify-center p-xl overflow-y-auto"
            >
              <UEmpty
                icon="lucide:folder-open"
                :title="t('modals.assetManager.empty.title')"
                variant="naked"
                :description="t('modals.assetManager.empty.description')"
              />
            </div>

            <div v-else class="flex-1 overflow-y-auto min-h-0">
              <draggable
                v-model="localGridItems"
                item-key="key"
                :move="handleDragMove"
                :sort="true"
                @start="handleDragStart"
                @end="handleDragEnd"
                :class="grid()"
                handle=".drag-handle"
                :animation="200"
                ghost-class="opacity-50"
              >
                <template #header>
                  <div
                    v-if="authPermissions.assets.canUpload.value"
                    :class="item()"
                    class="flex items-center justify-center p-0 overflow-hidden cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/20"
                  >
                    <UFileUpload
                      size="xs"
                      :label="t('modals.assetManager.upload.dropzone_label')"
                      :description="t('modals.assetManager.upload.dropzone_description')"
                      :dropzone="true"
                      multiple
                      class="size-full"
                      :ui="{
                        base: 'size-full border-0 bg-transparent flex flex-col items-center justify-center text-center p-md',
                        wrapper: 'flex flex-col items-center justify-center gap-xs',
                        label: 'text-[11px] font-semibold',
                        description: 'text-[10px]',
                        actions: 'mt-xs',
                      }"
                      @update:model-value="
                        (files: any) => {
                          if (files) {
                            handleFileSelected({ target: { files } } as any);
                          }
                        }
                      "
                    >
                      <template #actions="{ open: openPicker }">
                        <UButton
                          size="xs"
                          :label="t('modals.assetManager.upload.select_button')"
                          icon="lucide:upload"
                          color="neutral"
                          variant="outline"
                          @click="openPicker()"
                        />
                      </template>
                    </UFileUpload>
                  </div>
                </template>

                <template #item="{ element: itemObj }">
                  <div>
                    <div
                      v-if="itemObj.type === 'folder'"
                      :class="[
                        item(),
                        dropTarget?.key === itemObj.key
                          ? 'ring-2 ring-primary-500 bg-primary-500/10 scale-95'
                          : '',
                      ]"
                      class="cursor-pointer group/folder transition-all"
                      @click="selectedPath = itemObj.key"
                      @dragover.prevent="dropTarget = itemObj"
                      @dragleave="dropTarget = dropTarget === itemObj ? null : dropTarget"
                    >
                      <div
                        :class="[preview(), isDragging ? 'pointer-events-none' : '']"
                        class="bg-primary-50/50 dark:bg-primary-900/10 group-hover/folder:bg-primary-500/10 transition-colors"
                      >
                        <UIcon
                          name="lucide:folder"
                          class="size-12 text-primary-500/40 group-hover/folder:text-primary-500/60"
                        />
                      </div>
                      <div :class="[itemInfo(), isDragging ? 'pointer-events-none' : '']">
                        <span :class="itemLabel()">{{ itemObj.label }}</span>
                        <span :class="itemSize()">{{
                          t("modals.assetManager.item.folder_label")
                        }}</span>
                      </div>
                    </div>

                    <RLImage
                      v-else-if="isImage(itemObj.contentType, itemObj.key)"
                      :src="`/api/assets/${itemObj.key.split('/').map(encodeURIComponent).join('/')}`"
                      :metadata="{
                        size: (itemObj as any).size,
                        format:
                          (itemObj as any).contentType?.split('/').pop()?.toUpperCase() ||
                          (itemObj as any).key.split('.').pop()?.toUpperCase(),
                      }"
                    >
                      <template #trigger="{ open: openImage }">
                        <div
                          :class="item()"
                          class="drag-handle cursor-grab active:cursor-grabbing group"
                          @click="openImage"
                        >
                          <!-- Card Header with Selection and Actions -->
                          <div
                            class="absolute top-sm left-0 right-0 z-20 flex items-center justify-between px-sm"
                          >
                            <!-- Selection (Left) -->
                            <div
                              class="flex items-center transition-opacity"
                              :class="[
                                selectedKeys.includes(itemObj.key)
                                  ? 'opacity-100'
                                  : 'opacity-0 group-hover:opacity-100',
                              ]"
                            >
                              <UCheckbox
                                :model-value="selectedKeys.includes(itemObj.key)"
                                color="primary"
                                @update:model-value="toggleSelection(itemObj.key)"
                                @click.stop
                              />
                            </div>

                            <!-- Actions (Right) -->
                            <div
                              class="flex items-center transition-opacity"
                              :class="[
                                selectedKeys.includes(itemObj.key)
                                  ? 'opacity-100'
                                  : 'opacity-0 group-hover:opacity-100',
                              ]"
                            >
                              <UFieldGroup size="xs">
                                <UButton
                                  v-if="selectionMode"
                                  :title="t('common.select', 'Select')"
                                  icon="lucide:check"
                                  variant="ghost"
                                  color="primary"
                                  class="text-white hover:bg-primary-500/20 bg-primary-600/60 backdrop-blur-sm"
                                  @click.stop="emit('select', (itemObj as any).key)"
                                />
                                <UButton
                                  :title="t('modals.assetManager.item.copy_url')"
                                  icon="lucide:copy"
                                  variant="ghost"
                                  color="neutral"
                                  class="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm"
                                  @click.stop="copyAssetUrl((itemObj as any).key)"
                                />
                                <UButton
                                  icon="lucide:download"
                                  variant="ghost"
                                  color="neutral"
                                  class="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm"
                                  @click.stop="downloadAsset((itemObj as any).key)"
                                />
                                <UButton
                                  v-if="authPermissions.assets.canEdit.value"
                                  icon="lucide:pencil"
                                  variant="ghost"
                                  color="neutral"
                                  class="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm"
                                  @click.stop="triggerMove(itemObj)"
                                />
                                <UButton
                                  v-if="authPermissions.assets.canDelete.value"
                                  icon="lucide:trash-2"
                                  variant="ghost"
                                  color="error"
                                  class="hover:bg-error-500/20 bg-black/60 backdrop-blur-sm"
                                  @click.stop="deleteAsset((itemObj as any).key)"
                                />
                              </UFieldGroup>
                            </div>
                          </div>

                          <div :class="preview()">
                            <NuxtImg
                              :src="`/api/assets/${itemObj.key.split('/').map(encodeURIComponent).join('/')}`"
                              :class="previewImage()"
                              loading="lazy"
                            />
                          </div>

                          <div :class="itemInfo()">
                            <span :class="itemLabel()" :title="(itemObj as any).key">{{
                              (itemObj as any).key.split("/").pop()
                            }}</span>
                            <div class="flex flex-col gap-0">
                              <span :class="itemSize()" class="uppercase">{{
                                (itemObj as any).key.split(".").pop()
                              }}</span>
                              <span :class="itemSize()">{{
                                formatSize((itemObj as any).size)
                              }}</span>
                              <span
                                v-if="(itemObj as any).uploaded"
                                class="text-[9px] text-dimmed uppercase mt-0.5"
                                >{{ formatDate((itemObj as any).uploaded) }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </template>
                    </RLImage>

                    <div
                      v-else
                      :class="item()"
                      class="drag-handle cursor-grab active:cursor-grabbing group"
                    >
                      <!-- Card Header with Selection and Actions -->
                      <div
                        class="absolute top-sm left-0 right-0 z-20 flex items-center justify-between px-sm"
                      >
                        <!-- Selection (Left) -->
                        <div
                          class="flex items-center transition-opacity"
                          :class="[
                            selectedKeys.includes(itemObj.key)
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100',
                          ]"
                        >
                          <UCheckbox
                            :model-value="selectedKeys.includes(itemObj.key)"
                            color="primary"
                            @update:model-value="toggleSelection(itemObj.key)"
                            @click.stop
                          />
                        </div>

                        <!-- Actions (Right) -->
                        <div
                          class="flex items-center transition-opacity"
                          :class="[
                            selectedKeys.includes(itemObj.key)
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100',
                          ]"
                        >
                          <UFieldGroup size="xs">
                            <UButton
                              v-if="selectionMode"
                              :title="t('common.select', 'Select')"
                              icon="lucide:check"
                              variant="ghost"
                              color="primary"
                              class="text-white hover:bg-primary-500/20 bg-primary-600/60 backdrop-blur-sm"
                              @click.stop="emit('select', (itemObj as any).key)"
                            />
                            <UButton
                              :title="t('modals.assetManager.item.copy_url')"
                              icon="lucide:copy"
                              variant="ghost"
                              color="neutral"
                              class="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm"
                              @click.stop="copyAssetUrl((itemObj as any).key)"
                            />
                            <UButton
                              icon="lucide:download"
                              variant="ghost"
                              color="neutral"
                              class="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm"
                              @click.stop="downloadAsset((itemObj as any).key)"
                            />
                            <UButton
                              v-if="authPermissions.assets.canEdit.value"
                              icon="lucide:pencil"
                              variant="ghost"
                              color="neutral"
                              class="text-white hover:bg-white/20 bg-black/60 backdrop-blur-sm"
                              @click.stop="triggerMove(itemObj)"
                            />
                            <UButton
                              v-if="authPermissions.assets.canDelete.value"
                              icon="lucide:trash-2"
                              variant="ghost"
                              color="error"
                              class="hover:bg-error-500/20 bg-black/60 backdrop-blur-sm"
                              @click.stop="deleteAsset((itemObj as any).key)"
                            />
                          </UFieldGroup>
                        </div>
                      </div>

                      <div :class="preview()">
                        <div class="flex flex-col items-center gap-xs">
                          <UIcon name="lucide:file" class="size-8 text-dimmed" />
                          <span class="text-[10px] uppercase text-dimmed">{{
                            (itemObj as any).key.split(".").pop()
                          }}</span>
                        </div>
                      </div>

                      <div :class="itemInfo()">
                        <span :class="itemLabel()" :title="(itemObj as any).key">{{
                          (itemObj as any).key.split("/").pop()
                        }}</span>
                        <div class="flex flex-col gap-0">
                          <span :class="itemSize()" class="uppercase">{{
                            (itemObj as any).key.split(".").pop()
                          }}</span>
                          <span :class="itemSize()">{{ formatSize((itemObj as any).size) }}</span>
                          <span
                            v-if="(itemObj as any).uploaded"
                            class="text-[9px] text-dimmed uppercase mt-0.5"
                            >{{ formatDate((itemObj as any).uploaded) }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>

        <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelected" />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-sm">
          <UButton
            v-if="authPermissions.assets.canEdit.value"
            size="sm"
            variant="ghost"
            icon="lucide:folder-plus"
            :label="t('modals.assetManager.actions.new_subfolder')"
            @click="triggerNewFolder"
          />
        </div>

        <div class="flex items-center gap-sm">
          <UButton
            v-if="authPermissions.assets.canUpload.value"
            icon="lucide:upload"
            :label="t('modals.assetManager.upload.add_asset_button')"
            color="primary"
            @click="triggerFilePicker"
          />
        </div>
      </div>
    </template>
  </UModal>

  <!-- New Folder Modal -->
  <UModal
    v-model:open="showNewFolderModal"
    :title="t('modals.newFolder.title')"
    :description="t('modals.newFolder.description')"
  >
    <template #body>
      <div class="flex flex-col gap-md">
        <p class="text-sm text-dimmed">
          {{ t("modals.newFolder.label", { path: `/${selectedPath || "Root"}` }) }}
        </p>
        <UInput
          v-model="newFolderName"
          :placeholder="t('modals.newFolder.placeholder')"
          autofocus
          class="w-full"
          @keydown.enter="confirmNewFolder"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <UButton
          :label="t('modals.newFolder.cancel_button')"
          color="error"
          variant="ghost"
          @click="showNewFolderModal = false"
        />
        <UButton
          :label="t('modals.newFolder.create_button')"
          color="primary"
          @click="confirmNewFolder"
        />
      </div>
    </template>
  </UModal>

  <!-- Move/Rename Modal -->
  <UModal v-model:open="showMoveModal" :title="t('modals.move.title')">
    <template #body>
      <div class="flex flex-col gap-md">
        <UFormField :label="t('modals.move.name_label')">
          <UInput v-model="moveTargetBasename" class="w-full" />
        </UFormField>
        <UFormField :label="t('modals.move.folder_label')">
          <div class="border border-default rounded-md max-h-48 overflow-y-auto p-1 bg-elevated/50">
            <UTree
              v-model="modalMoveTargetValue"
              :items="treeItems"
              :get-key="(i: any) => (i.fullPath === '' ? 'Root' : i.fullPath)"
              color="primary"
              variant="neutral"
              :multiple="false"
              class="w-full"
            />
          </div>
        </UFormField>
        <p class="text-[11px] text-dimmed">
          {{ t("modals.move.current_location", { path: movingAsset?.key }) }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <UButton
          :label="t('modals.move.cancel_button')"
          color="error"
          variant="ghost"
          @click="showMoveModal = false"
        />
        <UButton
          :label="t('modals.move.move_button')"
          color="primary"
          :loading="isProcessing"
          @click="performMove"
        />
      </div>
    </template>
  </UModal>

  <!-- Upload Filename Modal -->
  <UModal v-model:open="showUploadModal" :title="t('modals.upload.title')">
    <template #body>
      <div class="flex flex-col gap-md">
        <template v-if="pendingFiles.length === 1">
          <UFormField :label="t('modals.upload.filename_label')">
            <UInput v-model="uploadFileBasename" class="w-full" />
          </UFormField>
        </template>
        <template v-else>
          <div
            class="p-md rounded-lg bg-warning-500/10 border border-warning-500/20 flex gap-md items-start"
          >
            <UIcon name="lucide:alert-triangle" class="size-5 text-warning-500 shrink-0 mt-0.5" />
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-warning-600 dark:text-warning-400">{{
                t("modals.upload.multiple_files_warning.title")
              }}</span>
              <p class="text-[11px] text-dimmed leading-relaxed">
                {{ t("modals.upload.multiple_files_warning.description") }}
              </p>
            </div>
          </div>
          <p class="text-xs font-semibold px-1">
            {{ t("modals.upload.files_selected", { count: pendingFiles.length }) }}
          </p>
        </template>
        <UFormField :label="t('modals.upload.folder_label')">
          <div class="border border-default rounded-md max-h-48 overflow-y-auto p-1 bg-elevated/50">
            <UTree
              v-model="modalUploadTargetValue"
              :items="treeItems"
              :get-key="(i: any) => (i.fullPath === '' ? 'Root' : i.fullPath)"
              color="primary"
              variant="neutral"
              :multiple="false"
              class="w-full"
            />
          </div>
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <UButton
          :label="t('modals.upload.cancel_button')"
          color="error"
          variant="ghost"
          @click="showUploadModal = false"
        />
        <UButton
          :label="t('modals.upload.upload_button')"
          color="primary"
          :loading="isProcessing"
          @click="performUpload"
        />
      </div>
    </template>
  </UModal>
</template>
