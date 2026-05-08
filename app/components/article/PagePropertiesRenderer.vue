<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { type Page } from "~/types";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface PagePropertiesRendererProps {
  canEdit?: boolean;
  editUrl?: string;
  rc?: {
    aside?: string;
    actions?: string;
    icon?: string;
    title?: string;
    type?: string;
    tags?: string;
    tabs?: string;
    image?: string;
    groupButton?: string;
    details?: string;
    field?: string;
    fieldLabel?: string;
    fieldValue?: string;
    list?: string;
    listItem?: string;
    pageArrayList?: string;
    pageArrayItem?: string;
    pageArrayBullet?: string;
    links?: string;
  };
}

const { canEdit = false, editUrl, rc: rcProp } = defineProps<PagePropertiesRendererProps>();

const { rc } = useRC("PagePropertiesRenderer", rcProp);
/* endregion */

/* region Emits */
export interface PagePropertiesRendererEmits {}

const emit = defineEmits<PagePropertiesRendererEmits>();
/* endregion */

/* region Slots */
export interface PagePropertiesRendererSlots {}

const slots = defineSlots<PagePropertiesRendererSlots>();
/* endregion */

/* region Styles */
const pagePropertiesRendererStyles = tv({
  slots: {
    asideClass: "flex flex-col gap-md",
    actionsClass: "flex flex-row justify-between gap-sm",
    iconClass: "rounded-full w-12 h-12 object-cover",
    titleClass: "",
    typeClass: "text-sm",
    tagsClass: "flex flex-row flex-wrap gap-xs",
    tabsClass: "w-full",
    imageClass: "w-full object-cover",
    groupButtonClass: "group rounded-none bg-elevated text-default",
    detailsClass: "p-sm flex flex-col gap-xs",
    fieldClass: "grid grid-cols-3 gap-xs items-baseline",
    fieldLabelClass: "text-xs font-semibold text-dimmed",
    fieldValueClass: "text-xs col-span-2",
    listClass: "flex flex-col list-disc list-inside",
    listItemClass: "font-medium",
    pageArrayListClass: "flex flex-col gap-y-1",
    pageArrayItemClass: "flex items-center gap-x-2",
    pageArrayBulletClass: "w-1 h-1 rounded-full bg-inverted shrink-0",
    linksClass: "flex flex-col gap-xs",
    actionGroup: "flex flex-row gap-sm",
    headerContent: "flex flex-col gap-xs items-center",
    imageWrapper: "w-full",
  },
});

const {
  asideClass,
  actionsClass,
  iconClass,
  titleClass,
  typeClass,
  tagsClass,
  tabsClass,
  imageClass,
  groupButtonClass,
  detailsClass,
  fieldClass,
  fieldLabelClass,
  fieldValueClass,
  listClass,
  listItemClass,
  pageArrayListClass,
  pageArrayItemClass,
  pageArrayBulletClass,
  linksClass,
  actionGroup,
  headerContent,
  imageWrapper,
} = pagePropertiesRendererStyles();
type PagePropertiesRendererVariants = VariantProps<typeof pagePropertiesRendererStyles>;
/* endregion */

/* region State */
const page = defineModel<Page>({ required: true });

const { getTypeLabelKey } = usePageRegistry();
const { isFieldVisible, shouldRenderGroup, getSortedFields, getSortedGroups } = useInfobox(
  () => page.value.properties,
);

const { t, locale } = useI18n();
const { share } = useShare();
const { copy } = useClipboard();
const toast = useToast();

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
/* endregion */

