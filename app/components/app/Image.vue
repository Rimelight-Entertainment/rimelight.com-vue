<script setup lang="ts">
import { reactive, onMounted, useTemplateRef, watch, nextTick, computed } from "vue";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";
import { defaultDocument, defaultWindow } from "#utils";

/* region Props */
export interface ImageProps {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
  loading?: "lazy" | "eager";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  /** Optional pre-calculated metadata */
  metadata?: {
    width?: number;
    height?: number;
    size?: string | number;
    format?: string;
  };
  rc?: {
    base?: string;
  };
}

const {
  src,
  alt = "Image",
  height,
  width,
  loading = "lazy",
  fit = "cover",
  metadata: initialMetadata,
  rc: rcProp,
} = defineProps<ImageProps>();

const { rc } = useRC("Image", rcProp);
/* endregion */

/* region Emits */
export interface ImageEmits {}

const emit = defineEmits<ImageEmits>();
/* endregion */

/* region Slots */
export interface ImageSlots {
  /** The trigger content for the image viewer */
  trigger?: (props: { open: () => void }) => any;
}

defineSlots<ImageSlots>();
/* endregion */

/* region Styles */
const imageStyles = tv({
  slots: {
    base: "cursor-pointer transition-transform duration-300",
  },
  variants: {
    isExpanded: {
      true: {
        base: "w-full h-full object-contain mx-auto block rounded-lg",
      },
      false: {
        base: "w-full h-full hover:scale-[1.02] active:scale-95",
      },
    },
  },
});

const { base } = imageStyles();
type ImageVariants = VariantProps<typeof imageStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });
const imgElement = useTemplateRef<{ $el: HTMLImageElement }>("imgRef");
const expandedImgElement = useTemplateRef<{ $el: HTMLImageElement }>("expandedImgRef");

const internalMetadata = reactive({
  width: initialMetadata?.width ?? 0,
  height: initialMetadata?.height ?? 0,
  size:
    typeof initialMetadata?.size === "number"
      ? formatBytes(initialMetadata.size)
      : (initialMetadata?.size ?? ""),
  format: initialMetadata?.format ?? "",
  mimeType: "",
});

const displayMetadata = computed(() => ({
  width: internalMetadata.width || 0,
  height: internalMetadata.height || 0,
  size: internalMetadata.size || "Unknown",
  format: internalMetadata.format || "IMG",
}));
/* endregion */

/* region Meta */
defineOptions({
  name: "Image",
});
/* endregion */

/* region Lifecycle */
onMounted(() => {
  nextTick(() => {
    if (imgElement.value?.$el) {
      const el = imgElement.value.$el;
      if (el.complete) {
        updateMetadata(el);
      }
    }
  });
});

watch(open, (isOpen) => {
  if (isOpen && (!internalMetadata.width || !internalMetadata.size)) {
    // Try to fetch metadata if missing when opened
    if (expandedImgElement.value?.$el) {
      updateMetadata(expandedImgElement.value.$el);
    } else {
      fetchExtendedMetadata();
    }
  }
});

watch(
  () => imgElement.value,
  (newVal) => {
    const el = newVal?.$el as HTMLImageElement | undefined;
    if (el && el.complete && el.naturalWidth > 0) {
      updateMetadata(el);
    }
  },
  { immediate: true },
);
/* endregion */

/* region Logic */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function fetchExtendedMetadata() {
  try {
    const response = await fetch(src, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();

    if (!internalMetadata.size || internalMetadata.size === "Unknown") {
      internalMetadata.size = formatBytes(blob.size);
    }

    const type = response.headers.get("content-type") || blob.type;
    if (type) {
      internalMetadata.mimeType = type;
      if (!internalMetadata.format) {
        internalMetadata.format = type.split("/")[1]?.split("+")[0]?.toUpperCase() || "IMG";
      }
    }

    if (internalMetadata.format === "SVG" && !internalMetadata.width) {
      const tempImg = new window.Image();
      tempImg.src = URL.createObjectURL(blob);
      await tempImg.decode();
      internalMetadata.width = tempImg.naturalWidth;
      internalMetadata.height = tempImg.naturalHeight;
      URL.revokeObjectURL(tempImg.src);
    }
  } catch (e) {
    console.warn("Metadata fetch failed:", e);
    if (!internalMetadata.format) {
      internalMetadata.format = src.split(".").pop()?.toUpperCase() || "IMG";
    }
  }
}

function updateMetadata(el: HTMLImageElement | null) {
  if (!import.meta.client || !el) return;

  if (el.naturalWidth > 0) {
    internalMetadata.width = el.naturalWidth;
    internalMetadata.height = el.naturalHeight;
    fetchExtendedMetadata();
  }
}

function handleImageLoad(event: Event, isExpanded = false) {
  if (isExpanded) return;
  updateMetadata(event.currentTarget as HTMLImageElement);
}

async function downloadImage() {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    if (!defaultWindow || !defaultDocument) return;

    const url = defaultWindow.URL.createObjectURL(blob);
    const link = defaultDocument.createElement("a");
    link.href = url;
    link.download = `file-${Date.now()}.${displayMetadata.value.format.toLowerCase()}`;
    defaultDocument.body.appendChild(link);
    link.click();
    defaultDocument.body.removeChild(link);
    defaultWindow.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
}
/* endregion */
</script>

<template>
  <UModal
    v-model:open="open"
    title="Image Viewer"
    :description="`${src}`"
    :ui="{
      content: 'w-fit max-w-[98vw] sm:max-w-[95vw] mx-auto',
    }"
  >
    <template #default>
      <slot name="trigger" :open="() => (open = true)">
        <div class="relative inline-block" @click.stop="open = true">
          <NuxtImg
            ref="imgRef"
            :src="src"
            :alt="alt"
            :height="height"
            :width="width"
            :loading="loading"
            :style="{ objectFit: fit }"
            :class="base({ isExpanded: false, class: rc.base })"
            @load="handleImageLoad($event, false)"
          />
        </div>
      </slot>
    </template>

    <template #body>
      <div class="flex flex-col gap-md">
        <div class="flex-1 min-h-0 w-full flex items-center">
          <NuxtImg
            ref="expandedImgRef"
            :src="src"
            :alt="alt"
            :style="{ objectFit: 'contain' }"
            :class="base({ isExpanded: true, class: rc.base })"
            @load="handleImageLoad($event, true)"
          />
        </div>

        <USeparator />

        <div class="flex items-center justify-between gap-xl">
          <div class="flex flex-col gap-xs">
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:image" class="size-4" />
              <p class="text-sm">
                Source: <span class="text-dimmed">{{ src }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:file-question-mark" class="size-4" />
              <p class="text-sm">
                Format: <span class="text-dimmed">{{ displayMetadata.format }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:weight" class="size-4" />
              <p class="text-sm">
                Size: <span class="text-dimmed">{{ displayMetadata.size }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:image-upscale" class="size-4" />
              <p class="text-sm">
                Dimensions:
                <span class="text-dimmed"
                  >{{ displayMetadata.width }} × {{ displayMetadata.height }}</span
                >
              </p>
            </div>
          </div>

          <UButton icon="lucide:download" label="Download Original" @click="downloadImage" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
