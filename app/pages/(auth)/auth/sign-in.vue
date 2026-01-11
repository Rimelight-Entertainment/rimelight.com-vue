<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

const { signIn, isLoading } = useAuth()
const { t } = useI18n()

const schema = z.object({
  email: z.email(t("auth_email_invalid")),
  password: z.string().min(8, t("auth_password_min_length")),
  rememberMe: z.boolean()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
  rememberMe: true
})

const showPassword = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await signIn({
    email: event.data.email,
    password: event.data.password,
    rememberMe: event.data.rememberMe
  })
}

useHead({
  title: 'Sign In'
})
</script>

<template>
        <div class="w-full flex flex-col gap-lg max-w-md">
          <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col gap-md">
            <UFormField
              :label="t('auth_email_label')"
              name="email"
              :description="t('auth_email_description')"
              required
              class="text-black"
            >
              <UInput
                v-model="state.email"
                type="email"
                :placeholder="t('auth_email_placeholder')"
                class="w-full"
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
              <template #help>
                <ULink :to="`/app/pages/(auth)/auth/recovery`">{{ t('auth_sign-in_email_help') }}</ULink>
              </template>
            </UFormField>
            <UFormField
              :label="t('auth_password_label')"
              name="password"
              :description="t('auth_password_description')"
              required
            >
              <div class="flex flex-col gap-sm">
                <UInput
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••••••••••"
                  class="w-full"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                      :aria-label="
                        showPassword ? 'Hide password' : 'Show password'
                      "
                      :aria-pressed="showPassword"
                      aria-controls="password"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </UInput>
              </div>
              <template #help>
                <ULink :to="`/app/pages/(auth)/auth/recovery`">{{ t('auth_sign-in_password_help') }}</ULink>
              </template>
            </UFormField>
            <UCheckbox
              v-model="state.rememberMe"
              name="rememberMe"
              :label="t('auth_remember_me')"
            />
            <UButton
              color="primary"
              variant="solid"
              type="submit"
              :label="t('auth_sign_in_button')"
              block
              :loading="isLoading"
              :disabled="isLoading"
            />
          </UForm>
          <span class="text-center text-sm text-black"
            >{{ t("auth_terms_agreement") }}
            <ULink
              to="/documents/terms-of-service"
              class="font-medium text-primary hover:text-dimmed"
              >{{ t("auth_terms_link") }}</ULink
            >.</span
          >
        </div>
</template>
