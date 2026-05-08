// composables/usePageRegistry.ts
import { reactive, readonly } from "vue";
import { type PageType, type PageDefinition } from "#types";

// This would ideally be populated via a Nuxt plugin or at app initialization
const PAGE_DEFINITIONS = reactive<Partial<Record<PageType, PageDefinition>>>({});

export const usePageRegistry = () => {
  // 1. Initializing (N/A)

  // 2. Refs
  const definitions = readonly(PAGE_DEFINITIONS);

  // 3. Methods
  /**
   * Registers a definition into the global state
   */
  const registerDefinitions = (definitions: Record<string, PageDefinition>) => {
    Object.assign(PAGE_DEFINITIONS, definitions);
  };

  /**
   * Retrieves the label key for a specific page type
   */
  const getTypeLabelKey = (type: PageType): string => {
    const definition = PAGE_DEFINITIONS[type];
    // Fallback to the type key itself if definition isn't found
    return definition?.typeLabelKey ?? `page.type.${type.toLowerCase()}`;
  };

  return {
    registerDefinitions,
    getTypeLabelKey,
    definitions,
  };
};
