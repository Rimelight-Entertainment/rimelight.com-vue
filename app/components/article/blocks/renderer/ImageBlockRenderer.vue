<script setup lang="ts">
import type { ImageBlockProps } from "#types";
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface ImageBlockRendererProps extends ImageBlockProps {
  rc?: {
    root?: string;
    image?: string;
    caption?: string;
  };
}

const { src, alt, caption, rc: rcProp } = defineProps<ImageBlockRendererProps>();

const { rc } = useRC("ImageBlockRenderer", rcProp);
/* endregion */

/* region Emits */
export interface ImageBlockRendererEmits {}

const emit = defineEmits<ImageBlockRendererEmits>();
/* endregion */

/* region Slots */
export interface ImageBlockRendererSlots {}

const slots = defineSlots<ImageBlockRendererSlots>();
/* endregion */

/* region Styles */
const imageBlockRendererStyles = tv({
  slots: {
    root: "mx-auto",
    image: "h-auto w-full object-cover",
    captionClass: "mt-4 text-center text-sm text-muted",
  },
});

const { root, image, captionClass } = imageBlockRendererStyles();
type ImageBlockRendererVariants = VariantProps<typeof imageBlockRendererStyles>;
/* endregion */

/* region State */
// const ref1 = ref(0)
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Meta */
defineOptions({
  name: "ImageBlockRenderer",
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
  <figure :class="root({ class: rc.root })">
    <img :src="src" :alt="alt" :class="image({ class: rc.image })" />
    <figcaption v-if="caption" :class="captionClass({ class: rc.caption })">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped></style>
