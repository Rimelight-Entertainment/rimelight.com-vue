<script lang="ts" setup>
import type { FooterColumn } from "@nuxt/ui";
import * as uiLocales from "@nuxt/ui/locale";

/* region Props */
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

/* region State */

const appConfig = useAppConfig();
const { t, locale, setLocale, locales: i18nLocales } = useI18n();

const availableLocales = computed(() => {
  return i18nLocales.value.map((l) => (uiLocales as any)[l.code]).filter(Boolean);
})

const columns = computed<FooterColumn[]>(() => [
  {
    label: t("app.footer.links.resources.label"),
    children: [
      {
        label: t("app.footer.links.resources.content.branding"),
        to: "/branding",
      },
      {
        label: t("app.footer.links.resources.content.visitors"),
        to: "/visitors",
      },
      {
        label: "API",
        to: "/api",
      }
    ],
  },
  {
    label: t("app.footer.links.documents.label"),
    children: [
      {
        label: t("app.footer.links.documents.content.privacyPolicy"),
        to: "/documents/privacy-policy",
      },
      {
        label: t("app.footer.links.documents.content.cookiePolicy"),
        to: "/documents/cookie-policy",
      },
      {
        label: t("app.footer.links.documents.content.termsOfService"),
        to: "/documents/terms-of-service",
      },
      {
        label: t("app.footer.links.documents.content.codeOfConduct"),
        to: "/documents/code-of-conduct",
      },
      {
        label: t("app.footer.links.documents.content.otherDocuments"),
        to: "/documents",
      },
    ],
  },
])
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <RCFooter :contain="false" :rc="{ center: 'lg:items-start' }" class="bg-black z-50 border-t-2 border-primary-500">
    <template #left>
      <RCNewsletterSignup :title="t('app.newsletter.title')" :description="t('app.newsletter.description')" :submit="t('app.newsletter.submit')" :rc="{ label: 'text-white', description: 'text-neutral-500', button: 'text-white bg-primary-500 hover:bg-primary-600' }" class="max-w-64" />
      <div class="flex flex-col items-center gap-xs lg:items-start">
        <RCLogo class="h-6 w-auto" variant="type" />
        <p class="text-sm text-white">Tell your story.</p>
        <span class="text-sm text-white">
          © {{ new Date().getFullYear() }} Rimelight Entertainment
        </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns" />
    </template>
    <template #right>
      <div class="flex flex-col gap-sm lg:items-end">
        <ClientOnly>
          <UColorModeSelect class="rounded-none" />
          <template #fallback>
            <div class="h-9 w-32 rounded-md border bg-transparent"></div>
          </template>
        </ClientOnly>
        <ClientOnly>
          <ULocaleSelect
            :locales="availableLocales"
            :model-value="locale"
            class="w-48 rounded-none"
            color="secondary"
            @update:model-value="setLocale($event as any)"
          />
          <template #fallback>
            <div class="h-9 w-48 rounded-md border bg-transparent"></div>
          </template>
        </ClientOnly>
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
