<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"
import type { StepperItem } from "@nuxt/ui"
import { RESTRICTED_SET, normalizeUsername } from "~~/shared/constants/restricted-usernames"

const { signUp, isLoading } = useAuth()
const toast = useToast()
const { t } = useI18n()

const step1Schema = z.object({
  username: z
    .string()
    .min(2, t("auth_username_length_error"))
    .max(24, t("auth_username_length_error"))
    .transform((val) => val.trim())
    .refine((val) => !/\s/.test(val), {
      message: t("auth_username_no_spaces")
    })
    .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
      message:
        t("auth_username_format_error")
    })
    .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
      message: t("auth_username_format_error")
    })
    .refine((val) => {
      // 1. Normalize the incoming attempt
      const normalizedInput = normalizeUsername(val);

      // 2. Check if the normalized version hits a restricted keyword
      return !RESTRICTED_SET.has(normalizedInput);
    }, {
      message: t("auth_username_restricted_error")
    }),
  firstName: z
    .string()
    .min(2, t("auth_firstname_length_error"))
    .max(24, t("auth_firstname_length_error")),
  lastName: z
    .string()
    .min(2, t("auth_lastname_length_error"))
    .max(24, t("auth_lastname_length_error")),
  email: z.email(t("auth_email_invalid")),
  // Honeypot field meant to prevent simple bots. This is not expected to be filled by the user.
  emailConfirmation: z.string().max(0)
})

const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, t("auth_password_length_error"))
      .max(24, t("auth_password_length_error")),
    passwordConfirmation: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: t("auth_passwords_mismatch")
      })
    }
    if (
      (state.username ?? "").length > 0 &&
      data.password.toLowerCase().includes((state.username ?? "").toLowerCase())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: t("auth_password_contains_username")
      })
    }
  })

const step3Schema = z.object({
  terms: z.boolean().refine((val) => val, {
    message: t("auth_terms_required")
  }),
  newsletter: z.boolean().optional()
})

const schema = z.intersection(
  step1Schema,
  z.intersection(step2Schema, step3Schema)
)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  emailConfirmation: "",
  password: "",
  passwordConfirmation: "",
  terms: false,
  newsletter: false
})

const stepper = useTemplateRef<StepperItem>("stepper")
const currentStep = ref(0)

const step1Form = useTemplateRef<any>("step1Form")
const step2Form = useTemplateRef<any>("step2Form")
const step3Form = useTemplateRef<any>("step3Form")

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

function checkStrength(str: string) {
  const requirements = [
    {
      regex: /.{8,}/,
      text: t("auth_password_req_length")
    },
    {
      regex: /\d/,
      text: t("auth_password_req_number")
    },
    {
      regex: /[a-z]/,
      text: t("auth_password_req_lowercase")
    },
    {
      regex: /[A-Z]/,
      text: t("auth_password_req_uppercase")
    },
    {
      regex: /[^\w\s]/,
      text: t("auth_password_req_special")
    }
  ]

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text
  }))
}

const strength = computed(() => {
  const pwd = state.password ?? ""
  return checkStrength(pwd)
})
const score = computed(() => strength.value.filter((req) => req.met).length)

const color = computed(() => {
  if (score.value === 0) return "neutral"
  if (score.value <= 1) return "error"
  if (score.value <= 2) return "warning"
  if (score.value === 3) return "warning"
  return "success"
})

const stepperItems = computed<StepperItem[]>(() => [
  {
    slot: "identity" as const,
    title: t("auth_stepper_identity"),
    icon: "lucide:user-circle"
  },
  {
    slot: "security" as const,
    title: t("auth_stepper_security"),
    icon: "lucide:lock"
  },
  {
    slot: "preferences" as const,
    title: t("auth_stepper_preferences"),
    icon: "lucide:check-circle"
  }
])

async function nextStep() {
  let isValid = false
  let currentForm

  switch (currentStep.value) {
    case 0:
      currentForm = step1Form.value
      break
    case 1:
      currentForm = step2Form.value
      break
    case 2:
      currentForm = step3Form.value
      break
    default:
      return
  }

  if (currentForm) {
    isValid = await currentForm.validate()
  }

  if (isValid) {
    stepper.value?.next()
    currentStep.value++
  } else {
    //TODO is this necessary?
    // Validation failed, scroll to the first error
    const firstError = document.querySelector(".ring-red-500")
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" })
    toast.add({
      color: "error",
      title: t("auth_validation_error_title"),
      description: t("auth_validation_error_description")
    })
  }
}

function prevStep() {
  stepper.value?.prev()
  currentStep.value--
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await signUp({
    name: event.data.username,
    firstName: event.data.firstName,
    lastName: event.data.lastName,
    email: event.data.email,
    password: event.data.password
  })
}

useHead({
  title: 'Sign Up'
})
</script>

