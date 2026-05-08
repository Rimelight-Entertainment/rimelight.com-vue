<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { tv } from "../../../internal/tv";
import { useRC } from "#composables";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface DeletePageModalProps {
  loading?: boolean;
  pageTitle: string;
  rc?: {
    header?: string;
    headerTitle?: string;
    closeButton?: string;
    body?: string;
    footer?: string;
  };
}

const { loading, pageTitle, rc: rcProp } = defineProps<DeletePageModalProps>();

const { rc } = useRC("DeletePageModal", rcProp);
/* endregion */

/* region Emits */
export interface DeletePageModalEmits {
  close: [];
  confirm: [];
}

const emits = defineEmits<DeletePageModalEmits>();
/* endregion */

/* region Slots */
export interface DeletePageModalSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<DeletePageModalSlots>();
/* endregion */

/* region Styles */
const deletePageModalStyles = tv({
  slots: {
    header: "flex items-center justify-between",
    headerTitle: "text-base font-semibold leading-6 text-error-600",
    closeButton: "-my-1",
    bodyClass: "text-sm text-neutral-600 dark:text-neutral-400",
    footer: "flex justify-end gap-2",
  },
});

const {
  header: headerClass,
  headerTitle,
  closeButton,
  bodyClass,
  footer,
} = deletePageModalStyles();
type DeletePageModalVariants = VariantProps<typeof deletePageModalStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();

const confirmationInput = ref("");
const CONFIRMATION_TEXT = "DELETE";
/* endregion */

/* region Meta */
defineOptions({
  name: "DeletePageModal",
});
/* endregion */

/* region Lifecycle */
// Reset input when modal closes
watch(open, (val) => {
  if (!val) {
    confirmationInput.value = "";
    emits("close");
  }
});

// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
const handleConfirm = () => {
  if (confirmationInput.value === CONFIRMATION_TEXT) {
    emits("confirm");
  }
};
/* endregion */
</script>

<template>
  <UModal v-model:open="open">
    <slot />
    <template #content>
      <UCard :ui="{ body: 'space-y-4' }">
        <template #header>
          <div :class="headerClass({ class: rc.header })">
            <h3 :class="headerTitle({ class: rc.headerTitle })">
              {{ t("editor.delete_page_title", "Delete Page") }}
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

        <div :class="bodyClass({ class: rc.body })">
          <p>
            Are you sure you want to delete <strong>{{ pageTitle }}</strong
            >? This action is permanent and cannot be undone.
          </p>
        </div>

        <UFormField
          :label="t('editor.delete_confirm_label', `Please type ${CONFIRMATION_TEXT} to confirm`)"
          required
        >
          <UInput
            v-model="confirmationInput"
            :placeholder="CONFIRMATION_TEXT"
            color="error"
            autocomplete="off"
            @keyup.enter="handleConfirm"
          />
        </UFormField>

        <template #footer>
          <div :class="footer({ class: rc.footer })">
            <UButton
              color="neutral"
              variant="ghost"
              :label="t('common.cancel', 'Cancel')"
              @click="open = false"
            />
            <UButton
              color="error"
              icon="lucide:trash-2"
              :label="t('editor.delete_button', 'Delete Permanently')"
              :loading="loading"
              :disabled="confirmationInput !== CONFIRMATION_TEXT"
              @click="handleConfirm"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped></style>
