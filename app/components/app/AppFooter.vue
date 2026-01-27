<script setup lang="ts">
import { ar, en, es, fr, ja, ko, pt, ro, zh_cn } from "@nuxt/ui/locale"
import type { FooterColumn } from "@nuxt/ui"

const appConfig = useAppConfig()
const { locale, setLocale } = useI18n()

type Locale = "en"

function onLocaleUpdate(newLocale: string | undefined) {
  if (typeof newLocale === "string") {
    setLocale(newLocale as Locale)
  }
}

const columns: FooterColumn[] = [
  {
    label: "Resources",
    children: [
      {
        label: "Branding",
        to: "/branding/"
      },
      {
        label: "Visitor Count",
        to: "/visitors"
      },
      {
        label: "Test Page",
        to: "/test-character/edit"
      }
    ]
  },
  {
    label: "Documents",
    children: [
      {
        label: "Privacy Policy",
        to: "/documents/policies/privacy-policy/"
      },
      {
        label: "Cookie Policy",
        to: "/documents/policies/cookie-policy/"
      }
    ]
  }
]
</script>

<template>
  <RCFooter :contain="false" class="bg-black z-50">
    <template #left>
      <RCNewsletterSignup class="max-w-64" />
      <div class="flex flex-col items-center gap-xs lg:items-start">
        <RCLogo variant="type" class="h-6 w-auto" />
        <p class="text-sm text-white">Tell your story.</p>
        <span class="text-sm text-white">
          © {{ new Date().getFullYear() }} {{ appConfig.title }}
        </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns" />
    </template>
    <template #right>
      <div class="flex flex-col gap-sm lg:items-end">
        <UColorModeSelect class="rounded-none" />
        <ULocaleSelect
          v-model="locale"
          :locales="[ar, en, es, fr, ja, ko, pt, ro, zh_cn]"
          color="secondary"
          class="w-48 rounded-none"
          @update:model-value="onLocaleUpdate($event)"
        />
      </div>
      <div class="flex flex-col items-center gap-xs lg:items-end">
        <div class="flex flex-row gap-sm lg:items-end">
          <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            icon="mdi:instagram"
            to="https://www.instagram.com/rimelight.com"
            class="text-white hover:text-primary-100"
          />
          <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            icon="ic:baseline-discord"
            to="https://discord.com/users/682049695173836979"
            class="text-white hover:text-primary-100"
          />
          <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            icon="mdi:spotify"
            to="https://open.spotify.com/user/v5m4qoc9j35ccc6nbzqcookvj?si=d795f9bc1cb34222"
            class="text-white hover:text-primary-100"
          />
          <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            icon="mdi:github"
            to="https://www.github.com/rimelight"
            class="text-white hover:text-primary-100"
          />
          <UButton
            size="xl"
            variant="ghost"
            color="neutral"
            icon="mdi:linkedin"
            to="https://www.linkedin.com/company/rimelight"
            class="text-white hover:text-primary-100"
          />
        </div>
      </div>
    </template>
  </RCFooter>
</template>

<style scoped></style>
