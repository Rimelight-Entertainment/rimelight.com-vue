<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { type Page, type Link, type Localized } from "#types";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface PagePropertiesEditorProps {
  rc?: {
    aside?: string;
    icon?: string;
    titleInput?: string;
    type?: string;
    tags?: string;
    tabs?: string;
    image?: string;
    groupButton?: string;
    details?: string;
    field?: string;
    links?: string;
  };
  onFetchPages?: () => Promise<Pick<Page, "title" | "slug" | "type" | "id">[]>;
}

const { rc: rcProp, onFetchPages } = defineProps<PagePropertiesEditorProps>();

const { rc } = useRC("PagePropertiesEditor", rcProp);
/* endregion */

/* region Emits */
export interface PagePropertiesEditorEmits {}

const emit = defineEmits<PagePropertiesEditorEmits>();
/* endregion */

/* region Slots */
export interface PagePropertiesEditorSlots {}

const slots = defineSlots<PagePropertiesEditorSlots>();
/* endregion */

/* region Styles */
const pagePropertiesEditorStyles = tv({
  slots: {
    asideClass: "flex flex-col gap-md",
    iconClass: "rounded-full w-12 h-12 object-cover",
    titleInputClass: "w-full",
    typeClass: "text-sm",
    tagsClass: "flex flex-row flex-wrap gap-xs",
    tabsClass: "w-full",
    imageClass: "w-full object-cover",
    groupButtonClass: "group rounded-none bg-elevated text-default",
    detailsClass: "p-sm flex flex-col gap-xs",
    fieldClass: "w-full",
    linksClass: "flex flex-col gap-xs",
    headerContent: "flex flex-col gap-xs items-center",
    slugInput: "w-full opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity",
    linksHeader: "flex items-center justify-between mb-xs",
    linksTitle: "text-xs font-semibold uppercase tracking-wider text-dimmed",
    linksWrapper: "flex flex-col gap-xs",
    linkItem: "flex items-center justify-between group/link",
    linkActions: "flex items-center opacity-0 group-hover/link:opacity-100 transition-opacity",
    emptyLinks: "text-xs text-dimmed italic",
    modalBody: "flex flex-col gap-sm",
    modalGrid: "grid grid-cols-2 gap-sm",
    modalFooter: "flex justify-end gap-sm",
  },
});

const {
  asideClass,
  iconClass,
  titleInputClass,
  typeClass,
  tagsClass,
  tabsClass,
  imageClass,
  groupButtonClass,
  detailsClass,
  fieldClass,
  linksClass,
  headerContent,
  slugInput,
  linksHeader,
  linksTitle,
  linksWrapper,
  linkItem,
  linkActions,
  emptyLinks,
  modalBody,
  modalGrid,
  modalFooter,
} = pagePropertiesEditorStyles();
type PagePropertiesEditorVariants = VariantProps<typeof pagePropertiesEditorStyles>;
/* endregion */

/* region State */
const page = defineModel<Page>({ required: true });

const { getTypeLabelKey } = usePageRegistry();
const { isFieldVisible, shouldRenderGroup, getSortedFields, getSortedGroups } = useInfobox(
  () => page.value.properties,
);

const { locale, t } = useI18n();

const { data: allPages } = useAsyncData(
  "page-registry-editor",
  async () => {
    if (!onFetchPages) return [];
    return await onFetchPages();
  },
  {
    server: false,
    lazy: true,
  },
);

const pageItems = computed(() => {
  if (!allPages.value) return [];
  return (allPages.value as any[]).map((p) => ({
    label: getLocalizedContent(p.title as any, locale.value),
    value: p.id,
    type: p.type,
    slug: p.slug,
  }));
});

const imageTabs = computed<TabsItem[]>(() => {
  if (!page.value.images?.length) return [];

  return page.value.images.map((img, index) => {
    const localizedName = getLocalizedContent(img.name, locale.value);

    return {
      label: localizedName || `${t("label_image")} ${index + 1}`,
      value: `image-${index}`,
      img,
    };
  });
});

