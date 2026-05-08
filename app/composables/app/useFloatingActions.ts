import { type Component, type Ref, shallowRef, computed } from "vue";

export interface FloatingAction {
  id: string;
  label?: string;
  icon?: string;
  component?: Component;
  onSelect?: () => void;
  priority?: number;
}

export const useFloatingActions = () => {
  // 1. Initializing
  const nuxtApp = useNuxtApp();

  if (!nuxtApp._floatingActionsRegistry) {
    nuxtApp._floatingActionsRegistry = shallowRef(new Map<string, FloatingAction>());
  }

  const registeredActionsMap = nuxtApp._floatingActionsRegistry as Ref<Map<string, FloatingAction>>;

  // 2. Refs
  const activeActionIds = useState<string[]>("floating-action-ids", () => []);

  // 3. Computed
  const actions = computed(() => {
    return activeActionIds.value
      .map((id) => registeredActionsMap.value.get(id))
      .filter((a): a is FloatingAction => !!a)
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  });

  // 4. Methods
  function registerAction(action: FloatingAction) {
    registeredActionsMap.value.set(action.id, action);
    registeredActionsMap.value = new Map(registeredActionsMap.value);
    if (!activeActionIds.value.includes(action.id)) {
      activeActionIds.value = [...activeActionIds.value, action.id];
    }
  }

  function unregisterAction(id: string) {
    registeredActionsMap.value.delete(id);
    registeredActionsMap.value = new Map(registeredActionsMap.value);
    activeActionIds.value = activeActionIds.value.filter((i) => i !== id);
  }

  return {
    actions,
    registerAction,
    unregisterAction,
  };
};
