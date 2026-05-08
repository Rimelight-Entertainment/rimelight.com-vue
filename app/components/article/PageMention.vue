<script setup lang="ts">
import { inject } from "vue";
import { getLocalizedContent } from "#utils";
import { useI18n } from "vue-i18n";
import { type Page } from "#types";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface PageMentionProps {
  pageId: string;
  rc?: {
    link?: string;
    icon?: string;
    text?: string;
    skeleton?: string;
  };
}

const { pageId, rc: rcProp } = defineProps<PageMentionProps>();

const { rc } = useRC("PageMention", rcProp);
/*endregion */

/* region Emits */
export interface PageMentionEmits {}

const emit = defineEmits<PageMentionEmits>();
/* endregion */

/* region Slots */
export interface PageMentionSlots {}

const slots = defineSlots<PageMentionSlots>();
/* endregion */

/* region Styles */
const pageMentionStyles = tv({
  slots: {
    linkClass:
      "inline-flex items-baseline gap-1 align-middle hover:text-primary transition-colors font-medium text-inherit",
    iconClass: "w-4 h-4 rounded-full object-cover shrink-0",
    textClass: "truncate font-medium",
    skeletonClass: "h-3 w-24",
    unresolvedText: "text-xs text-dimmed italic",
  },
});

const { linkClass, iconClass, textClass, skeletonClass, unresolvedText } = pageMentionStyles();
type PageMentionVariants = VariantProps<typeof pageMentionStyles>;
/* endregion */

/* region State */
const { locale } = useI18n();
const isServer = import.meta.server;
const isClient = import.meta.client;

const resolver =
  inject<(id: string) => Promise<Pick<Page, "title" | "icon" | "slug">>>("page-resolver");

const { data: linkedPage, status } = useAsyncData(
  () => `page-mention-${pageId}`,
  async () => {
    if (!resolver) {
      if (isClient) {
        console.warn("RLPageMention: No page resolver provided in RLPageRenderer");
      }
      return null;
    }
    try {
      const page = await resolver(pageId);
      return page;
    } catch (e) {
      if (isClient) {
        console.warn("RLPageMention: Failed to resolve page", pageId, e);
      }
      return null;
    }
  },
  {
    lazy: true,
    watch: [() => pageId],
  },
);
/* endregion */

/* region Meta */
defineOptions({
  name: "PageMention",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
/* endregion */

/* region Logic */

/* endregion */
</script>

<template>
  <NuxtLink
    v-if="linkedPage && linkedPage.slug"
    :to="`/${linkedPage.slug}`"
    :class="linkClass({ class: rc.link })"
  >
    <NuxtImg
      v-if="linkedPage.icon?.src"
      :src="linkedPage.icon.src"
      :alt="linkedPage.icon.alt"
      :class="iconClass({ class: rc.icon })"
    />
    <span :class="textClass({ class: rc.text })">
      {{ getLocalizedContent(linkedPage.title, locale) }}
    </span>
  </NuxtLink>
  <USkeleton
    v-else-if="status === 'pending' || (isServer && status === 'idle')"
    :class="skeletonClass({ class: rc.skeleton })"
  />
  <span
    v-else-if="status !== 'idle' && pageId && pageId !== 'undefined' && pageId !== 'null'"
    :class="unresolvedText()"
  >
    Unresolved Ref ({{ pageId }})
  </span>
</template>

<style scoped></style>