<template>
  <UStepper
    ref="stepper"
    :items="stepperItems"
    class="w-full"
    size="sm"
    :model-value="currentStep"
    linear
    disabled
  >
    <template #identity>
      <UForm
        ref="step1Form"
        :schema="step1Schema"
        :state="state"
        class="flex flex-col gap-md"
        @submit.prevent
      >
        <div class="flex flex-col gap-md">
          <UFormField
            :label="t('auth_email_label')"
            name="email"
            :description="t('auth_email_description')"
            :help="t('auth_email_help')"
            required
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
          </UFormField>
          <UFormField
            :label="t('auth_email-confirmation_label')"
            name="email-confirmation"
            :description="t('auth_email-confirmation_description')"
            :help="t('auth_email-confirmation_help')"
            required
            class="absolute h-0 w-0 overflow-hidden"
            aria-hidden="true"
            tabindex="-1"
          >
            <UInput
              v-model="state.emailConfirmation"
              type="email"
              :placeholder="t('auth_email-confirmation_placeholder')"
              autocomplete="off"
              aria-autocomplete="none"
              aria-hidden="true"
              class="w-full"
              tabindex="-1"
              required
            >
              <template v-if="state.emailConfirmation?.length" #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="lucide:circle-x"
                  aria-label="Clear input"
                  aria-hidden="true"
                  tabindex="-1"
                  @click="state.emailConfirmation = ''"
                />
              </template>
            </UInput>
          </UFormField>
          <UFormField
            :label="t('auth_username_label')"
            name="username"
            :description="t('auth_username_description')"
            required
          >
            <UInput v-model="state.username" placeholder="Johndoe123" class="w-full">
              <template v-if="state.username?.length" #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="lucide:circle-x"
                  aria-label="Clear input"
                  @click="state.username = ''"
                />
              </template>
            </UInput>
          </UFormField>
          <div class="flex flex-row gap-sm">
            <UFormField
              :label="t('auth_firstname_label')"
              name="firstName"
              :description="t('auth_firstname_description')"
              required
              class="w-1/2"
            >
              <UInput v-model="state.firstName" placeholder="John">
                <template v-if="state.firstName?.length" #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="lucide:circle-x"
                    aria-label="Clear input"
                    @click="state.firstName = ''"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField
              :label="t('auth_lastname_label')"
              name="lastName"
              :description="t('auth_lastname_description')"
              required
              class="w-1/2"
            >
              <UInput v-model="state.lastName" placeholder="Doe">
                <template v-if="state.lastName?.length" #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="lucide:circle-x"
                    aria-label="Clear input"
                    @click="state.lastName = ''"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
          <div class="flex justify-between gap-md">
            <div />
            <UButton
              trailing-icon="lucide:arrow-right"
              @click="nextStep"
              :label="t('navigation_next')"
            />
          </div>
        </div>
      </UForm>
    </template>
    <template #security>
      <UForm
        ref="step2Form"
        :schema="step2Schema"
        :state="state"
        class="flex flex-col gap-md"
        @submit.prevent
      >
        <div class="flex flex-col gap-md">
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
                    :icon="
                              showPassword ? 'lucide:eye-off' : 'lucide:eye'
                            "
                    :aria-label="
                              showPassword ? 'Hide password' : 'Show password'
                            "
                    :aria-pressed="showPassword"
                    aria-controls="password"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
              <UProgress :color="color" :model-value="score" :max="4" size="sm" />
              <p id="password-strength" class="text-xs">
                {{ t("auth_password_requirements_title") }}
              </p>
              <ul class="space-y-1" aria-label="Password requirements">
                <li
                  v-for="(req, index) in strength"
                  :key="index"
                  class="flex items-center gap-xs"
                  :class="req.met ? 'text-success' : 'text-muted'"
                >
                  <UIcon
                    :name="
                              req.met
                                ? 'lucide:circle-check'
                                : 'lucide:circle-x'
                            "
                    class="size-4 shrink-0"
                  />

                  <span class="text-xs font-light">
                    {{ req.text }}
                    <span class="sr-only">
                      {{
                                req.met
                                  ? " - Requirement met"
                                  : " - Requirement not met"
                      }}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </UFormField>
          <UFormField
            :label="t('auth_password_confirmation_label')"
            name="passwordConfirmation"
            :description="t('auth_password_confirmation_description')"
            required
          >
            <UInput
              v-model="state.passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              placeholder="••••••••••••••••"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="
                            showPasswordConfirmation
                              ? 'lucide:eye-off'
                              : 'lucide:eye'
                          "
                  :aria-label="
                            showPasswordConfirmation
                              ? 'Hide password'
                              : 'Show password'
                          "
                  :aria-pressed="showPasswordConfirmation"
                  aria-controls="passwordConfirmation"
                  @click="
                            showPasswordConfirmation = !showPasswordConfirmation
                          "
                />
              </template>
            </UInput>
          </UFormField>
          <div class="flex justify-between gap-md">
            <UButton
              variant="outline"
              leading-icon="lucide:arrow-left"
              :label="t('navigation_previous')"
              :class="{ invisible: currentStep === 0 }"
              @click="prevStep"
            />
            <UButton
              trailing-icon="lucide:arrow-right"
              @click="nextStep"
              :label="t('navigation_next')"
            />
          </div>
        </div>
      </UForm>
    </template>
    <template #preferences>
      <UForm
        ref="step3Form"
        :schema="schema"
        :state="state"
        @submit="onSubmit($event as FormSubmitEvent<Schema>)"
        class="flex flex-col gap-md"
      >
        <div class="flex flex-col gap-md">
          <UFormField name="terms">
            <UCheckbox v-model="state.terms" required>
              <template #label>
                {{ t("auth_terms_agreement_signup") }}
                <ULink
                  to="/documents/terms-of-service"
                  class="font-medium text-primary"
                  >{{ t("auth_terms_link") }}</ULink
                >.
              </template>
            </UCheckbox>
          </UFormField>
          <UCheckbox
            v-model="state.newsletter"
            name="newsletter"
            :label="t('auth_newsletter_label')"
            :description="t('auth_newsletter_description')"
          />
          <div class="flex justify-between gap-md">
            <UButton
              variant="outline"
              leading-icon="lucide:arrow-left"
              :label="t('navigation_previous')"
              :class="{ invisible: currentStep === 0 }"
              @click="prevStep"
            />
            <UButton
              type="submit"
              :label="t('auth_sign_up_button')"
              trailing-icon="lucide:check"
              :loading="isLoading"
            />
          </div>
        </div>
      </UForm>
    </template>
  </UStepper>
  <span class="text-center text-sm">{{
            t("auth_details_changeable")
  }}</span>
</template>

<style scoped></style>
