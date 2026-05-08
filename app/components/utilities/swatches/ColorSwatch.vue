<script setup lang="ts">
import { useToast } from "@nuxt/ui/composables/useToast";
import { computed } from "vue";
import { useClipboard } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface ColorSwatchProps {
  name?: string;
  hex?: string;
  rgb?: string;
  hsl?: string;
  oklch?: string;
  cmyk?: string;
  textColor?: string;
  rc?: {
    card?: string;
    title?: string;
    content?: string;
    preview?: string;
    details?: string;
    buttonGroup?: string;
    button?: string;
  };
}

const { name, hex, rgb, hsl, oklch, cmyk, textColor, rc: rcProp } = defineProps<ColorSwatchProps>();

const { rc } = useRC("ColorSwatch", rcProp);
/* endregion */

/* region Emits */
export interface ColorSwatchEmits {}

const emit = defineEmits<ColorSwatchEmits>();
/* endregion */

/* region Slots */
export interface ColorSwatchSlots {}

const slots = defineSlots<ColorSwatchSlots>();
/* endregion */

/* region Styles */
const colorSwatchStyles = tv({
  slots: {
    card: "w-full rounded-none xl:w-fit",
    title: "text-lg font-bold",
    content: "flex flex-col items-center gap-sm xl:flex-row xl:items-start",
    preview: "flex aspect-square size-48 p-sm",
    details: "flex flex-col justify-end gap-xs text-xs",
    buttonGroup: "flex w-full flex-col justify-center gap-sm",
    button: "w-full xl:w-36",
    detailsName: "text-sm font-bold uppercase tracking-wider mb-2 border-b border-current pb-1",
  },
});

const {
  card,
  title: titleStyle,
  content,
  preview,
  details,
  buttonGroup,
  button,
  detailsName,
} = colorSwatchStyles();
type ColorSwatchVariants = VariantProps<typeof colorSwatchStyles>;
/* endregion */

/* region State */
const { copy } = useClipboard();
const toast = useToast();
const { t } = useI18n();

const color = computed(() => {
  if (hex) return hex;
  if (rgb) return rgb;
  if (hsl) return hsl;
  if (cmyk) return cmyk;
  if (oklch) return oklch;

  return "var(--color-primary-500)";
});
/* endregion */

/* region Meta */
defineOptions({
  name: "ColorSwatch",
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
const copyToClipboard = async (text: string) => {
  try {
    await copy(`${text}`);
    toast.add({
      title: t("swatch.color_copied"),
      description: text,
      color: "success",
    });
  } catch {
    toast.add({
      title: t("swatch.color_copy_failed"),
      description: t("swatch.copy_error_description"),
      color: "error",
    });
  }
};

function formatColor(colorStr: string) {
  return colorStr.toUpperCase().replace(/[)]/g, "").replace(/[(]/g, " ").replace(/%/g, "");
}
/* endregion */
</script>

<template>
  <UCard variant="subtle" :class="card({ class: rc.card })">
    <template v-if="name" #header>
      <h3 :class="titleStyle({ class: rc.title })">{{ name }}</h3>
    </template>
    <div :class="content({ class: rc.content })">
      <div :class="preview({ class: rc.preview })" :style="{ backgroundColor: color }">
        <div :class="details({ class: rc.details })" :style="{ color: textColor || 'white' }">
          <span v-if="name" :class="detailsName()">
            {{ name }}
          </span>
          <span v-if="hex">HEX {{ formatColor(hex) }}</span>
          <span v-if="rgb">{{ formatColor(rgb) }}</span>
          <span v-if="hsl">{{ formatColor(hsl) }}</span>
          <span v-if="oklch">{{ formatColor(oklch) }}</span>
          <span v-if="cmyk">{{ formatColor(cmyk) }}</span>
        </div>
      </div>
      <div :class="buttonGroup({ class: rc.buttonGroup })">
        <UButton
          v-if="hex"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          :label="t('swatch.copy_hex')"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(hex)"
        />
        <UButton
          v-if="rgb"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          :label="t('swatch.copy_rgb')"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(rgb)"
        />
        <UButton
          v-if="hsl"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          :label="t('swatch.copy_hsl')"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(hsl)"
        />
        <UButton
          v-if="oklch"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          :label="t('swatch.copy_oklch')"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(oklch)"
        />
        <UButton
          v-if="cmyk"
          variant="outline"
          size="sm"
          icon="lucide:copy"
          :label="t('swatch.copy_cmyk')"
          :class="button({ class: rc.button })"
          @click="copyToClipboard(cmyk)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
