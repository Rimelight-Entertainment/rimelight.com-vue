<script setup lang="ts">
import { computed, provide, watch } from "vue";
import { type Page, type PageSurround } from "~/types";
import { getLocalizedContent, syncPageWithDefinition } from "#shared/utils";
import { useI18n } from "vue-i18n";
import { usePageRegistry, useRC } from "~/composables";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface PageRendererProps {
  useSurround?: boolean;
  surround?: PageSurround | null;
  surroundStatus?: "idle" | "pending" | "success" | "error";
  resolvePage: (id: string) => Promise<Pick<Page, "title" | "icon" | "slug">>;
  canEdit?: boolean;
  editUrl?: string;
  rc?: {
    container?: string;
    grid?: string;
    toc?: string;
    properties?: string;
    contentWrapper?: string;
    banner?: string;
    icon?: string;
    title?: string;
    surroundSkeleton?: string;
    skeleton?: string;
    metadata?: string;
  };
}

const {
  useSurround = false,
  surroundStatus = "idle",
  surround = null,
  resolvePage,
  canEdit = false,
  editUrl,
  rc: rcProp,
} = defineProps<PageRendererProps>();

const { rc } = useRC("PageRenderer", rcProp);

provide("page-resolver", resolvePage);
/* endregion */

/* region Emits */
export interface PageRendererEmits {}

const emit = defineEmits<PageRendererEmits>();
/* endregion */

/* region Slots */
export interface PageRendererSlots {}

const slots = defineSlots<PageRendererSlots>();
/* endregion */

/* region Styles */
const pageRendererStyles = tv({
  slots: {
    container: "flex flex-col py-16",
    grid: "grid grid-cols-1 lg:grid-cols-24 gap-xl items-start",
    toc: "hidden lg:flex lg:col-span-4 sticky top-16",
    properties: "order-1 lg:order-2 lg:col-span-6",
    contentWrapper: "order-2 lg:order-1 lg:col-span-14 flex flex-col gap-xl",
    banner: "rounded-xl w-full object-cover",
    icon: "rounded-full w-12 h-12 object-cover",
    title: "",
    surroundSkeleton: "grid grid-cols-1 gap-md sm:grid-cols-2",
    skeleton: "h-48 w-full rounded-xl",
    metadata: "flex flex-col gap-xs text-xs text-dimmed p-lg",
    headerTitleWrapper: "flex flex-row gap-sm",
  },
});

const {
  container,
  grid,
  toc,
  properties,
  contentWrapper,
  banner,
  icon,
  title,
  surroundSkeleton,
  skeleton,
  metadata,
} = pageRendererStyles();
type PageRendererVariants = VariantProps<typeof pageRendererStyles>;
/* endregion */

/* region State */
const page = defineModel<Page>({ required: true });

const { getTypeLabelKey, definitions } = usePageRegistry();
const { t, locale } = useI18n();

const currentDefinition = computed(() => {
  if (!page.value?.type || !definitions) return null;
  const typeKey = Object.keys(definitions).find(
    (k) => k.toLowerCase() === page.value.type.toLowerCase(),
  );
  return typeKey ? (definitions as any)[typeKey] : null;
});

const previousPage = computed(() => surround?.previous);
const nextPage = computed(() => surround?.next);
const hasSurround = computed(() => !!(surround?.previous || surround?.next));
/* endregion */

/* region Meta */
defineOptions({
  name: "PageRenderer",
});
/* endregion */

/* region Lifecycle */
watch(
  [() => page.value?.id, () => page.value?.type, currentDefinition],
  () => {
    if (page.value && currentDefinition.value) {
      console.log("[PageRenderer] Syncing page with definition", page.value.id);
      syncPageWithDefinition(page.value, currentDefinition.value);
    }
  },
  { immediate: true },
);
/* endregion */

/* region Logic */
function getLabel(key: string) {
  return t(getTypeLabelKey(key as any));
}
/* endregion */
</script>

<template>
  <UContainer v-if="page" :class="container({ class: rc.container })">
    <div :class="grid({ class: rc.grid })">
      <RLPageTOC :page-blocks="page.blocks" :levels="[2, 3, 4]" :class="toc({ class: rc.toc })">
        <template #bottom> </template>
      </RLPageTOC>

      <RLPagePropertiesRenderer
        v-model="page"
        :can-edit="canEdit"
        :edit-url="editUrl"
        :class="properties({ class: rc.properties })"
      />

      <div :class="contentWrapper({ class: rc.contentWrapper })">
        <RLImage
          v-if="page.banner?.src"
          :src="page.banner?.src"
          :alt="page.banner?.alt"
          :class="banner({ class: rc.banner })"
        />

        <UPageHeader
          :headline="t(getTypeLabelKey(page.type))"
          :title="getLocalizedContent(page.title, locale)"
          :description="getLocalizedContent(page.description, locale)"
          :ui="{ root: 'pt-0' }"
        />

        <RLBlockViewRenderer :blocks="page.blocks!" />

        <template v-if="useSurround">
          <div
            v-if="surroundStatus === 'pending'"
            :class="surroundSkeleton({ class: rc.surroundSkeleton })"
          >
            <USkeleton :class="skeleton({ class: rc.skeleton })" />
            <USkeleton :class="skeleton({ class: rc.skeleton })" />
          </div>

          <LazyRLPageSurround
            v-else-if="surroundStatus === 'success' && hasSurround"
            hydrate-on-visible
            :pageType="getTypeLabelKey(page.type)"
            :previousTitle="getLocalizedContent(previousPage?.title, locale)"
            :previousDescription="getLocalizedContent(previousPage?.description, locale)"
            :previousTo="previousPage?.slug ? `/${previousPage.slug}` : undefined"
            :nextTitle="getLocalizedContent(nextPage?.title, locale)"
            :nextDescription="getLocalizedContent(nextPage?.description, locale)"
            :nextTo="nextPage?.slug ? `/${nextPage.slug}` : undefined"
          />

          <USeparator />

          <div :class="metadata({ class: rc.metadata })">
            <h6>{{ t("page_editor.metadata") }}</h6>
            <span>{{ t("page_editor.page_id") }}: {{ page.id }}</span>
            <span
              >{{ t("page_editor.created_at") }}:
              <NuxtTime
                :datetime="page.createdAt ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
            /></span>
            <span
              >{{ t("page_editor.posted_at") }}:
              <NuxtTime
                :datetime="page.createdAt ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
            /></span>
            <span
              >{{ t("page_editor.updated_at") }}:
              <NuxtTime
                :datetime="page.createdAt ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
            /></span>
          </div>
        </template>
      </div>
    </div>
  </UContainer>
</template>

<style scoped></style>