/* region Meta */
defineOptions({
  name: "PagePropertiesRenderer",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
const sharePage = async () => {
  if (!page.value) {
    return;
  }

  try {
    await share({
      title: getLocalizedContent(page.value.title, locale),
      text: getLocalizedContent(page.value.description, locale),
      url: typeof location !== "undefined" ? location.href : "",
    });
  } catch {
    toast.add({
      color: "error",
      title: "toast_share-page_error_title",
      description: "toast_share-page_error_description",
    });
  }
};

const copyLink = async () => {
  try {
    await copy(typeof location !== "undefined" ? location.href : "");
    toast.add({
      color: "success",
      title: "toast_copy-page-link_success_title",
      description: typeof location !== "undefined" ? location.href : "",
    });
  } catch {
    toast.add({
      color: "error",
      title: "toast_copy-page-link_error_title",
      description: "toast_copy-page-link_error_description",
    });
  }
};
/* endregion */
</script>

<template>
  <aside :class="asideClass({ class: rc.aside })">
    <div :class="actionsClass({ class: rc.actions })">
      <div :class="actionGroup()">
        <UButton
          variant="soft"
          color="neutral"
          icon="lucide:share"
          size="sm"
          @click="sharePage()"
        />
        <UButton variant="soft" color="neutral" icon="lucide:link" size="sm" @click="copyLink()" />
      </div>
      <div v-if="canEdit && editUrl" :class="actionGroup()">
        <UButton variant="soft" color="neutral" icon="lucide:pencil" size="sm" :to="editUrl" />
      </div>
    </div>
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
          <RLImage
            v-if="page.icon?.src"
            :src="page.icon?.src"
            :alt="page.icon?.alt"
            :class="iconClass({ class: rc.icon })"
          />

          <h3 :class="titleClass({ class: rc.title })">
            {{ getLocalizedContent(page.title, locale) }}
          </h3>

          <span :class="typeClass({ class: rc.type })">{{ t(getTypeLabelKey(page.type)) }}</span>

          <div v-if="page.tags?.length" :class="tagsClass({ class: rc.tags })">
            <UBadge
              v-for="(tag, index) in page.tags"
              :key="index"
              variant="soft"
              size="xs"
              color="neutral"
            >
              {{ getLocalizedContent(tag, locale) }}
            </UBadge>
          </div>

          <div v-if="page.images?.length" :class="imageWrapper()">
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
                <RLImage
                  :src="item.img.src"
                  :alt="item.img.alt"
                  :class="imageClass({ class: rc.image })"
                />
              </template>
            </UTabs>

            <div v-else-if="page.images[0]">
              <RLImage
                :src="page.images[0].src"
                :alt="page.images[0].alt"
                :class="imageClass({ class: rc.image })"
              />
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <template v-for="[groupId, group] in getSortedGroups(page.properties)" :key="groupId">
          <UCollapsible v-if="shouldRenderGroup(group, true)" :default-open="group.defaultOpen">
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
              <dl :class="detailsClass({ class: rc.details })">
                <template
                  v-for="[fieldKey, schema] in getSortedFields(group.fields)"
                  :key="fieldKey"
                >
                  <div v-if="isFieldVisible(schema, true)" :class="fieldClass({ class: rc.field })">
                    <dt :class="fieldLabelClass({ class: rc.fieldLabel })">
                      {{ getLocalizedContent(schema.label, locale) }}
                    </dt>

                    <dd :class="fieldValueClass({ class: rc.fieldValue })">
                      <span v-if="schema.type === 'text'">
                        {{ getLocalizedContent(schema.defaultValue, locale) }}
                      </span>
                      <ul
                        v-else-if="
                          schema.type === 'text-array' && Array.isArray(schema.defaultValue)
                        "
                        :class="listClass({ class: rc.list })"
                      >
                        <li v-for="(item, index) in schema.defaultValue" :key="index">
                          <span :class="listItemClass({ class: rc.listItem })">
                            {{ getLocalizedContent(item, locale) }}
                          </span>
                        </li>
                      </ul>
                      <template v-if="schema.type === 'page' && schema.defaultValue">
                        <RLPageMention
                          v-if="
                            typeof schema.defaultValue === 'string'
                              ? !!schema.defaultValue
                              : !!getLocalizedContent(schema.defaultValue, locale)
                          "
                          :page-id="
                            String(
                              typeof schema.defaultValue === 'object'
                                ? schema.defaultValue.id ||
                                    schema.defaultValue.value ||
                                    getLocalizedContent(schema.defaultValue, locale)
                                : schema.defaultValue,
                            )
                          "
                        />
                      </template>

                      <ul
                        v-else-if="
                          schema.type === 'page-array' && Array.isArray(schema.defaultValue)
                        "
                        :class="pageArrayListClass({ class: rc.pageArrayList })"
                      >
                        <template v-for="(id, idx) in schema.defaultValue" :key="idx">
                          <li
                            v-if="typeof id === 'string' ? !!id : !!getLocalizedContent(id, locale)"
                            :class="pageArrayItemClass({ class: rc.pageArrayItem })"
                          >
                            <RLPageMention
                              :page-id="
                                String(
                                  typeof id === 'object'
                                    ? id.id || id.value || getLocalizedContent(id, locale)
                                    : id,
                                )
                              "
                            />
                          </li>
                        </template>
                      </ul>

                      <span v-else-if="schema.type === 'enum' && schema.defaultValue">
                        {{ getLocalizedContent(schema.defaultValue, locale) }}
                      </span>

                      <span v-else-if="schema.type === 'number'">
                        {{ schema.defaultValue }}
                      </span>

                      <span v-else-if="schema.defaultValue">
                        {{ getLocalizedContent(schema.defaultValue, locale) }}
                      </span>
                    </dd>
                  </div>
                </template>
              </dl>
            </template>
          </UCollapsible>
        </template>
      </template>
    </UCard>
    <div :class="linksClass({ class: rc.links })">
      <h6>Links</h6>
      <UButton
        v-for="(linkItem, index) in page.links"
        :key="index"
        :label="linkItem.label"
        :icon="linkItem.icon"
        :to="linkItem.to"
        :target="linkItem.to ? '_blank' : undefined"
        :external="!!linkItem.to"
        :variant="linkItem.variant || 'link'"
        :color="linkItem.color || 'neutral'"
        size="sm"
        :ui="{ base: 'pl-0' }"
      />
    </div>
  </aside>
</template>

<style scoped></style>
