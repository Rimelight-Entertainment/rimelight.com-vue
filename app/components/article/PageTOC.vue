<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useIntersectionObserver } from "@vueuse/core";
import { tv } from "../../internal/tv";
import { useRC } from "~/composables";
import type { Block, SectionBlockProps, HeadingLevel } from "~/types";
import { slugify, defaultDocument } from "#shared/utils";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface TOCItem {
  id: string;
  title: string;
  level: HeadingLevel;
}

export interface PageTOCProps {
  pageBlocks: Block[] | null;
  title?: string;
  levels?: HeadingLevel[];
  rc?: {
    nav?: string;
    list?: string;
    link?: string;
    text?: string;
  };
}

const {
  pageBlocks,
  title = "table_of_contents",
  levels = [2, 3, 4],
  rc: rcProp,
} = defineProps<PageTOCProps>();

const { rc } = useRC("PageTOC", rcProp);
/* endregion */

/* region Emits */
export interface PageTOCEmits {}

const emit = defineEmits<PageTOCEmits>();
/* endregion */

/* region Slots */
export interface PageTOCSlots {
  bottom: (props: {}) => any;
}

const slots = defineSlots<PageTOCSlots>();
/* endregion */

/* region Styles */
const pageTOCStyles = tv({
  slots: {
    navClass: "flex flex-col gap-sm w-full",
    listClass: "flex flex-col",
    linkClass:
      "group relative flex items-center px-3 py-1.5 text-sm transition-all duration-200 border-s-2 -ms-px",
    textClass: "truncate",
  },
  variants: {
    active: {
      true: {
        linkClass: "border-accented font-semibold text-foreground",
      },
      false: {
        linkClass: "border-dimmed text-dimmed",
      },
    },
    level: {
      1: { linkClass: "ps-3" },
      2: { linkClass: "ps-3" },
      3: { linkClass: "ps-6" },
      4: { linkClass: "ps-9" },
      5: { linkClass: "ps-12" },
      6: { linkClass: "ps-15" },
    },
  },
});

const { navClass, listClass, linkClass, textClass } = pageTOCStyles();
type PageTOCVariants = VariantProps<typeof pageTOCStyles>;
/* endregion */

/* region State */
const { t } = useI18n();
const activeId = ref<string | null>(null);
const { locale } = useI18n();

const items = computed(() => {
  const all = extractHeadings(pageBlocks ?? []);
  return all.filter((h) => levels.includes(h.level));
});
/* endregion */

/* region Meta */
defineOptions({
  name: "PageTOC",
});
/* endregion */

/* region Lifecycle */
// Active State Observer
onMounted(() => {
  watch(
    () => items.value,
    (newItems) => {
      newItems.forEach((item) => {
        const el = defaultDocument?.getElementById(item.id);
        if (!el) return;

        useIntersectionObserver(
          el,
          (entries) => {
            // Type-safe access to the first entry
            const entry = entries?.[0];

            if (entry?.isIntersecting) {
              activeId.value = item.id;
            }
          },
          {
            // Adjust rootMargin to detect the section when it's in the top third of the screen
            rootMargin: "-80px 0px -80% 0px",
            threshold: 0,
          },
        );
      });
    },
    { immediate: true },
  );
});
/* endregion */

/* region Logic */
function extractHeadings(blocks: Block[]): TOCItem[] {
  const headings: TOCItem[] = [];
  if (!blocks) return headings;

  for (const block of blocks) {
    if (block.type === "SectionBlock") {
      const p = block.props as SectionBlockProps;
      if (p.title && p.level) {
        headings.push({
          id: slugify(p.title),
          title: p.title,
          level: p.level as HeadingLevel,
        });
      }
      if (p.children?.length) {
        headings.push(...extractHeadings(p.children));
      }
    }
  }
  return headings;
}
/* endregion */
</script>

<template>
  <nav :class="navClass({ class: rc.nav })" aria-label="Table of Contents">
    <h5 v-if="title">
      {{ t(title) }}
    </h5>

    <ul v-if="items.length > 0" :class="listClass({ class: rc.list })">
      <li v-for="item in items" :key="item.id">
        <NuxtLink
          :to="{ hash: `#${item.id}` }"
          :class="
            pageTOCStyles({ active: activeId === item.id, level: item.level }).linkClass({
              class: rc.link,
            })
          "
        >
          <span :class="textClass({ class: rc.text })">
            {{ item.title }}
          </span>
        </NuxtLink>
      </li>
    </ul>

    <slot name="bottom" />
  </nav>
</template>

<style scoped></style>
