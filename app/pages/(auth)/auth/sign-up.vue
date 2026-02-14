<script lang="ts" setup>
import type { FormSubmitEvent, StepperItem } from "#ui/types";
import { normalizeUsername, RESTRICTED_SET } from "rimelight-components/auth/restricted-usernames";
import { z } from "zod";

const { signUp, isLoading } = useAuth();
const toast = useToast();
const { t } = useI18n();

const step1Schema = z.object({
  username: z
    .string()
    .min(2, t("auth_username_length_error"))
    .max(24, t("auth_username_length_error"))
    .transform((val) => val.trim())
    .refine((val) => !/\s/.test(val), {
      message: t("auth_username_no_spaces"),
    })
    .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
      message: t("auth_username_format_error"),
    })
    .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
      message: t("auth_username_format_error"),
    })
    .refine(
      (val) => {
        // 1. Normalize the incoming attempt
        const normalizedInput = normalizeUsername(val);

        // 2. Check if the normalized version hits a restricted keyword
        return !RESTRICTED_SET.has(normalizedInput);
      },
      {
        message: t("auth_username_restricted_error"),
      },
    ),
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
  emailConfirmation: z.string().max(0),
});

const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, t("auth_password_length_error"))
      .max(24, t("auth_password_length_error")),
    passwordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: t("auth_passwords_mismatch"),
      });
    }
    if (
      (state.username ?? "").length > 0 &&
      data.password.toLowerCase().includes((state.username ?? "").toLowerCase())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: t("auth_password_contains_username"),
      });
    }
  });

const step3Schema = z.object({
  terms: z.boolean().refine((val) => val, {
    message: t("auth_terms_required"),
  }),
  newsletter: z.boolean().optional(),
});

const schema = z.intersection(step1Schema, z.intersection(step2Schema, step3Schema));

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  emailConfirmation: "",
  password: "",
  passwordConfirmation: "",
  terms: false,
  newsletter: false,
});

const stepper = useTemplateRef<StepperItem>("stepper");
const currentStep = ref(0);

const step1Form = useTemplateRef<any>("step1Form");
const step2Form = useTemplateRef<any>("step2Form");
const step3Form = useTemplateRef<any>("step3Form");

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

function checkStrength(str: string) {
  const requirements = [
    {
      regex: /.{8,}/,
      text: t("auth_password_req_length"),
    },
    {
      regex: /\d/,
      text: t("auth_password_req_number"),
    },
    {
      regex: /[a-z]/,
      text: t("auth_password_req_lowercase"),
    },
    {
      regex: /[A-Z]/,
      text: t("auth_password_req_uppercase"),
    },
    {
      regex: /[^\w\s]/,
      text: t("auth_password_req_special"),
    },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => {
  const pwd = state.password ?? "";
  return checkStrength(pwd);
});
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});

const stepperItems = computed<StepperItem[]>(() => [
  {
    slot: "identity" as const,
    title: t("auth_stepper_identity"),
    icon: "lucide:user-circle",
  },
  {
    slot: "security" as const,
    title: t("auth_stepper_security"),
    icon: "lucide:lock",
  },
  {
    slot: "preferences" as const,
    title: t("auth_stepper_preferences"),
    icon: "lucide:check-circle",
  },
]);

async function nextStep() {
  let isValid = false;
  let currentForm;

  switch (currentStep.value) {
    case 0:
      currentForm = step1Form.value;
      break;
    case 1:
      currentForm = step2Form.value;
      break;
    case 2:
      currentForm = step3Form.value;
      break;
    default:
      return;
  }

  if (currentForm) {
    isValid = await currentForm.validate();
  }

  if (isValid) {
    stepper.value?.next();
    currentStep.value++;
  } else {
    //TODO is this necessary?
    // Validation failed, scroll to the first error
    const firstError = document.querySelector(".ring-red-500");
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast.add({
      color: "error",
      title: t("auth_validation_error_title"),
      description: t("auth_validation_error_description"),
    });
  }
}

function prevStep() {
  stepper.value?.prev();
  currentStep.value--;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await signUp({
    name: event.data.username,
    firstName: event.data.firstName,
    lastName: event.data.lastName,
    email: event.data.email,
    password: event.data.password,
  });
}

useHead({
  title: "Sign Up",
});
</script>

