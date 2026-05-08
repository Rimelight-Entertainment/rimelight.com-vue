export const useNotes = () => {
  // 1. Initializing (N/A)

  // 2. Refs
  const noteRefreshTrigger = useState("notes-refresh-trigger", () => 0);
  const selectedIds = useState<string[]>("notes-selected-ids", () => []);
  const status = useState<"idle" | "loading" | "success" | "error">("notes-status", () => "idle");
  const error = useState<Error | null>("notes-error", () => null);

  // 3. Methods
  const triggerRefresh = () => {
    noteRefreshTrigger.value++;
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((i: string) => i !== id);
    } else {
      selectedIds.value.push(id);
    }
  };

  const clearSelection = () => {
    selectedIds.value = [];
  };

  const wrapApi = async (fn: () => Promise<any>) => {
    status.value = "loading";
    error.value = null;
    try {
      await fn();
      status.value = "success";
      triggerRefresh();
    } catch (e) {
      status.value = "error";
      error.value = e instanceof Error ? e : new Error(String(e));
    }
  };

  const executeBatchAction = async (action: "delete" | "archive" | "restore" | "hard-delete") => {
    if (selectedIds.value.length === 0) return;
    await wrapApi(() =>
      $fetch("/api/notes/batch", {
        method: "POST",
        body: { ids: selectedIds.value, action },
      }),
    );
    clearSelection();
  };

  const executeSingleAction = async (
    id: string,
    action: "togglePin" | "archive" | "restore" | "delete" | "hard-delete",
  ) => {
    await wrapApi(async () => {
      if (action === "togglePin") {
        await $fetch(`/api/notes/${id}`, {
          method: "PUT",
          body: { togglePin: true },
        });
      } else if (action === "archive") {
        await $fetch(`/api/notes/${id}`, {
          method: "PUT",
          body: { isArchived: true, isPinned: false },
        });
      } else if (action === "restore") {
        await $fetch(`/api/notes/${id}`, {
          method: "PUT",
          body: { isArchived: false },
        });
      } else if (action === "delete") {
        await $fetch(`/api/notes/${id}`, { method: "DELETE" });
      } else if (action === "hard-delete") {
        await $fetch(`/api/notes/${id}?permanent=true`, {
          method: "DELETE",
          query: { permanent: true },
        });
      }
    });
  };

  return {
    noteRefreshTrigger,
    status,
    error,
    triggerRefresh,
    selectedIds,
    toggleSelection,
    clearSelection,
    executeBatchAction,
    executeSingleAction,
  };
};
