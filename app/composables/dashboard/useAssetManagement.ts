import { ref } from "vue";
import { useToast } from "@nuxt/ui/composables/useToast";
import { useConfirm } from "#composables/app/useConfirm";

export interface Asset {
  key: string;
  size: number;
  contentType?: string;
  httpMetadata?: Record<string, any>;
  customMetadata?: Record<string, any>;
  [key: string]: any;
}

export function useAssetManagement() {
  const { confirm } = useConfirm();
  const toast = useToast();

  const refreshTick = useState("assetManagement-refreshTick", () => 0);

  const {
    data: assets,
    refresh: originalRefresh,
    status,
    clear,
  } = useFetch<Asset[]>(() => `/api/assets?t=${refreshTick.value}`, {
    default: () => [],
    server: false,
    lazy: true,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  } as any);

  async function refresh() {
    clear();
    refreshTick.value++;
    selectedKeys.value = [];
    localFolders.value = [];
    await originalRefresh();
  }

  const selectedPath = useState("assetManagement-selectedPath", () => "");
  const selectedKeys = useState<string[]>("assetManagement-selectedKeys", () => []);
  const localFolders = useState<string[]>("assetManagement-localFolders", () => []);
  const isProcessing = ref(false);

  // --- Helpers ---
  function splitFilename(name: string) {
    const lastDotIndex = name.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return { basename: name, extension: "" };
    }
    return {
      basename: name.substring(0, lastDotIndex),
      extension: name.substring(lastDotIndex),
    };
  }

  function getExt(key: string) {
    const fileName = key.split("/").pop() || "";
    return fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
  }

  // --- Operations ---
  async function uploadAsset(file: File | File[], targetPath: string, customBasename?: string) {
    const files = Array.isArray(file) ? file : [file];
    isProcessing.value = true;

    try {
      const uploadPromises = files.map(async (f) => {
        const body = await f.arrayBuffer();
        const { extension } = splitFilename(f.name);

        // Use customBasename only for single file uploads
        const finalBasename =
          files.length === 1 && customBasename
            ? customBasename
            : f.name.substring(0, f.name.lastIndexOf(".")) || f.name;

        const filename = finalBasename + extension;
        const fullKey = targetPath ? `${targetPath}/${filename}` : filename;

        // Encode only segments to preserve slashes for the catch-all route
        const encodedKey = fullKey.split("/").map(encodeURIComponent).join("/");

        return $fetch(`/api/assets/${encodedKey}`, {
          method: "PUT",
          body,
          headers: {
            "Content-Type": f.type,
          },
        });
      });

      await Promise.all(uploadPromises);

      toast.add({
        color: "success",
        title:
          files.length === 1
            ? "Asset uploaded successfully"
            : `${files.length} assets uploaded successfully`,
      });
      await refresh();
      return { success: true };
    } catch (err) {
      toast.add({ color: "error", title: "Failed to upload asset(s)" });
      console.error("Upload failed", err);
      return { success: false, error: err };
    } finally {
      isProcessing.value = false;
    }
  }

  async function deleteAsset(key: string) {
    const isConfirmed = await confirm({
      title: "Delete Asset",
      description: `Are you sure you want to delete ${key}? This action cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });

    if (!isConfirmed) return false;

    try {
      const encodedKey = key.split("/").map(encodeURIComponent).join("/");
      await $fetch(`/api/assets/${encodedKey}`, { method: "DELETE" });
      toast.add({ color: "success", title: "Asset deleted successfully" });
      await refresh();
      return true;
    } catch (err) {
      toast.add({ color: "error", title: "Failed to delete asset" });
      console.error("Delete failed", err);
      return false;
    }
  }

  async function moveAsset(originalKey: string, targetFolder: string, newBasename: string) {
    const ext = getExt(originalKey);
    // Remove extension if user entered it
    const cleanBasename =
      newBasename.endsWith(ext) && ext !== "" ? newBasename.slice(0, -ext.length) : newBasename;

    const newFilename = cleanBasename + ext;

    // Normalize targetFolder (Root should be empty)
    const normalizedFolder =
      targetFolder === "Root" || targetFolder === "/" ? "" : targetFolder.replace(/^\/|\/$/g, "");
    const newKey = normalizedFolder ? `${normalizedFolder}/${newFilename}` : newFilename;

    if (originalKey === newKey) return true;

    isProcessing.value = true;
    try {
      const encodedOriginalKey = originalKey.split("/").map(encodeURIComponent).join("/");
      await $fetch(`/api/assets/${encodedOriginalKey}`, {
        method: "POST",
        body: { to: newKey },
      });
      toast.add({ color: "success", title: "Asset moved/renamed successfully" });
      await refresh();
      return true;
    } catch (err) {
      toast.add({ color: "error", title: "Failed to move/rename asset" });
      console.error("Move failed", err);
      return false;
    } finally {
      isProcessing.value = false;
    }
  }

  async function batchDelete() {
    const count = selectedKeys.value.length;
    if (count === 0) return false;

    const isConfirmed = await confirm({
      title: "Batch Delete",
      description: `Are you sure you want to delete ${count} selected assets? This action cannot be undone.`,
      confirmLabel: "Delete Selected",
      danger: true,
    });

    if (!isConfirmed) return false;

    isProcessing.value = true;
    try {
      const deletePromises = selectedKeys.value.map((key) => {
        const encodedKey = key.split("/").map(encodeURIComponent).join("/");
        return $fetch(`/api/assets/${encodedKey}`, { method: "DELETE" });
      });
      await Promise.all(deletePromises);
      toast.add({ color: "success", title: "Assets deleted successfully" });
      selectedKeys.value = [];
      await refresh();
      return true;
    } catch (err) {
      toast.add({ color: "error", title: "Failed to delete assets" });
      console.error("Batch delete failed", err);
      return false;
    } finally {
      isProcessing.value = false;
    }
  }

  function downloadAsset(key: string) {
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    const link = document.createElement("a");
    link.href = `/api/assets/${encodedKey}`;
    const fileName = key.split("/").pop() || key;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function addLocalFolder(name: string, parentPath: string) {
    const cleanName = name.trim().replace(/\//g, "-");
    if (!cleanName) return null;

    const newPath = parentPath ? `${parentPath}/${cleanName}` : cleanName;
    if (!localFolders.value.includes(newPath)) {
      localFolders.value.push(newPath);
    }
    return newPath;
  }

  return {
    // State
    assets,
    status,
    selectedPath,
    selectedKeys,
    localFolders,
    isProcessing,

    // Operations
    refresh,
    uploadAsset,
    deleteAsset,
    moveAsset,
    batchDelete,
    downloadAsset,
    addLocalFolder,

    // Helpers
    splitFilename,
  };
}
