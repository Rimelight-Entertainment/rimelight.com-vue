<script setup lang="ts">
import { onMounted, markRaw } from "vue";
import { useFloatingActions } from "../../composables/app/useFloatingActions";
import { RLScrollToTop, RLQuickActions } from "#components";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface FloatingActionsOverlayProps {
  // prop1: string,
  // prop2?: number,
  // rc?: {
  //   root?: string;
  //   content?: string;
  // };
}

defineProps<FloatingActionsOverlayProps>();
/* endregion */

/* region Emits */
export interface FloatingActionsOverlayEmits {
  // change: [id: number]
  // update: [value: string]
}

const emit = defineEmits<FloatingActionsOverlayEmits>();
/* endregion */

/* region Slots */
export interface FloatingActionsOverlaySlots {
  // default: (props: {}) => any
}

const slots = defineSlots<FloatingActionsOverlaySlots>();
/* endregion */

/* region Styles */
const floatingActionsOverlayStyles = tv({
  slots: {
    root: "fixed bottom-6 right-6 z-[10000] flex flex-col-reverse items-center gap-4 pointer-events-none",
    actionWrapper: "pointer-events-auto flex items-center justify-center font-normal",
  },
});

const { root, actionWrapper } = floatingActionsOverlayStyles();
type FloatingActionsOverlayVariants = VariantProps<typeof floatingActionsOverlayStyles>;
/* endregion */

/* region State */
const { actions, registerAction } = useFloatingActions();
/* endregion */

/* region Meta */
defineOptions({
  name: "FloatingActionsOverlay",
});
/* endregion */

/* region Lifecycle */
onMounted(() => {
  // Register standard global actions
  registerAction({
    id: "quick-actions",
    priority: 10,
    component: markRaw(RLQuickActions),
  });

  registerAction({
    id: "scroll-to-top",
    priority: 0,
    component: markRaw(RLScrollToTop),
  });
});

// watch(() => { }, (newValue, oldValue) => {
//
// })

// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div :class="root()">
    <div v-for="action in actions" :key="action.id" :class="actionWrapper()">
      <component :is="action.component" v-if="action.component" />
      <UTooltip v-else-if="action.icon || action.label" :text="action.label">
        <UButton
          :icon="action.icon"
          color="primary"
          square
          :aria-label="action.label || 'Action'"
          :ui="{
            base: 'rounded-full size-14 lg:size-12 justify-center shadow-lg hover:scale-110 transition-transform',
            leadingIcon: 'size-6',
          }"
          @click="action.onSelect"
        />
      </UTooltip>
    </div>
  </div>
</template>

<style scoped></style>
