<script setup lang="ts">
import { computed } from "vue";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";
import { useI18n } from "vue-i18n";

/* region Props */
export interface FontSwatchProps {
  name?: string;
  jpg?: string;
  png?: string;
  webp?: string;
  svg?: string;
  rc?: {
    card?: string;
    title?: string;
    content?: string;
    actions?: string;
    buttonGroup?: string;
    button?: string;
  };
}

const { name, jpg, png, webp, svg, rc: rcProp } = defineProps<FontSwatchProps>();

const { rc } = useRC("FontSwatch", rcProp);
/* endregion */

/* region Emits */
export interface FontSwatchEmits {}

const emit = defineEmits<FontSwatchEmits>();
/* endregion */

/* region Slots */
export interface FontSwatchSlots {}

const slots = defineSlots<FontSwatchSlots>();
/* endregion */

/* region Styles */
const fontSwatchStyles = tv({
  slots: {
    card: "w-full rounded-none xl:w-fit",
    title: "text-lg font-bold",
    content: "flex flex-col gap-sm",
    actions: "flex flex-col items-center gap-sm xl:flex-row xl:items-start",
    buttonGroup: "flex w-full flex-col justify-center gap-sm",
    button: "w-full xl:w-36",
    specimen: "flex flex-col gap-xs",
  },
});

const {
  card,
  title: titleStyle,
  content,
  actions,
  buttonGroup,
  button,
  specimen,
} = fontSwatchStyles();
type FontSwatchVariants = VariantProps<typeof fontSwatchStyles>;
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
  name: "FontSwatch",
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
      <div :class="specimen()">
        <h1>H1</h1>
        <p>a b c d e f g h i j k l m n o p q r s t u v w x y z</p>
        <p>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
      </div>
      <div :class="actions({ class: rc.actions })">
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
    </div>
  </UCard>
</template>

<style scoped></style>
