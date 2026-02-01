<script lang="ts" setup>
import {ar, en, es, fr, ja, ko, pt, ro, zh_cn} from "@nuxt/ui/locale"
import type {FooterColumn} from "@nuxt/ui"

const appConfig = useAppConfig()
const {locale, setLocale} = useI18n()

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
        to: "/branding"
      },
      {
        label: "Visitor Count",
        to: "/visitors"
      }
    ]
  },
  {
    label: "Documents",
    children: [
      {
        label: "Privacy Policy",
        to: "/documents/policies/privacy-policy"
      },
      {
        label: "Cookie Policy",
        to: "/documents/policies/cookie-policy"
      },
      {
        label: "Terms of Service",
        to: "/documents/policies/term-of-service"
      },
      {
        label: "Code of Conduct",
        to: "/documents/policies/code-of-conduct"
      },
      {
        label: "Other Documents",
        to: "/documents/other"
      }
    ]
  }
]
</script>

<template>
  <RCFooter :contain="false" class="bg-black z-50">
    <template #left>
      <RCNewsletterSignup class="max-w-64"/>
      <div class="flex flex-col items-center gap-xs lg:items-start">
        <RCLogo class="h-6 w-auto" variant="type"/>
        <p class="text-sm text-white">Tell your story.</p>
        <span class="text-sm text-white">
          © {{ new Date().getFullYear() }} {{ appConfig.title }}
        </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns"/>
    </template>
    <template #right>
      <div class="flex flex-col gap-sm lg:items-end">
        <UColorModeSelect class="rounded-none"/>
        <ULocaleSelect
            v-model="locale"
            :locales="[ar, en, es, fr, ja, ko, pt, ro, zh_cn]"
            class="w-48 rounded-none"
            color="secondary"
            @update:model-value="onLocaleUpdate($event)"
        />
      </div>
      <div class="flex flex-col items-center gap-xs lg:items-end">
        <div class="flex flex-row gap-sm lg:items-end">
          <UButton
              class="text-white hover:text-primary-100"
              color="neutral"
              icon="mdi:instagram"
              size="xl"
              to="https://www.instagram.com/rimelight.com"
              variant="ghost"
          />
          <UButton
              class="text-white hover:text-primary-100"
              color="neutral"
              icon="ic:baseline-discord"
              size="xl"
              to="https://discord.com/users/682049695173836979"
              variant="ghost"
          />
          <UButton
              class="text-white hover:text-primary-100"
              color="neutral"
              icon="mdi:spotify"
              size="xl"
              to="https://open.spotify.com/user/v5m4qoc9j35ccc6nbzqcookvj?si=d795f9bc1cb34222"
              variant="ghost"
          />
          <UButton
              class="text-white hover:text-primary-100"
              color="neutral"
              icon="mdi:github"
              size="xl"
              to="https://www.github.com/rimelight"
              variant="ghost"
          />
          <UButton
              class="text-white hover:text-primary-100"
              color="neutral"
              icon="mdi:linkedin"
              size="xl"
              to="https://www.linkedin.com/company/rimelight"
              variant="ghost"
          />
        </div>
      </div>
    </template>
  </RCFooter>
</template>

<style scoped></style>