<template>
  <UStepper
    ref="stepper"
    :items="stepperItems"
    :model-value="currentStep"
    class="w-full"
    disabled
    linear
    size="sm"
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
            :description="t('auth_email_description')"
            :help="t('auth_email_help')"
            :label="t('auth_email_label')"
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
          </UFormField>
          <UFormField
            :description="t('auth_email-confirmation_description')"
            :help="t('auth_email-confirmation_help')"
            :label="t('auth_email-confirmation_label')"
            aria-hidden="true"
            class="absolute h-0 w-0 overflow-hidden"
            name="email-confirmation"
            required
            tabindex="-1"
          >
            <UInput
              v-model="state.emailConfirmation"
              :placeholder="t('auth_email-confirmation_placeholder')"
              aria-autocomplete="none"
              aria-hidden="true"
              autocomplete="off"
              class="w-full"
              required
              tabindex="-1"
              type="email"
            >
              <template v-if="state.emailConfirmation?.length" #trailing>
                <UButton
                  aria-hidden="true"
                  aria-label="Clear input"
                  color="neutral"
                  icon="lucide:circle-x"
                  size="sm"
                  tabindex="-1"
                  variant="link"
                  @click="state.emailConfirmation = ''"
                />
              </template>
            </UInput>
          </UFormField>
          <UFormField
            :description="t('auth_username_description')"
            :label="t('auth_username_label')"
            name="username"
            required
          >
            <UInput v-model="state.username" class="w-full" placeholder="Johndoe123">
              <template v-if="state.username?.length" #trailing>
                <UButton
                  aria-label="Clear input"
                  color="neutral"
                  icon="lucide:circle-x"
                  size="sm"
                  variant="link"
                  @click="state.username = ''"
                />
              </template>
            </UInput>
          </UFormField>
          <div class="flex flex-row gap-sm">
            <UFormField
              :description="t('auth_firstname_description')"
              :label="t('auth_firstname_label')"
              class="w-1/2"
              name="firstName"
              required
            >
              <UInput v-model="state.firstName" placeholder="John">
                <template v-if="state.firstName?.length" #trailing>
                  <UButton
                    aria-label="Clear input"
                    color="neutral"
                    icon="lucide:circle-x"
                    size="sm"
                    variant="link"
                    @click="state.firstName = ''"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField
              :description="t('auth_lastname_description')"
              :label="t('auth_lastname_label')"
              class="w-1/2"
              name="lastName"
              required
            >
              <UInput v-model="state.lastName" placeholder="Doe">
                <template v-if="state.lastName?.length" #trailing>
                  <UButton
                    aria-label="Clear input"
                    color="neutral"
                    icon="lucide:circle-x"
                    size="sm"
                    variant="link"
                    @click="state.lastName = ''"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
          <div class="flex justify-between gap-md">
            <div />
            <UButton
              :label="t('navigation_next')"
              trailing-icon="lucide:arrow-right"
              @click="nextStep"
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
              <UProgress :color="color" :max="4" :model-value="score" size="sm" />
              <p id="password-strength" class="text-xs">
                {{ t("auth_password_requirements_title") }}
              </p>
              <ul aria-label="Password requirements" class="space-y-1">
                <li
                  v-for="(req, index) in strength"
                  :key="index"
                  :class="req.met ? 'text-success' : 'text-muted'"
                  class="flex items-center gap-xs"
                >
                  <UIcon
                    :name="req.met ? 'lucide:circle-check' : 'lucide:circle-x'"
                    class="size-4 shrink-0"
                  />

                  <span class="text-xs font-light">
                    {{ req.text }}
                    <span class="sr-only">
                      {{ req.met ? " - Requirement met" : " - Requirement not met" }}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </UFormField>
          <UFormField
            :description="t('auth_password_confirmation_description')"
            :label="t('auth_password_confirmation_label')"
            name="passwordConfirmation"
            required
          >
            <UInput
              v-model="state.passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              class="w-full"
              placeholder="••••••••••••••••"
            >
              <template #trailing>
                <UButton
                  :aria-label="showPasswordConfirmation ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPasswordConfirmation"
                  :icon="showPasswordConfirmation ? 'lucide:eye-off' : 'lucide:eye'"
                  aria-controls="passwordConfirmation"
                  color="neutral"
                  size="sm"
                  variant="link"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                />
              </template>
            </UInput>
          </UFormField>
          <div class="flex justify-between gap-md">
            <UButton
              :class="{ invisible: currentStep === 0 }"
              :label="t('navigation_previous')"
              leading-icon="lucide:arrow-left"
              variant="outline"
              @click="prevStep"
            />
            <UButton
              :label="t('navigation_next')"
              trailing-icon="lucide:arrow-right"
              @click="nextStep"
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
        class="flex flex-col gap-md"
        @submit="onSubmit($event as FormSubmitEvent<Schema>)"
      >
        <div class="flex flex-col gap-md">
          <UFormField name="terms">
            <UCheckbox v-model="state.terms" required>
              <template #label>
                {{ t("auth_terms_agreement_signup") }}
                <ULink class="font-medium text-primary" to="/documents/terms-of-service"
                  >{{ t("auth_terms_link") }}
                </ULink>
                .
              </template>
            </UCheckbox>
          </UFormField>
          <UCheckbox
            v-model="state.newsletter"
            :description="t('auth_newsletter_description')"
            :label="t('auth_newsletter_label')"
            name="newsletter"
          />
          <div class="flex justify-between gap-md">
            <UButton
              :class="{ invisible: currentStep === 0 }"
              :label="t('navigation_previous')"
              leading-icon="lucide:arrow-left"
              variant="outline"
              @click="prevStep"
            />
            <UButton
              :label="t('auth_sign_up_button')"
              :loading="isLoading"
              trailing-icon="lucide:check"
              type="submit"
            />
          </div>
        </div>
      </UForm>
    </template>
  </UStepper>
  <span class="text-center text-sm">{{ t("auth_details_changeable") }}</span>
</template>

<style scoped></style>
