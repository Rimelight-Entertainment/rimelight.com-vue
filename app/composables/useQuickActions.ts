import { useState } from "#app"

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

  const registeredActions = useState<QuickAction[]>("global-quick-actions-list", () => [])

  function registerAction(action: QuickAction) {
    const exists = registeredActions.value.some((a) => a.id === action.id)
    if (!exists) {
      registeredActions.value.push(action)
    }
  }

  return {
    registeredActions,
    registerAction
  }
}