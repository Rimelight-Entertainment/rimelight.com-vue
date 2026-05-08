<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick, provide } from "vue";
import { useHeaderStack, useRC } from "~/composables";
import { useWindowScroll } from "@vueuse/core";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface HeaderLayerProps {
  id: string;
  order?: number;
  hideOnScroll?: boolean;
  rc?: {
    root?: string;
    content?: string;
  };
}

const { id, order, hideOnScroll = false, rc: rcProp } = defineProps<HeaderLayerProps>();

const { rc } = useRC("HeaderLayer", rcProp);
/* endregion */

/* region Emits */
export interface HeaderLayerEmits {}

const emit = defineEmits<HeaderLayerEmits>();
/* endregion */

/* region Slots */
export interface HeaderLayerSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<HeaderLayerSlots>();
/* endregion */

/* region Styles */
const headerLayerStyles = tv({
  slots: {
    root: "fixed left-0 right-0 transition-[top,height,opacity] duration-200 ease-in-out",
    content: "w-full",
  },
});

const { root, content } = headerLayerStyles();
type HeaderLayerVariants = VariantProps<typeof headerLayerStyles>;
/* endregion */

/* region State */
provide("header_layer_id", id);

const contentRef = ref<HTMLElement | null>(null);
const isVisible = ref(true);
const lastScrollY = ref(0);
let observer: ResizeObserver | null = null;

// This tracks the "measured" height of the children
const naturalHeight = ref(0);

const { y: scrollY } = useWindowScroll();
const { registerHeader, unregisterHeader, offsets, zIndices } = useHeaderStack();

const topOffset = computed(() => offsets.value[id] ?? 0);
const zIndex = computed(() => zIndices.value[id] ?? 50);
/* endregion */

/* region Meta */
defineOptions({
  name: "HeaderLayer",
});
/* endregion */

/* region Lifecycle */
onMounted(() => {
  nextTick(() => {
    if (contentRef.value) {
      naturalHeight.value = contentRef.value.getBoundingClientRect().height;
      updateStack();

      observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const height = entry.contentRect.height;
          if (height > 0) {
            naturalHeight.value = height;
            updateStack();
          }
        }
      });
      observer.observe(contentRef.value);
    }
  });
});

watch(scrollY, (current) => {
  if (!hideOnScroll) return;

  const diff = current - lastScrollY.value;
  // Don't hide if we are within the top 50px or if the scroll was tiny
  if (Math.abs(diff) < 10) return;

  if (current <= 50) {
    isVisible.value = true;
  } else isVisible.value = diff <= 0;

  lastScrollY.value = current;
});

// When visibility changes, update the stack immediately
watch(isVisible, updateStack);

onUnmounted(() => {
  unregisterHeader(id);
  observer?.disconnect();
});
/* endregion */

/* region Logic */
function updateStack() {
  // We register either the full height or 0.
  // Because the stack is reactive, changing this triggers the transition
  // on UMain and other HeaderLayers simultaneously.
  const heightToRegister = isVisible.value ? naturalHeight.value : 0;
  registerHeader(id, heightToRegister, order);
}
/* endregion */
</script>

<template>
  <div
    :class="root({ class: rc.root })"
    :style="{
      top: `${topOffset}px`,
      height: isVisible ? `${naturalHeight}px` : '0px',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      zIndex,
    }"
  >
    <div ref="contentRef" :class="content({ class: rc.content })">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
