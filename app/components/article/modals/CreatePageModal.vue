<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { type PageDefinition, type PageType, type Page } from "~/types";
import { tv } from "../../../internal/tv";
import { useRC } from "../../../composables/components/useRC";
import { useI18n } from "vue-i18n";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface CreatePageModalProps {
  definitions: Record<string, PageDefinition>;
  loading?: boolean;
  rc?: {
    header?: string;
    headerTitle?: string;
    closeButton?: string;
    body?: string;
    field?: string;
    footer?: string;
  };
}

const { loading, definitions, rc: rcProp } = defineProps<CreatePageModalProps>();

const { rc } = useRC("CreatePageModal", rcProp);
/* endregion */

/* region Emits */
export interface CreatePageModalEmits {
  close: [];
  confirm: [page: Partial<Page>];
}

const emit = defineEmits<CreatePageModalEmits>();
/* endregion */

/* region Slots */
export interface CreatePageModalSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<CreatePageModalSlots>();
/* endregion */

/* region Styles */
const createPageModalStyles = tv({
  slots: {
    header: "flex items-center justify-between",
    headerTitle: "text-base font-semibold leading-6",
    closeButton: "-my-1",
    body: "space-y-4 py-4",
    field: "w-full",
    footer: "flex justify-end gap-2",
  },
});

const {
  header: headerClass,
  headerTitle,
  closeButton,
  body,
  field,
  footer,
} = createPageModalStyles();
type CreatePageModalVariants = VariantProps<typeof createPageModalStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();

const selectedType = ref<PageType | "">("");
const title = ref("");
const slug = ref("");

const typeOptions = computed(() => {
  return Object.entries(definitions).map(([key, def]) => ({
    label: t(def.typeLabelKey) === def.typeLabelKey ? key : t(def.typeLabelKey),
    value: key,
  }));
});
/* endregion */

/* region Meta */
defineOptions({
  name: "CreatePageModal",
});
/* endregion */

/* region Lifecycle */
// Basic slug auto-generation
watch(title, (newTitle) => {
  slug.value = newTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
});

watch(open, (isOpen) => {
  if (!isOpen) {
    emit("close");
  }
});

// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
const handleConfirm = () => {
  if (!selectedType.value) return;

  const definition = definitions[selectedType.value];

  // 2. Explicitly check if definition exists to satisfy TS
  if (!definition) {
    console.error(`Definition for type "${selectedType.value}" not found.`);
    return;
  }

  // Initialize properties from definition defaults using the correct structure
  const properties: Record<string, any> = {};
  Object.entries(definition.properties).forEach(([groupKey, group]) => {
    properties[groupKey] = {
      ...group,
      fields: {},
    };
    Object.entries(group.fields).forEach(([fieldKey, field]) => {
      properties[groupKey].fields[fieldKey] = { ...field };
    });
  });

  const newPage: Partial<Page> = {
    type: selectedType.value as any,
    title: { en: title.value },
    slug: slug.value,
    properties: properties as any,
    blocks: definition.initialBlocks ? definition.initialBlocks() : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  emit("confirm", newPage);
};
/* endregion */
</script>

<template>
  <UModal v-model:open="open">
    <slot />
    <template #content>
      <UCard>
        <template #header>
          <div :class="headerClass({ class: rc.header })">
            <h3 :class="headerTitle({ class: rc.headerTitle })">Create New Page</h3>
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
          <UFormField :label="t('page_properties.page_template')" required>
            <USelect
              v-model="selectedType"
              :items="typeOptions"
              :placeholder="t('editor.template_placeholder', 'Select a template...')"
              :class="field({ class: rc.field })"
            />
          </UFormField>

          <UFormField :label="t('page_properties.title')" required>
            <UInput v-model="title" placeholder="e.g. My Awesome Movie" />
          </UFormField>

          <UFormField :label="t('page_properties.slug')" required>
            <UInput v-model="slug" placeholder="my-awesome-movie" />
          </UFormField>
        </div>

        <template #footer>
          <div :class="footer({ class: rc.footer })">
            <UButton
              color="neutral"
              variant="ghost"
              :label="t('common.cancel')"
              @click="open = false"
            />
            <UButton
              color="primary"
              :label="t('page_properties.create_and_edit')"
              :loading="loading"
              :disabled="!selectedType || !title"
              @click="handleConfirm"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped></style>
