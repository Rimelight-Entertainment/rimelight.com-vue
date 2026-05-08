<script setup lang="ts">
import { computed } from "vue";
import { useRC } from "../../composables/components/useRC";
import { useScrollToTop } from "../../composables/app/useScrollToTop";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface ScrollToTopProps {
  circleStrokeWidth?: number;
  duration?: number;
  rc?: {
    button?: string;
    progressBase?: string;
    svg?: string;
    iconContainer?: string;
    icon?: string;
  };
}

const { circleStrokeWidth = 4, duration = 0.1, rc: rcProp } = defineProps<ScrollToTopProps>();

const { rc } = useRC("ScrollToTop", rcProp);
/* endregion */

/* region Emits */
export interface ScrollToTopEmits {}

const emit = defineEmits<ScrollToTopEmits>();
/* endregion */

/* region Slots */
export interface ScrollToTopSlots {}

const slots = defineSlots<ScrollToTopSlots>();
/* endregion */

/* region Styles */
const scrollToTopStyles = tv({
  slots: {
    button: "size-14 lg:size-12 p-0",
    progressBase: "progress-circle-base size-full",
    svg: "size-full",
    iconContainer: "absolute inset-0 flex items-center justify-center text-center",
    icon: "size-6 text-white",
  },
});

const { button, progressBase, svg, iconContainer, icon } = scrollToTopStyles();
type ScrollToTopVariants = VariantProps<typeof scrollToTopStyles>;
/* endregion */

/* region State */
const { t } = useI18n();
const { isVisible, scrollToTop, scrollPercentage } = useScrollToTop();

const circumference = 2 * Math.PI * 45;
const percentPx = circumference / 100;

const currentPercent = computed(() => (scrollPercentage.value / 100) * 100);
const percentageInPx = computed(() => `${percentPx}px`);
const durationInSeconds = computed(() => `${duration}s`);
/* endregion */

/* region Meta */
defineOptions({
  name: "ScrollToTop",
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
/* endregion */
</script>

<template>
  <Transition
    name="fade"
    enter-active-class="transition-opacity duration-300 ease-in"
    leave-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible">
      <UButton
        variant="ghost"
        :class="button({ class: [rc.button, 'hover:scale-110 transition-transform'] })"
        :aria-label="t?.('app.scroll_to_top') || 'Scroll to top'"
        @click="scrollToTop"
      >
        <div :class="progressBase({ class: rc.progressBase })">
          <svg :class="svg({ class: rc.svg })" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="var(--color-primary-950)"
              :stroke-width="circleStrokeWidth"
              stroke-dashoffset="0"
              stroke-linecap="round"
              class="gauge-secondary-stroke opacity-100"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              :stroke-width="circleStrokeWidth"
              stroke-dashoffset="0"
              stroke-linecap="round"
              class="gauge-primary-stroke opacity-100"
            />
          </svg>
          <div :class="iconContainer({ class: rc.iconContainer })">
            <UIcon name="lucide:arrow-up" :class="icon({ class: rc.icon })" />
          </div>
        </div>
      </UButton>
    </div>
  </Transition>
</template>

<style scoped>
.progress-circle-base {
  --circle-size: 100px;
  --circumference: v-bind(circumference);
  --percent-to-px: v-bind(percentageInPx);
  transform: translateZ(0);
}

.gauge-primary-stroke {
  stroke: var(--color-primary-500);
  --stroke-percent: v-bind(currentPercent);
  stroke-dasharray: calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference);
  transition:
    stroke-dasharray v-bind(durationInSeconds) ease,
    stroke v-bind(durationInSeconds) ease;
  transform: rotate(-90deg);
  transform-origin: center;
}

.gauge-secondary-stroke {
  stroke: var(--color-primary-900);
  stroke-dasharray: var(--circumference);
  transform: rotate(-90deg);
  transform-origin: center;
}
</style>
