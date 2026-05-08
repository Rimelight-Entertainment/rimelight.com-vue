<script setup lang="ts">
import { z } from "zod";
import { reactive, ref } from "vue";
import type { FormSubmitEvent } from "#ui/types";
import { useToast } from "@nuxt/ui/composables/useToast";
import { useAuth } from "../../composables/auth/useAuth";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface AuthSignInFormProps {
  recovery?: boolean;
  terms?: boolean;
  remember?: boolean;
  rc?: {
    root?: string;
    form?: string;
    input?: string;
    label?: string;
    description?: string;
    help?: string;
    button?: string;
    submit?: string;
    rememberCheckbox?: string;
    rememberCheckboxIndicator?: string;
    rememberText?: string;
    emailField?: string;
    passwordWrapper?: string;
    footerWrapper?: string;
    termsLink?: string;
  };
}

const { recovery = true, terms = true, remember = true, rc } = defineProps<AuthSignInFormProps>();
/* endregion */

/* region Emits */
export interface AuthSignInFormEmits {}

const emit = defineEmits<AuthSignInFormEmits>();
/* endregion */

/* region Slots */
export interface AuthSignInFormSlots {
  "email-help": (props: {}) => any;
  "password-help": (props: {}) => any;
  footer: (props: {}) => any;
}

const slots = defineSlots<AuthSignInFormSlots>();
/* endregion */

/* region Styles */
const authSignInFormStyles = tv({
  slots: {
    root: "w-full flex flex-col gap-lg max-w-md",
    form: "flex flex-col gap-md text-left",
    input: "w-full",
    label: "",
    description: "text-sm text-dimmed",
    help: "text-xs text-dimmed",
    button: "",
    submit: "",
    rememberCheckbox: "",
    rememberCheckboxIndicator: "",
    rememberText: "",
    emailField: "text-black",
    passwordWrapper: "flex flex-col gap-sm",
    footerWrapper: "text-center text-sm text-black",
    termsLink: "font-medium text-primary hover:text-dimmed",
  },
});

const {
  root,
  form,
  input,
  label: labelStyles,
  description: descriptionStyles,
  help: helpStyles,
  button: buttonStyles,
  submit: submitStyles,
  rememberCheckbox: rememberCheckboxStyles,
  rememberCheckboxIndicator: rememberCheckboxIndicatorStyles,
  rememberText: rememberTextStyles,
  emailField,
  passwordWrapper,
  footerWrapper,
  termsLink,
} = authSignInFormStyles();
type AuthSignInFormVariants = VariantProps<typeof authSignInFormStyles>;
/* endregion */

/* region State */
const { signIn, isLoading } = useAuth();
const { t } = useI18n();
const toast = useToast();
const route = useRoute();

const schema = z.object({
  email: z.email({ message: t("auth_email_invalid") }),
  password: z.string().min(8, t("auth_password_min_length")),
  rememberMe: z.boolean(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
  rememberMe: remember,
});

const showPassword = ref(false);
/* endregion */

/* region Meta */
defineOptions({
  name: "AuthSignInForm",
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
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const redirect = route.query.redirect as string | undefined;
  const { data, error } = await signIn(
    {
      email: event.data.email as string,
      password: event.data.password as string,
      rememberMe: event.data.rememberMe,
    },
    redirect,
  );

  if (error) {
    toast.add({
      color: "error",
      title: t("auth_sign_in_failed_title"),
      description: error.message || t("auth_connection_error_description"),
    });
    return;
  }

  toast.add({
    color: "success",
    title: t("auth_sign_in_success_title"),
    description: t("auth_sign_in_success_description", { name: data?.user?.name || "User" }),
  });
}
/* endregion */
</script>

<template>
  <div :class="root({ class: rc?.root })">
    <UForm :schema="schema" :state="state" :class="form({ class: rc?.form })" @submit="onSubmit">
      <UFormField
        :label="t('auth_email_label')"
        name="email"
        :description="t('auth_email_description')"
        required
        :class="emailField({ class: rc?.emailField })"
        :ui="{
          label: labelStyles({ class: rc?.label }),
          description: descriptionStyles({ class: rc?.description }),
          help: helpStyles({ class: rc?.help }),
        }"
      >
        <UInput
          v-model="state.email"
          type="email"
          :placeholder="t('auth_email_placeholder')"
          :class="input({ class: rc?.input })"
        >
          <template v-if="state.email?.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="lucide:circle-x"
              aria-label="Clear input"
              @click="state.email = ''"
            />
          </template>
        </UInput>
        <template v-if="recovery" #help>
          <slot name="email-help">
            <ULink to="/auth/recovery" :class="helpStyles({ class: rc?.help })">
              {{ t("auth_sign-in_email_help") }}
            </ULink>
          </slot>
        </template>
      </UFormField>
      <UFormField
        :label="t('auth_password_label')"
        name="password"
        :description="t('auth_password_description')"
        required
        :ui="{
          label: labelStyles({ class: rc?.label }),
          description: descriptionStyles({ class: rc?.description }),
          help: helpStyles({ class: rc?.help }),
        }"
      >
        <div :class="passwordWrapper({ class: rc?.passwordWrapper })">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••••••••••"
            :class="input({ class: rc?.input })"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </div>
        <template v-if="recovery" #help>
          <slot name="password-help">
            <ULink to="/auth/recovery" :class="helpStyles({ class: rc?.help })">
              {{ t("auth_sign-in_password_help") }}
            </ULink>
          </slot>
        </template>
      </UFormField>
      <UCheckbox
        v-if="remember"
        v-model="state.rememberMe"
        name="rememberMe"
        :label="t('auth_remember_me')"
        :ui="{
          base: rememberCheckboxStyles({ class: rc?.rememberCheckbox }),
          label: rememberTextStyles({ class: rc?.rememberText }),
          indicator: rememberCheckboxIndicatorStyles({ class: rc?.rememberCheckboxIndicator }),
        }"
      />
      <UButton
        color="primary"
        variant="solid"
        type="submit"
        :label="t('auth_sign_in_button')"
        block
        :loading="isLoading"
        :disabled="isLoading"
        :class="submitStyles({ class: rc?.submit || rc?.button })"
      />
    </UForm>
    <slot v-if="terms" name="footer">
      <span :class="footerWrapper({ class: rc?.footerWrapper })">
        {{ t("auth_terms_agreement") }}
        <ULink to="/documents/terms-of-service" :class="termsLink({ class: rc?.termsLink })">
          {{ t("auth_terms_link") }} </ULink
        >.
      </span>
    </slot>
  </div>
</template>

<style scoped></style>
