<script lang="ts" setup>
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";

const { signIn, isLoading } = useAuth();
const { t } = useI18n();

const schema = z.object({
  email: z.email(t("auth_email_invalid")),
  password: z.string().min(8, t("auth_password_min_length")),
  rememberMe: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
  rememberMe: true,
});

const showPassword = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await signIn({
    email: event.data.email,
    password: event.data.password,
    rememberMe: event.data.rememberMe,
  });
}

useHead({
  title: "Sign In",
});
</script>

<template>
  <div class="w-full flex flex-col gap-lg max-w-md">
    <UForm :schema="schema" :state="state" class="flex flex-col gap-md" @submit="onSubmit">
      <UFormField
        :description="t('auth_email_description')"
        :label="t('auth_email_label')"
        class="text-black"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          :placeholder="t('auth_email_placeholder')"
          class="w-full"
          type="email"
        >
          <template v-if="state.email?.length" #trailing>
            <UButton
              aria-label="Clear input"
              color="neutral"
              icon="lucide:circle-x"
              size="sm"
              variant="link"
              @click="state.email = ''"
            />
          </template>
        </UInput>
        <template #help>
          <ULink :to="`/app/pages/(auth)/auth/recovery`">{{ t("auth_sign-in_email_help") }}</ULink>
        </template>
      </UFormField>
      <UFormField
        :description="t('auth_password_description')"
        :label="t('auth_password_label')"
        name="password"
        required
      >
        <div class="flex flex-col gap-sm">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full"
            placeholder="••••••••••••••••"
          >
            <template #trailing>
              <UButton
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                aria-controls="password"
                color="neutral"
                size="sm"
                variant="link"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </div>
        <template #help>
          <ULink :to="`/app/pages/(auth)/auth/recovery`"
            >{{ t("auth_sign-in_password_help") }}
          </ULink>
        </template>
      </UFormField>
      <UCheckbox v-model="state.rememberMe" :label="t('auth_remember_me')" name="rememberMe" />
      <UButton
        :disabled="isLoading"
        :label="t('auth_sign_in_button')"
        :loading="isLoading"
        block
        color="primary"
        type="submit"
        variant="solid"
      />
    </UForm>
    <span class="text-center text-sm text-black"
      >{{ t("auth_terms_agreement") }}
      <ULink class="font-medium text-primary hover:text-dimmed" to="/documents/terms-of-service">{{
        t("auth_terms_link")
      }}</ULink
      >.</span
    >
  </div>
</template>
