<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface NewsletterSignupProps {
  title?: string;
  fieldLabel?: string;
  description?: string;
  placeholder?: string;
  submit?: string;
  buttonLabel?: string;
  rc?: {
    group?: string;
    label?: string;
    description?: string;
    input?: string;
    button?: string;
  };
}

const {
  title,
  fieldLabel,
  description,
  placeholder = "email@domain.com",
  submit,
  buttonLabel,
  rc: rcProp,
} = defineProps<NewsletterSignupProps>();

const resolvedFieldLabel = title ?? fieldLabel ?? "Subscribe to our Newsletter";
const resolvedButtonLabel = submit ?? buttonLabel ?? "Subscribe";
const resolvedDescription =
  description ?? "Stay updated on new posts and updates. Unsubscribe at any time.";

const { rc } = useRC("NewsletterSignup", rcProp);
/* endregion */

/* region Emits */
export interface NewsletterSignupEmits {
  // change: [id: number]
  // update: [value: string]
}

const emit = defineEmits<NewsletterSignupEmits>();
/* endregion */

/* region Slots */
export interface NewsletterSignupSlots {
  // default: (props: {}) => any
}

const slots = defineSlots<NewsletterSignupSlots>();
/* endregion */

/* region Styles */
const newsletterSignupStyles = tv({
  slots: {
    group: "pt-2",
  },
});

const { group } = newsletterSignupStyles();
type NewsletterSignupVariants = VariantProps<typeof newsletterSignupStyles>;
/* endregion */

/* region State */
// const ref1 = ref(0)
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Meta */
defineOptions({
  name: "NewsletterSignup",
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
/* endregion */
</script>

<template>
  <UForm>
    <UFormField
      name="email"
      :label="resolvedFieldLabel"
      :description="resolvedDescription"
      :ui="{ label: rc.label, description: rc.description }"
    >
      <UFieldGroup :class="group({ class: rc.group })">
        <UInput type="email" :placeholder="placeholder" :class="rc.input" />
        <UButton type="submit" :label="resolvedButtonLabel" :class="rc.button" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>

<style scoped></style>
