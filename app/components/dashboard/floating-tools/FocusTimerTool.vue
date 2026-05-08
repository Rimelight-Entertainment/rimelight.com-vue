<script setup lang="ts">
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface FocusTimerToolProps {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<FocusTimerToolProps>();

const { rc } = useRC("FocusTimerTool", rcProp);
/* endregion */

/* region Emits */
export interface FocusTimerToolEmits {}

const emit = defineEmits<FocusTimerToolEmits>();
/* endregion */

/* region Slots */
export interface FocusTimerToolSlots {}

const slots = defineSlots<FocusTimerToolSlots>();
/* endregion */

/* region Styles */
const focusTimerToolStyles = tv({
  slots: {
    root: "flex flex-col gap-sm",
    timerDisplay: "flex flex-col items-center",
    timeValue: "text-4xl font-bold tabular-nums",
    modeLabel: "text-md text-muted uppercase",
    controls: "flex items-center gap-sm",
  },
});

const { root, timerDisplay, timeValue, modeLabel, controls } = focusTimerToolStyles();
type FocusTimerToolVariants = VariantProps<typeof focusTimerToolStyles>;
/* endregion */

/* region State */
const focusTimer = useFocusTimer();
const toast = useToast();
/* endregion */

/* region Meta */
defineOptions({
  name: "FocusTimerTool",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })

watch(
  () => focusTimer.status.value,
  (st) => {
    if (st === "completed") {
      toast.add({
        title: "Timer Finished!",
        description:
          focusTimer.mode.value === "work"
            ? "Great work! Take a break."
            : "Break is over! Time to focus.",
        color: "success",
      });
    }
  },
);

// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <UProgress :model-value="focusTimer.progress.value" size="sm" color="primary" />

    <div :class="timerDisplay()">
      <div :class="timeValue()">
        {{ focusTimer.formattedTime.value }}
      </div>
      <div :class="modeLabel()">
        {{ focusTimer.mode.value.replace("-", " ") }}
      </div>
    </div>

    <div :class="controls()">
      <UButton
        :icon="focusTimer.isRunning.value ? 'lucide:pause' : 'lucide:play'"
        :label="focusTimer.isRunning.value ? 'Pause' : 'Start'"
        :color="focusTimer.isRunning.value ? 'warning' : 'primary'"
        block
        size="sm"
        @click="focusTimer.isRunning.value ? focusTimer.pauseTimer() : focusTimer.startTimer()"
      />
      <UButton
        icon="lucide:rotate-ccw"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="focusTimer.resetTimer()"
      />
    </div>
  </div>
</template>

<style scoped></style>
