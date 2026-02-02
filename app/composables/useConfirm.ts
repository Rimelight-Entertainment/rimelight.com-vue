import { useState } from "#imports"
import { watch } from "vue"

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface ConfirmState {
  isVisible: boolean
  options: ConfirmOptions
}

// Module-level variable to hold the promise resolver.
// This is safe for client-side interaction.
let resolvePromise: ((value: boolean) => void) | null = null

export const useConfirm = () => {
  const state = useState<ConfirmState>("use-confirm-global-state", () => ({
    isVisible: false,
    options: {
      title: "Confirm Action",
      description: "",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      danger: false
    }
  }))

  // Watcher to handle "External" closing (Escape key, Backdrop click)
  if (import.meta.client) {
    watch(
      () => state.value.isVisible,
      (visible) => {
        // If it becomes hidden and the promise still exists,
        // it means the user dismissed it without clicking a button.
        if (!visible && resolvePromise) {
          resolvePromise(false)
          resolvePromise = null
        }
      }
    )
  }

  const confirm = (opts: Partial<ConfirmOptions>): Promise<boolean> => {
    state.value.options = {
      title: "Confirm Action",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      danger: false,
      ...opts
    }

    // Open the modal
    state.value.isVisible = true

    return new Promise((resolve) => {
      // If there was a lingering promise, resolve it false first
      if (resolvePromise) resolvePromise(false)
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
    state.value.isVisible = false
  }

  const handleCancel = () => {
    // Setting this to false triggers the watcher above,
    // which resolves the promise to false.
    state.value.isVisible = false
  }

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel
  }
}
