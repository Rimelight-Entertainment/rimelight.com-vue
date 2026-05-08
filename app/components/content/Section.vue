<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { SECTION_LEVEL_KEY } from "../../internal/injectionKeys";

/* region Props */
export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface SectionProps {
  level?: SectionLevel;
  title: string;
  description?: string;
  isEditing?: boolean;
  rc?: {
    section?: string;
    link?: string;
    title?: string;
    description?: string;
    separator?: string;
    content?: string;
  };
}

const { title, description, isEditing = false, rc: rcProp } = defineProps<SectionProps>();

const { rc } = useRC("Section", rcProp);
/* endregion */

/* region Emits */
export interface SectionEmits {}

const emit = defineEmits<SectionEmits>();
/* endregion */

/* region Slots */
export interface SectionSlots {
  default: (props: {}) => any;
  title: (props: {}) => any;
  description: (props: {}) => any;
}

const slots = defineSlots<SectionSlots>();
/* endregion */

/* region Styles */
const sectionStyles = tv({
  slots: {
    section: "flex flex-col scroll-mt-24 w-full",
    link: "",
    title: "font-bold w-full",
    description: "text-muted",
    separator: "py-2",
    content: "flex flex-col gap-md mt-2",
    anchorButtonWrapper: "group relative lg:-ms-2 lg:ps-2 inline-block w-full",
    anchorButton:
      "absolute top-1/2 -translate-y-1/2 -ms-8 hidden rounded-md p-1 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 lg:flex",
    fallbackAnchor:
      "absolute top-1/2 -translate-y-1/2 -ms-8 w-6 h-6 rounded-md p-1 opacity-0 transition lg:flex",
  },
  variants: {
    level: {
      1: {
        section: "gap-2",
        description: "text-2xl",
      },
      2: {
        section: "gap-1.5",
        description: "text-xl",
      },
      3: {
        section: "gap-1",
        description: "text-lg",
      },
      4: {
        section: "gap-0.5",
        description: "text-md",
      },
      5: {
        section: "gap-0.25",
        description: "text-sm",
      },
      6: {
        section: "gap-0.125",
        description: "text-xs",
      },
    },
  },
});

const styles = computed(() => sectionStyles({ level: level.value as SectionLevel }));
type SectionVariants = VariantProps<typeof sectionStyles>;
/* endregion */

/* region State */
const parentLevel = inject(
  SECTION_LEVEL_KEY,
  computed(() => 1),
);
const level = computed(() => Math.min(6, parentLevel.value + 1));
provide(SECTION_LEVEL_KEY, level);

const { copy } = useClipboard();
const toast = useToast();
const route = useRoute();

const sectionId = computed(() => slugify(title));
const sectionHash = computed(() => `#${sectionId.value}`);
const fullSectionUrl = computed(() => {
  if (!defaultWindow) return sectionHash.value;
  return `${defaultWindow.location.origin}${route.path}${sectionHash.value}`;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "Section",
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
      title: "Heading copied to clipboard!",
      description: text,
      color: "success",
    });
  } catch {
    toast.add({
      title: "Failed to copy heading to clipboard.",
      description: "An unexpected error occurred. Please try again.",
      color: "error",
    });
  }
};
/* endregion */
</script>

<template>
  <section :id="sectionId" :class="styles.section({ class: rc.section })" v-bind="$attrs">
    <component
      :is="`h${level}`"
      :id="`${sectionId}-title`"
      :class="styles.title({ class: rc.title })"
    >
      <NuxtLink
        v-if="!isEditing"
        :href="`#${sectionId}`"
        :class="[styles.anchorButtonWrapper(), styles.link({ class: rc.link })]"
      >
        <ClientOnly>
          <UButton
            variant="soft"
            color="primary"
            icon="lucide:link"
            :to="`#${sectionId}`"
            :class="styles.anchorButton()"
            @click.prevent="copyToClipboard(fullSectionUrl)"
          />
          <template #fallback>
            <div :class="styles.fallbackAnchor()" />
          </template>
        </ClientOnly>
        <slot name="title">{{ title }}</slot>
      </NuxtLink>
      <slot v-else name="title">
        {{ title }}
      </slot>
    </component>
    <slot name="description">
      <p v-if="description" :class="styles.description({ class: rc.description })">
        {{ description }}
      </p>
    </slot>
    <USeparator :class="styles.separator({ class: rc.separator })" />
    <div :class="styles.content({ class: rc.content })">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>
