<script setup lang="ts">
import { useFloatingTools } from "~/composables";
import { tv } from "../../internal/tv";
import { useRC } from "~/composables";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface FloatingToolsOverlayProps {
  // prop1: string,
  // prop2?: number,
}

defineProps<FloatingToolsOverlayProps>();
/* endregion */

/* region Emits */
export interface FloatingToolsOverlayEmits {
  // change: [id: number]
  // update: [value: string]
}

const emit = defineEmits<FloatingToolsOverlayEmits>();
/* endregion */

/* region Slots */
export interface FloatingToolsOverlaySlots {
  // default: (props: {}) => any
}

const slots = defineSlots<FloatingToolsOverlaySlots>();
/* endregion */

/* region Styles */
const floatingToolsOverlayStyles = tv({
  slots: {
    root: "fixed top-[calc(var(--ui-header-height)+1.5rem)] right-6 z-9999 flex flex-col items-end gap-4 pointer-events-none",
    toolWrapper: "pointer-events-auto transition-all duration-300 ease-in-out",
    expandedCard: "w-80 bg-dimmed border border-muted rounded-2xl overflow-hidden",
    header: "flex items-center justify-between p-sm bg-muted",
    headerTitle: "flex items-center gap-sm",
    title: "text-md font-bold uppercase",
    headerActions: "flex items-center gap-sm",
    body: "p-sm",
    compactButton:
      "w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg",
  },
});

const {
  root,
  toolWrapper,
  expandedCard,
  header,
  headerTitle,
  title,
  headerActions,
  body,
  compactButton,
} = floatingToolsOverlayStyles();
type FloatingToolsOverlayVariants = VariantProps<typeof floatingToolsOverlayStyles>;
/* endregion */

/* region State */
const { activeToolIds, registeredTools, isVisible, removeTool, toggleExpanded, isToolExpanded } =
  useFloatingTools();
/* endregion */

/* region Meta */
defineOptions({
  name: "FloatingToolsOverlay",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
function getTool(id: string) {
  return registeredTools.value.get(id);
}
/* endregion */
</script>

<template>
  <div v-if="isVisible" :class="root()">
    <div v-for="id in activeToolIds" :key="id" :class="toolWrapper()">
      <template v-if="getTool(id)">
        <div v-if="isToolExpanded(id)" :class="expandedCard()">
          <div :class="header()">
            <div :class="headerTitle()">
              <UIcon :name="getTool(id)!.icon" class="w-4 h-4" />
              <span :class="title()">
                {{ getTool(id)!.title }}
              </span>
            </div>
            <div :class="headerActions()">
              <UButton
                color="neutral"
                icon="lucide:minus"
                size="xs"
                variant="ghost"
                @click="toggleExpanded(id)"
              />
              <UButton
                color="neutral"
                icon="lucide:x"
                size="xs"
                variant="ghost"
                @click="removeTool(id)"
              />
            </div>
          </div>

          <div :class="body()">
            <component :is="getTool(id)!.component" />
          </div>
        </div>

        <UTooltip v-else :text="getTool(id)!.tooltip?.() || getTool(id)!.title">
          <UButton
            :class="compactButton()"
            color="primary"
            variant="solid"
            @click="toggleExpanded(id)"
          >
            <UIcon :name="getTool(id)!.icon" class="w-6 h-6" />
          </UButton>
        </UTooltip>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
