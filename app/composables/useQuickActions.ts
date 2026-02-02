import { useNuxtApp } from "#app"
import { type Ref, shallowRef } from "vue"

export interface QuickAction {
  id: string
  label: string
  icon: string
  group?: number
  onSelect: () => void
}

/**
 * A simple registry for any action in the app
 */
export const useQuickActions = () => {
  const nuxtApp = useNuxtApp()

  // Use a registry attached to nuxtApp to ensure it's per-request on SSR
  // but not serialized by useState (which would fail for functions)
  if (!nuxtApp._quickActionsRegistry) {
    nuxtApp._quickActionsRegistry = shallowRef<QuickAction[]>([])
  }
  const registeredActions = nuxtApp._quickActionsRegistry as Ref<QuickAction[]>

  function registerAction(action: QuickAction) {
    const exists = registeredActions.value.some((a) => a.id === action.id)
    if (!exists) {
      registeredActions.value = [...registeredActions.value, action]
    }
  }

  return {
    registeredActions,
    registerAction
  }
}
