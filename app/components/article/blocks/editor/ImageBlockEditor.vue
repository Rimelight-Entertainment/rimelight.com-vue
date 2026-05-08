<script setup lang="ts">
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { type ImageBlockProps } from "#types";

/* region Props */
export interface ImageBlockEditorProps extends ImageBlockProps {
  rc?: {
    root?: string;
    upload?: string;
    previewContainer?: string;
    previewImage?: string;
    emptyPreview?: string;
  };
}

const { src, alt, caption, rc: rcProp } = defineProps<ImageBlockEditorProps>();

const { rc } = useRC("ImageBlockEditor", rcProp);
/* endregion */

/* region Emits */
export interface ImageBlockEditorEmits {
  "update:src": [value: string | null];
  "update:alt": [value: string];
  "update:caption": [value: string | null];
  "update:file": [value: File | null];
}

const emit = defineEmits<ImageBlockEditorEmits>();
/* endregion */

/* region Slots */
export interface ImageBlockEditorSlots {}

const slots = defineSlots<ImageBlockEditorSlots>();
/* endregion */

/* region Styles */
const imageBlockEditorStyles = tv({
  slots: {
    root: "flex flex-col gap-sm",
    upload: "w-full",
    previewContainer: "relative aspect-video w-full overflow-hidden rounded-md border",
    previewImage: "size-full object-cover",
    emptyPreview: "flex size-full items-center justify-center bg-muted text-dimmed",
  },
});

const { root, upload, previewContainer, previewImage, emptyPreview } = imageBlockEditorStyles();
type ImageBlockEditorVariants = VariantProps<typeof imageBlockEditorStyles>;
/* endregion */

/* region State */
const fileToUpload = ref<File | null>(null);
const localAlt = ref(alt || "");
const localCaption = ref(caption || "");

const filePreviewUrl = useObjectUrl(fileToUpload);

const previewSrc = computed(() => {
  return fileToUpload.value ? filePreviewUrl.value : src;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "ImageBlockEditor",
});
/* endregion */

/* region Lifecycle */
watch(localAlt, (newAlt) => {
  emit("update:alt", newAlt);
});

watch(localCaption, (newCaption) => {
  emit("update:caption", newCaption);
});

watch(fileToUpload, (newFile) => {
  emit("update:file", newFile);
  if (newFile) {
    emit("update:src", null);
  }
});

// onMounted(() => {
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
  <div :class="root({ class: rc.root })">
    <div :class="previewContainer({ class: rc.previewContainer })">
      <NuxtImg
        v-if="previewSrc"
        :src="previewSrc"
        :class="previewImage({ class: rc.previewImage })"
      />
      <div v-else :class="emptyPreview({ class: rc.emptyPreview })">
        <UIcon name="lucide:image" class="size-12" />
      </div>
    </div>

    <UInput
      type="file"
      accept="image/*"
      :class="upload({ class: rc.upload })"
      @change="
        (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files?.length) {
            fileToUpload = target.files[0] ?? null;
          }
        }
      "
    />

    <UFormField label="Alt Text">
      <UInput v-model="localAlt" placeholder="Describe the image..." class="w-full" />
    </UFormField>

    <UFormField label="Caption">
      <UInput v-model="localCaption" placeholder="Add a caption..." class="w-full" />
    </UFormField>
  </div>
</template>

<style scoped></style>
