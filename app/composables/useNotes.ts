import { useState } from "#imports"

export const useNotes = () => {
  const noteRefreshTrigger = useState("notes-refresh-trigger", () => 0)

  const selectedIds = useState<string[]>("notes-selected-ids", () => [])

  const triggerRefresh = () => {
    noteRefreshTrigger.value++
  }

  const toggleSelection = (id: string) => {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((i: string) => i !== id)
    } else {
      selectedIds.value.push(id)
    }
  }

  const clearSelection = () => {
    selectedIds.value = []
  }

  const executeBatchAction = async (action: "delete" | "archive" | "restore" | "hard-delete") => {
    if (selectedIds.value.length === 0) return
    await $fetch("/api/notes/batch", {
      method: "POST",
      body: { ids: selectedIds.value, action }
    })
    clearSelection()
    triggerRefresh() // Trigger the global signal
  }

  const executeSingleAction = async (
    id: string,
    action: "togglePin" | "archive" | "restore" | "delete" | "hard-delete"
  ) => {
    if (action === "togglePin") {
      await $fetch(`/api/notes/${id}`, {
        method: "PUT",
        body: { togglePin: true }
      })
    } else if (action === "archive") {
      await $fetch(`/api/notes/${id}`, {
        method: "PUT",
        body: { isArchived: true, isPinned: false }
      })
    } else if (action === "delete") {
      await $fetch(`/api/notes/${id}`, { method: "DELETE" })
    } else if (action === "hard-delete") {
      await $fetch(`/api/notes/${id}?permanent=true`, {
        method: "DELETE",
        query: { permanent: true }
      })
    }

    triggerRefresh()
  }

  return {
    noteRefreshTrigger,
    triggerRefresh,
    selectedIds,
    toggleSelection,
    clearSelection,
    executeBatchAction,
    executeSingleAction
  }
}
