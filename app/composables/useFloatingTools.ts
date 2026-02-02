import { useNuxtApp, useState } from "#app"
import { type Component, type Ref, shallowRef } from "vue"

export interface FloatingToolDefinition {
  id: string
  title: string
  icon: string
  component: Component
  tooltip?: () => string
  onClose?: () => void
}

export const useFloatingTools = () => {
  const nuxtApp = useNuxtApp()

  // Use a registry attached to nuxtApp to ensure it's per-request on SSR
  // but not serialized by useState (which would fail for functions/components)
  if (!nuxtApp._floatingToolsRegistry) {
    nuxtApp._floatingToolsRegistry = shallowRef(new Map<string, FloatingToolDefinition>())
  }
  const registeredTools = nuxtApp._floatingToolsRegistry as Ref<Map<string, FloatingToolDefinition>>

  const activeToolIds = useState<string[]>("active-floating-tool-ids", () => [])
  const expandedTools = useState<Record<string, boolean>>("floating-tools-expanded-map", () => ({}))
  const isVisible = useState("floating-tool-visible-global", () => false)

  function registerTool(definition: FloatingToolDefinition) {
    registeredTools.value.set(definition.id, definition)
  }

  function openTool(id: string) {
    if (!registeredTools.value.has(id)) return

    if (!activeToolIds.value.includes(id)) {
      activeToolIds.value.push(id)
    }
    expandedTools.value[id] = true
    isVisible.value = true
  }

  function removeTool(id: string) {
    const tool = registeredTools.value.get(id)
    if (tool?.onClose) tool.onClose()

    activeToolIds.value = activeToolIds.value.filter((t) => t !== id)
    if (activeToolIds.value.length === 0) {
      isVisible.value = false
    }
  }

  function toggleExpanded(id: string) {
    expandedTools.value[id] = !expandedTools.value[id]
  }

  return {
    activeToolIds,
    registeredTools,
    isVisible,
    registerTool,
    openTool,
    removeTool,
    toggleExpanded,
    isToolExpanded: (id: string) => expandedTools.value[id] ?? true
  }
}