// Link editing state
const isLinkModalOpen = ref(false);
const editingLinkIndex = ref<number | null>(null);
const linkDraft = reactive<Partial<Link>>({
  label: "",
  to: "",
  icon: "",
  color: "neutral",
  variant: "link",
});

// Asset management state
const isAssetModalOpen = ref(false);
const assetSelectionTarget = ref<"icon" | "images" | "property-image" | null>(null);
const activePropertySchema = ref<any>(null);

// Image naming state
const isNamingModalOpen = ref(false);
const editingImageIndex = ref<number | null>(null);
const pendingImageSrc = ref("");
const imageDraftName = ref("");
/* endregion */

/* region Meta */
defineOptions({
  name: "PagePropertiesEditor",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
/**
 * Returns a subset of pageItems filtered by the provided allowed types.
 */
function getFilteredPageItems(allowedTypes?: string[]) {
  if (!allowedTypes || !allowedTypes.length) return pageItems.value;
  return pageItems.value.filter((item) => allowedTypes.includes(item.type));
}

/**
 * Handles text-array updates specifically for the 'en' locale.
 */
function updateTextArray(schema: any, vals: (string | Localized)[]) {
  const currentDefault = (schema.defaultValue as Localized[]) || [];
  schema.defaultValue = vals.map((val) => {
    if (typeof val === "object" && val !== null) {
      return val;
    }

    const str = val as string;
    // Preserve other locales if they exist
    const existing = currentDefault.find((i: any) => i && typeof i === "object" && i.en === str);
    if (existing) {
      return { ...existing, en: str };
    }

    return { en: str };
  });
}

function openLinkModal(index: number | null = null) {
  editingLinkIndex.value = index;
  if (index !== null && page.value.links?.[index]) {
    const link = page.value.links[index];
    linkDraft.label = link.label;
    linkDraft.to = link.to;
    linkDraft.icon = link.icon;
    linkDraft.color = link.color || "neutral";
    linkDraft.variant = link.variant || "link";
  } else {
    linkDraft.label = "";
    linkDraft.to = "";
    linkDraft.icon = "";
    linkDraft.color = "neutral";
    linkDraft.variant = "link";
  }
  isLinkModalOpen.value = true;
}

function saveLink() {
  if (!linkDraft.label || !linkDraft.to) return;

  if (!page.value.links) page.value.links = [];

  const newLink: Link = {
    label: linkDraft.label,
    to: linkDraft.to!,
    icon: linkDraft.icon,
    color: (linkDraft.color as any) || "neutral",
    variant: (linkDraft.variant as any) || "link",
  };

  if (editingLinkIndex.value !== null) {
    page.value.links[editingLinkIndex.value] = newLink;
  } else {
    page.value.links.push(newLink);
  }

  isLinkModalOpen.value = false;
}

function removeLink(index: number) {
  if (page.value.links) {
    page.value.links.splice(index, 1);
  }
}

/**
 * Robust object comparison for USelectMenu
 */
function compareValues(a: any, b: any) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  // If both are objects, try stringified comparison first
  if (typeof a === "object" && typeof b === "object") {
    if (JSON.stringify(a) === JSON.stringify(b)) return true;
  }

  // Fallback to localized string comparison for mixed or complex types
  const valA = typeof a === "object" ? getLocalizedContent(a, locale.value) : String(a);
  const valB = typeof b === "object" ? getLocalizedContent(b, locale.value) : String(b);

  return valA === valB && valA !== "";
}

function normalizePageValue(val: any) {
  if (!val) return undefined;
  const str = typeof val === "object" ? getLocalizedContent(val, locale.value) : String(val);
  // Find matching item by ID or Slug
  const matched = pageItems.value.find((p) => p.slug === str || p.value === str);
  return matched ? matched.value : str;
}

function normalizePageArrayValue(val: any) {
  if (!Array.isArray(val)) return [];
  return val.map((v) => normalizePageValue(v));
}

function openAssetPicker(target: "icon" | "images") {
  assetSelectionTarget.value = target;
  isAssetModalOpen.value = true;
}

function onAssetSelected(key: string) {
  const encodedKey = key
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  const src = `/api/assets/${encodedKey}`;

  if (assetSelectionTarget.value === "icon") {
    page.value.icon = { src, alt: page.value.title.en || "Icon" };
  } else if (assetSelectionTarget.value === "images") {
    const images = page.value.images;
    const index = editingImageIndex.value;
    if (images && index !== null) {
      const targetImg = images[index];
      if (targetImg) {
        targetImg.src = src;
      }
    } else {
      pendingImageSrc.value = src;
      imageDraftName.value = "";
      isNamingModalOpen.value = true;
    }
  }

  isAssetModalOpen.value = false;
  assetSelectionTarget.value = null;
}

function openImageEditor(index: number) {
  const img = page.value.images?.[index];
  if (!img) return;

  editingImageIndex.value = index;
  pendingImageSrc.value = img.src;
  imageDraftName.value = getLocalizedContent(img.name, locale.value) || "";
  isNamingModalOpen.value = true;
}

function confirmImageAddition() {
  if (!page.value.images) page.value.images = [];

  const imageData = {
    src: pendingImageSrc.value,
    alt: page.value.title.en || "Page Image",
    name: { en: imageDraftName.value || `Image ${page.value.images.length + 1}` },
  };

  if (editingImageIndex.value !== null) {
    page.value.images[editingImageIndex.value] = {
      ...page.value.images[editingImageIndex.value],
      ...imageData,
    };
  } else {
    page.value.images.push(imageData);
  }

  isNamingModalOpen.value = false;
  editingImageIndex.value = null;
  pendingImageSrc.value = "";
  imageDraftName.value = "";
}

function removeImage(index: number) {
  if (page.value.images) {
    page.value.images.splice(index, 1);
  }
}
/* endregion */
</script>

<template>
  <aside :class="asideClass({ class: rc.aside })">
    <UCard
      variant="soft"
      :ui="{
        root: 'divide-none',
        header: 'bg-accented text-center',
        body: 'p-0 sm:p-0 bg-muted',
      }"
    >
      <template #header>
        <div :class="headerContent()">
          <div class="relative group/icon mb-xs">
            <RLImage
              v-if="page.icon?.src"
              :src="page.icon?.src"
              :alt="page.icon?.alt"
              :class="iconClass({ class: rc.icon })"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-default"
            >
              <UIcon name="lucide:image" class="size-6 text-dimmed" />
            </div>
            <UButton
              icon="lucide:pencil"
              size="xs"
              variant="solid"
              color="neutral"
              class="absolute -bottom-1 -right-1 opacity-0 group-hover/icon:opacity-100 transition-opacity rounded-full p-1"
              @click="openAssetPicker('icon')"
            />
          </div>

          <UInput
            v-model="page.title.en"
            variant="subtle"
            placeholder="Enter page title..."
            size="xl"
            :ui="{ base: 'text-center font-bold text-lg' }"
            :class="titleInputClass({ class: rc.titleInput })"
          />

          <UInput
            v-model="page.slug"
            variant="subtle"
            placeholder="page-slug"
            size="xs"
            :ui="{ base: 'text-center text-dimmed font-mono' }"
            :class="slugInput()"
          >
            <template #leading>
              <span class="text-gray-500 dark:text-gray-400 text-xs text-dimmed">/</span>
            </template>
          </UInput>

          <span :class="typeClass({ class: rc.type })">{{ t(getTypeLabelKey(page.type)) }}</span>

          <div v-if="page.tags?.length" :class="tagsClass({ class: rc.tags })">
            <UBadge
              v-for="tag in page.tags"
              :key="getLocalizedContent(tag, locale)"
              variant="soft"
              size="xs"
              color="neutral"
            >
              {{ getLocalizedContent(tag, locale) }}
            </UBadge>
          </div>

          <div class="w-full flex flex-col gap-xs mt-sm">
            <div class="flex items-center justify-between pointer-events-auto px-xs">
              <span class="text-[10px] font-bold uppercase text-dimmed">{{
                t("page_properties.images", "Images")
              }}</span>
              <UButton
                icon="lucide:plus"
                size="xs"
                variant="ghost"
                color="primary"
                @click="openAssetPicker('images')"
              />
            </div>
            <div v-if="page.images?.length" class="w-full">
              <UTabs
                v-if="page.images.length > 1"
                :items="imageTabs"
                default-value="image-0"
                variant="link"
                size="xs"
                color="neutral"
                :class="tabsClass({ class: rc.tabs })"
              >
                <template #content="{ item }">
                  <div class="relative group/image-tab">
                    <RLImage
                      :src="item.img.src"
                      :alt="item.img.alt"
                      :class="imageClass({ class: rc.image })"
                    />
                    <div
                      class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/image-tab:opacity-100 transition-opacity"
                    >
                      <UButton
                        icon="lucide:pencil"
                        size="xs"
                        variant="solid"
                        color="neutral"
                        @click="openImageEditor(imageTabs.indexOf(item))"
                      />
                      <UButton
                        icon="lucide:trash-2"
                        size="xs"
                        variant="solid"
                        color="error"
                        @click="removeImage(imageTabs.indexOf(item))"
                      />
                    </div>
                  </div>
                </template>
              </UTabs>

              <div v-else-if="page.images[0]" class="relative group/image-tab">
                <RLImage
                  :src="page.images[0].src"
                  :alt="page.images[0].alt"
                  :class="imageClass({ class: rc.image })"
                />
                <div
                  class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/image-tab:opacity-100 transition-opacity"
                >
                  <UButton
                    icon="lucide:pencil"
                    size="xs"
                    variant="solid"
                    color="neutral"
                    @click="openImageEditor(0)"
                  />
                  <UButton
                    icon="lucide:trash-2"
                    size="xs"
                    variant="solid"
                    color="error"
                    @click="removeImage(0)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <template v-for="[groupId, group] in getSortedGroups(page.properties)" :key="groupId">
          <UCollapsible v-if="shouldRenderGroup(group, false)" :default-open="group.defaultOpen">
            <template #default>
              <UButton
                :label="getLocalizedContent(group.label, locale)"
                variant="soft"
                trailing-icon="lucide:chevron-down"
                :ui="{
                  trailingIcon:
                    'group-data-[state=open]:rotate-180 transition-transform duration-200',
                }"
                block
                :class="groupButtonClass({ class: rc.groupButton })"
              />
            </template>

            <template #content>
              <ClientOnly>
                <dl :class="detailsClass({ class: rc.details })">
                  <template
                    v-for="[fieldKey, schema] in getSortedFields(group.fields)"
                    :key="fieldKey"
                  >
                    <UFormField
                      v-if="isFieldVisible(schema, false)"
                      :label="getLocalizedContent(schema.label, locale)"
                      :name="fieldKey"
                    >
                      <UInput
                        v-if="schema.type === 'text'"
                        :model-value="
                          typeof schema.defaultValue === 'object'
                            ? schema.defaultValue[locale]
                            : schema.defaultValue
                        "
                        variant="subtle"
                        placeholder="Type here..."
                        :class="fieldClass({ class: rc.field })"
                        @update:model-value="
                          (val: string) => {
                            if (typeof schema.defaultValue === 'object') {
                              schema.defaultValue[locale] = val;
                            } else {
                              schema.defaultValue = val;
                            }
                          }
                        "
                      />

                      <UInput
                        v-else-if="schema.type === 'number'"
                        v-model.number="schema.defaultValue"
                        type="number"
                        variant="subtle"
                        :class="fieldClass({ class: rc.field })"
                      />

                      <USelectMenu
                        v-else-if="schema.type === 'enum' && schema.options"
                        v-model="schema.defaultValue"
                        :items="
                          schema.options.map((opt: any) =>
                            typeof opt === 'string'
                              ? { label: opt, value: opt }
                              : { label: getLocalizedContent(opt, locale), value: opt },
                          )
                        "
                        value-key="value"
                        variant="subtle"
                        :class="fieldClass({ class: rc.field })"
                      >
                        <template #default>
                          <span v-if="schema.defaultValue">
                            {{
                              typeof schema.defaultValue === "string"
                                ? schema.defaultValue
                                : getLocalizedContent(schema.defaultValue, locale) || "Selected"
                            }}
                          </span>
                          <span v-else class="text-dimmed"> Select... </span>
                        </template>
                      </USelectMenu>

                      <UInputMenu
                        v-else-if="schema.type === 'text-array'"
                        :model-value="
                          (schema.defaultValue as any[])?.map((v: any) => v?.en ?? v) || []
                        "
                        :items="schema.options || []"
                        multiple
                        creatable
                        variant="subtle"
                        placeholder="Add item..."
                        :class="fieldClass({ class: rc.field })"
                        @update:model-value="(vals: any) => updateTextArray(schema, vals)"
                      />

                      <USelectMenu
                        v-else-if="schema.type === 'page'"
                        :model-value="normalizePageValue(schema.defaultValue)"
                        @update:model-value="(val: any) => (schema.defaultValue = val)"
                        :items="getFilteredPageItems(schema.allowedPageTypes)"
                        value-key="value"
                        searchable
                        icon="lucide:link-2"
                        variant="subtle"
                        :placeholder="`Select ${schema.allowedPageTypes?.join('/') || 'page'}...`"
                        :class="fieldClass({ class: rc.field })"
                      >
                        <template #default>
                          <span v-if="schema.defaultValue">
                            {{
                              pageItems.find(
                                (p) =>
                                  compareValues(p.value, schema.defaultValue) ||
                                  compareValues(p.slug, schema.defaultValue),
                              )?.label ||
                              (typeof schema.defaultValue === "object"
                                ? getLocalizedContent(schema.defaultValue, locale)
                                : schema.defaultValue)
                            }}
                          </span>
                          <span v-else class="text-dimmed"> None </span>
                        </template>
                      </USelectMenu>

                      <USelectMenu
                        v-else-if="schema.type === 'page-array'"
                        :model-value="normalizePageArrayValue(schema.defaultValue)"
                        @update:model-value="(val: any) => (schema.defaultValue = val)"
                        :items="getFilteredPageItems(schema.allowedPageTypes)"
                        value-key="value"
                        searchable
                        multiple
                        icon="lucide:link-2"
                        variant="subtle"
                        :placeholder="`Select ${schema.allowedPageTypes?.join('/') || 'pages'}...`"
                        :class="fieldClass({ class: rc.field })"
                      >
                        <template #default>
                          <span
                            v-if="Array.isArray(schema.defaultValue) && schema.defaultValue.length"
                          >
                            {{ schema.defaultValue.length }} selected
                          </span>
                          <span v-else class="text-dimmed"> None </span>
                        </template>
                      </USelectMenu>
                    </UFormField>
                  </template>
                </dl>
              </ClientOnly>
            </template>
          </UCollapsible>
        </template>
      </template>
    </UCard>
    <div :class="linksClass({ class: rc.links })">
      <div :class="linksHeader()">
        <h6 :class="linksTitle()">
          {{ t("page_properties.links", "Links") }}
        </h6>
        <UButton
          icon="lucide:plus"
          size="xs"
          variant="ghost"
          color="primary"
          @click="openLinkModal()"
        />
      </div>

      <div v-if="page.links?.length" :class="linksWrapper()">
        <div v-for="(item, index) in page.links" :key="index" :class="linkItem()">
          <UButton
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :target="item.to?.startsWith('http') ? '_blank' : undefined"
            :external="item.to?.startsWith('http')"
            :variant="item.variant || 'link'"
            :color="item.color || 'neutral'"
            size="sm"
            :ui="{ base: 'pl-0' }"
          />
          <div :class="linkActions()">
            <UButton
              icon="lucide:pencil"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="openLinkModal(index)"
            />
            <UButton
              icon="lucide:trash-2"
              size="xs"
              variant="ghost"
              color="error"
              @click="removeLink(index)"
            />
          </div>
        </div>
      </div>
      <p v-else :class="emptyLinks()">
        {{ t("page_properties.no_links", "No links added") }}
      </p>

      <!-- Link management modal -->
      <UModal v-model:open="isLinkModalOpen">
        <template #content>
          <UCard>
            <template #header>
              <h4 class="font-bold">
                {{
                  editingLinkIndex !== null
                    ? t("page_properties.edit_link", "Edit Link")
                    : t("page_properties.add_link", "Add Link")
                }}
              </h4>
            </template>
            <div :class="modalBody()">
              <UFormField :label="t('page_properties.label', 'Label')">
                <UInput v-model="linkDraft.label" placeholder="Check my GitHub" class="w-full" />
              </UFormField>
              <UFormField :label="t('page_properties.url', 'URL')">
                <UInput
                  v-model="linkDraft.to"
                  placeholder="https://github.com/..."
                  class="w-full"
                />
              </UFormField>
              <UFormField :label="t('page_properties.icon', 'Icon')">
                <UInput v-model="linkDraft.icon" placeholder="lucide:github" class="w-full" />
              </UFormField>
              <div :class="modalGrid()">
                <UFormField :label="t('page_properties.color', 'Color')">
                  <USelect
                    v-model="linkDraft.color"
                    :items="[
                      'primary',
                      'secondary',
                      'neutral',
                      'error',
                      'warning',
                      'success',
                      'info',
                      'info',
                    ]"
                    class="w-full"
                  />
                </UFormField>
                <UFormField :label="t('page_properties.variant', 'Variant')">
                  <USelect
                    v-model="linkDraft.variant"
                    :items="['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>

            <template #footer>
              <div :class="modalFooter()">
                <UButton
                  :label="t('common.cancel', 'Cancel')"
                  variant="ghost"
                  color="neutral"
                  @click="isLinkModalOpen = false"
                />
                <UButton
                  :label="
                    editingLinkIndex !== null
                      ? t('page_properties.update_link', 'Update')
                      : t('page_properties.add_link', 'Add')
                  "
                  color="primary"
                  @click="saveLink"
                />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>

      <!-- Asset Manager Picker -->
      <RLAssetManagerModal
        v-model:open="isAssetModalOpen"
        selection-mode
        @select="onAssetSelected"
      />

      <!-- Image Naming Modal -->
      <UModal
        v-model:open="isNamingModalOpen"
        :title="
          editingImageIndex !== null
            ? t('page_properties.edit_image_title', 'Edit Image')
            : t('page_properties.image_name_title', 'Name Image')
        "
      >
        <template #body>
          <div class="flex flex-col gap-md">
            <div
              class="relative group/edit-preview aspect-video rounded-md overflow-hidden bg-muted border border-default"
            >
              <RLImage
                v-if="pendingImageSrc"
                :src="pendingImageSrc"
                class="size-full object-cover"
              />
              <UButton
                icon="lucide:pencil"
                size="xs"
                variant="solid"
                color="neutral"
                class="absolute top-2 right-2 opacity-0 group-hover/edit-preview:opacity-100 transition-opacity"
                @click="openAssetPicker('images')"
              />
            </div>

            <UFormField :label="t('page_properties.image_name', 'Image Name')">
              <UInput
                v-model="imageDraftName"
                :placeholder="t('page_properties.image_name_placeholder', 'Enter image name...')"
                autofocus
                @keydown.enter="confirmImageAddition"
              />
            </UFormField>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-sm">
            <UButton
              :label="t('common.cancel')"
              variant="ghost"
              color="neutral"
              @click="
                () => {
                  isNamingModalOpen = false;
                  editingImageIndex = null;
                }
              "
            />
            <UButton
              :label="editingImageIndex !== null ? t('common.save') : t('common.add')"
              color="primary"
              @click="confirmImageAddition"
            />
          </div>
        </template>
      </UModal>
    </div>
  </aside>
</template>

<style scoped></style>
