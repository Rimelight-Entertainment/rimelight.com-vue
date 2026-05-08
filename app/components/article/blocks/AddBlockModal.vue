<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { BLOCK_DEFINITIONS, CATEGORY_ORDER, type BlockDefinition } from "#utils/blocks";
import { useRC } from "#composables";
import { useI18n } from "vue-i18n";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { SECTION_LEVEL_KEY } from "../../../internal/injectionKeys";

/* region Props */
export interface AddBlockModalProps {
  // open?: boolean,
  rc?: {
    header?: string;
    headerTitle?: string;
    closeButton?: string;
    body?: string;
    search?: string;
    categoryList?: string;
    categoryHeader?: string;
    blockGrid?: string;
    blockItem?: string;
    blockIcon?: string;
    blockLabel?: string;
    blockDescription?: string;
    footer?: string;
  };
}

const { rc: rcProp } = defineProps<AddBlockModalProps>();

const { rc } = useRC("AddBlockModal", rcProp);
/* endregion */

/* region Emits */
export interface AddBlockModalEmits {
  select: [definition: BlockDefinition];
}

const emit = defineEmits<AddBlockModalEmits>();
/* endregion */

/* region Slots */
export interface AddBlockModalSlots {}

const slots = defineSlots<AddBlockModalSlots>();
/* endregion */

/* region Styles */
const addBlockModalStyles = tv({
  slots: {
    header:
      "flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800",
    headerTitle: "text-base font-semibold leading-6",
    closeButton: "-my-1",
    body: "p-0 max-h-[70vh] flex flex-col",
    search: "p-4 border-b border-neutral-100 dark:border-neutral-900",
    categoryList: "overflow-y-auto flex-1 p-4 space-y-6",
    categoryHeader: "text-xs font-bold text-dimmed uppercase tracking-wider mb-3",
    blockGrid: "flex flex-col gap-2",
    blockItem:
      "flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all cursor-pointer text-left",
    blockIcon:
      "w-10 h-10 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-500 group-hover:text-primary-500",
    blockLabel: "font-medium text-sm block",
    blockDescription: "text-xs text-dimmed",
    footerClass: "flex justify-end gap-2 p-4 border-t border-neutral-200 dark:border-neutral-800",
    typeBadge:
      "text-[10px] font-mono text-dimmed px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded shrink-0",
    emptyState: "flex flex-col items-center justify-center py-12 text-center",
  },
});

const {
  header: headerClass,
  headerTitle,
  closeButton,
  body,
  search: searchClass,
  categoryList,
  categoryHeader,
  blockGrid,
  blockItem,
  blockIcon,
  blockLabel,
  blockDescription,
  footerClass,
  typeBadge,
  emptyState,
} = addBlockModalStyles();
type AddBlockModalVariants = VariantProps<typeof addBlockModalStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const searchQuery = ref("");
const sectionLevel = inject(
  SECTION_LEVEL_KEY,
  computed(() => 1),
);

const filteredBlocks = computed(() => {
  let blocks = BLOCK_DEFINITIONS;

  // Disable SectionBlock if we're already at max depth (H6)
  if (sectionLevel.value >= 6) {
    blocks = blocks.filter((b) => b.type !== "SectionBlock");
  }

  if (!searchQuery.value) return blocks;

  const query = searchQuery.value.toLowerCase();
  return blocks.filter(
    (block) =>
      block.label.toLowerCase().includes(query) ||
      block.type.toLowerCase().includes(query) ||
      block.category.toLowerCase().includes(query) ||
      block.description?.toLowerCase().includes(query),
  );
});

const groupedBlocks = computed(() => {
  const groups: Record<string, BlockDefinition[]> = {};

  filteredBlocks.value.forEach((block) => {
    const category = block.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category]!.push(block);
  });

  // Sort keys based on CATEGORY_ORDER
  const sortedGroups: Record<string, BlockDefinition[]> = {};

  CATEGORY_ORDER.forEach((category) => {
    if (groups[category]) {
      sortedGroups[category] = groups[category]!;
    }
  });

  // Add any categories not in CATEGORY_ORDER at the end
  Object.keys(groups).forEach((category) => {
    if (!sortedGroups[category]) {
      sortedGroups[category] = groups[category]!;
    }
  });

  return sortedGroups;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "AddBlockModal",
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
const handleSelect = (block: BlockDefinition) => {
  emit("select", block);
  open.value = false;
};
/* endregion */
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard :ui="{ body: 'p-0' }">
        <template #header>
          <div :class="headerClass({ class: rc.header })">
            <h3 :class="headerTitle({ class: rc.headerTitle })">
              {{ t("page_editor.add_block") }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              :class="closeButton({ class: rc.closeButton })"
              @click="open = false"
            />
          </div>
        </template>

        <div :class="body({ class: rc.body })">
          <div :class="searchClass({ class: rc.search })">
            <UInput
              v-model="searchQuery"
              icon="lucide:search"
              :placeholder="t('page_editor.search_blocks')"
              autofocus
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </div>

          <div :class="categoryList({ class: rc.categoryList })">
            <template v-if="Object.keys(groupedBlocks).length > 0">
              <div v-for="(blocks, category) in groupedBlocks" :key="category">
                <h4 :class="categoryHeader({ class: rc.categoryHeader })">
                  {{ category }}
                </h4>
                <div :class="blockGrid({ class: rc.blockGrid })">
                  <button
                    v-for="block in blocks"
                    :key="block.type"
                    :class="blockItem({ class: rc.blockItem })"
                    @click="handleSelect(block)"
                  >
                    <span :class="blockIcon({ class: rc.blockIcon })">
                      <UIcon :name="block.icon" size="20" />
                    </span>
                    <span class="flex-1 text-left">
                      <span class="flex items-center justify-between gap-2">
                        <span :class="blockLabel({ class: rc.blockLabel })">
                          {{ t(block.label) }}
                        </span>
                        <span :class="typeBadge()">
                          {{ block.type }}
                        </span>
                      </span>
                      <span
                        v-if="block.description"
                        :class="blockDescription({ class: rc.blockDescription })"
                        class="block"
                      >
                        {{ t(block.description) }}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </template>
            <div v-else :class="emptyState()">
              <UIcon name="lucide:search-slash" size="40" class="text-neutral-400 mb-4" />
              <p class="text-dimmed">
                {{ t("page_editor.no_blocks_found") }}
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div :class="footerClass({ class: rc.footer })">
            <UButton
              color="neutral"
              variant="ghost"
              :label="t('common.cancel')"
              @click="open = false"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped></style>
