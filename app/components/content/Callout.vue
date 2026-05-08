<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "commentary"
  | "ideation"
  | "source";

export interface CalloutProps {
  variant: CalloutVariant;
  to?: string;
  target?: string;
  rc?: {
    icon?: string;
    tooltipIcon?: string;
  };
}

const { variant, to, target, rc: rcProp } = defineProps<CalloutProps>();

const { rc } = useRC("Callout", rcProp);
/* endregion */

/* region Emits */
export interface CalloutEmits {}

const emit = defineEmits<CalloutEmits>();
/* endregion */

/* region Slots */
export interface CalloutSlots {
  default: (props: {}) => any;
  leading: (props: { icon: string; iconClass: string }) => any;
}

const slots = defineSlots<CalloutSlots>();
/* endregion */

/* region Styles */
const calloutStyles = tv({
  slots: {
    iconClass: "size-6",
    tooltipIcon: "pointer-events-auto size-5",
  },
});

const { iconClass, tooltipIcon } = calloutStyles();
type CalloutVariants = VariantProps<typeof calloutStyles>;
/* endregion */

/* region State */
const { t } = useI18n();
const appConfig = useAppConfig();

const config = computed(() => {
  return (
    (appConfig.rimelightComponents as any)?.callouts?.[variant] ?? {
      icon: "lucide:alert-circle",
      title: "Callout",
      tooltip: "Callout",
    }
  );
});

const icon = computed(() => config.value.icon);
const title = computed(() => config.value.title);
const tooltip = computed(() => config.value.tooltip);
/* endregion */

/* region Meta */
defineOptions({
  name: "RLCallout",
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
  <NuxtLink :to="to" :target="target">
    <UAlert
      :title="t(title)"
      :color="variant"
      variant="subtle"
      :close="{
        class: 'pointer-events-none focus-visible:outline-none',
      }"
    >
      <template #leading>
        <slot name="leading" :icon="icon" :icon-class="iconClass({ class: rc.icon })">
          <UIcon :name="icon" :class="iconClass({ class: rc.icon })" />
        </slot>
      </template>
      <template #description>
        <slot />
      </template>
      <template #close>
        <UTooltip v-if="tooltip" :text="t(tooltip)">
          <UIcon
            name="lucide:circle-question-mark"
            :class="tooltipIcon({ class: rc.tooltipIcon })"
          />
        </UTooltip>
      </template>
    </UAlert>
  </NuxtLink>
</template>

<style scoped></style>
