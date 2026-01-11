<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

const { t } = useI18n()
const toast = useToast()

type ContactFormData = z.infer<typeof contactFormSchema>

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  subject: z.string().min(1, "Subject cannot be empty."),
  message: z.string().min(10, "Message must be at least 10 characters long.")
})

const state = ref<ContactFormData>({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const isLoading = ref(false);

/**
 * Handles the form submission logic.
 * In a real application, this would call an API route.
 */
async function onSubmit(event: FormSubmitEvent<ContactFormData>) {
  isLoading.value = true;

  state.value = { name: '', email: '', subject: '', message: '' };

  isLoading.value = false;
  toast.add({
    duration: 0,
    color: "primary",
    icon: "lucide:cookie",
    title: "Cookie Consent",
    description: "Email Sent!"
  })
}

const contactInfo = [
  { icon: 'i-heroicons-phone', label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: 'i-heroicons-envelope', label: 'Email', value: 'contact@mywebsite.com' },
  { icon: 'i-heroicons-map-pin', label: 'Location', value: 'Global Remote' },
];

const socialLinks = [
  { icon: 'i-simple-icons-github', name: 'GitHub', url: 'https://github.com/your-username' },
  { icon: 'i-simple-icons-linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile' },
  { icon: 'i-simple-icons-x', name: 'X (Twitter)', url: 'https://x.com/your-handle' },
]

useHead({
  title: "me.contact"
})
</script>

<template>
  <UPage>
    <UPageSection
      headline="Contact"
      title="Send me a message"
      description="Feel free to contact me for business inquiries or other topics!"
    >
      <div class="flex flex-col gap-xl lg:grid lg:grid-cols-3">
        <UCard class="lg:col-span-2">
          <template #header>
            <h3 class="text-2xl font-semibold">Send a Message</h3>
          </template>

          <UForm
            :schema="contactFormSchema"
            :state="state"
            class="flex flex-col gap-md"
            @submit="onSubmit"
          >
            <UFormField label="Your Name" name="name" required>
              <UInput
                v-model="state.name"
                icon="lucide:user"
                :placeholder="t('placeholder_name')"
              />
            </UFormField>

            <UFormField label="Email Address" name="email" required class="w-full">
              <UInput
                v-model="state.email"
                icon="lucide:mail"
                :placeholder="t('placeholder_email')"
                type="email"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Message" name="message" required class="w-full">
              <UTextarea
                v-model="state.message"
                placeholder="Type your message here..."
                :rows="8"
                autoresize
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              :loading="isLoading"
              icon="i-heroicons-paper-airplane"
              size="lg"
              block
            >
              Send Message
            </UButton>
          </UForm>
        </UCard>

        <div class="flex flex-col gap-md">
          <h3>Contact Details</h3>
          <div class="space-y-8">
            <ul class="space-y-6">
              <li v-for="item in contactInfo" :key="item.label" class="flex items-start">
                <UIcon
                  :name="item.icon"
                  class="mr-3 h-6 w-6 shrink-0 text-primary-500 dark:text-primary-400"
                />
                <div>
                  <h4 class="font-medium text-gray-700 dark:text-gray-200">
                    {{ item.label }}
                  </h4>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ item.value }}
                  </p>
                </div>
              </li>
            </ul>
            <USeparator />
            <div class="flex flex-col gap-xs">
              <h4 class="text-sm">I'm also available through my socials:</h4>
              <div class="flex flex-row gap-sm">
                <UButton
                  v-for="link in socialLinks"
                  :key="link.name"
                  :icon="link.icon"
                  :to="link.url"
                  :aria-label="`${link.name}`"
                  variant="ghost"
                  color="neutral"
                  target="_blank"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<style scoped></style>
