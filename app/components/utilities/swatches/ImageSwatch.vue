<script setup lang="ts">
import { computed } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";
import { useI18n } from "vue-i18n";

/* region Props */
export interface ImageSwatchProps {
  name?: string;
  jpg?: string;
  png?: string;
  webp?: string;
  svg?: string;
  rc?: {
    card?: string;
    title?: string;
    content?: string;
    image?: string;
    buttonGroup?: string;
    button?: string;
  };
}

const { name, jpg, png, webp, svg, rc: rcProp } = defineProps<ImageSwatchProps>();

const { rc } = useRC("ImageSwatch", rcProp);
/* endregion */

/* region Emits */
export interface ImageSwatchEmits {}

const emit = defineEmits<ImageSwatchEmits>();
/* endregion */

/* region Slots */
export interface ImageSwatchSlots {}

const slots = defineSlots<ImageSwatchSlots>();
/* endregion */

/* region Styles */
const imageSwatchStyles = tv({
  slots: {
    card: "w-full rounded-none xl:w-fit",
    title: "text-lg font-bold",
    content: "flex flex-col items-center gap-sm xl:flex-row xl:items-start",
    imageClass: "size-48",
    buttonGroup: "flex w-full flex-col justify-center gap-sm",
    button: "w-full xl:w-36",
  },
});

const { card, title: titleStyle, content, imageClass, buttonGroup, button } = imageSwatchStyles();
type ImageSwatchVariants = VariantProps<typeof imageSwatchStyles>;
/* endregion */

/* region State */
const { t } = useI18n();

const image = computed(() => {
  if (webp) return webp;
  if (png) return png;
  if (jpg) return jpg;
  if (svg) return svg;

  return undefined;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "ImageSwatch",
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
  <UCard variant="subtle" :class="card({ class: rc.card })">
    <template v-if="name" #header>
      <h3 :class="titleStyle({ class: rc.title })">{{ name }}</h3>
    </template>
    <div :class="content({ class: rc.content })">
      <NuxtImg :src="image" :class="imageClass({ class: rc.image })" />
      <div :class="buttonGroup({ class: rc.buttonGroup })">
        <UButton
          v-if="jpg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          :label="t('swatch.download_jpg')"
          :class="button({ class: rc.button })"
          :to="jpg"
          target="_blank"
        />
        <UButton
          v-if="png"
          variant="outline"
          size="sm"
          icon="lucide:download"
          :label="t('swatch.download_png')"
          :class="button({ class: rc.button })"
          :to="png"
          target="_blank"
        />
        <UButton
          v-if="webp"
          variant="outline"
          size="sm"
          icon="lucide:download"
          :label="t('swatch.download_webp')"
          :class="button({ class: rc.button })"
          :to="webp"
          target="_blank"
        />
        <UButton
          v-if="svg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          :label="t('swatch.download_svg')"
          :class="button({ class: rc.button })"
          :to="svg"
          target="_blank"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
