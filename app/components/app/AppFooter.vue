<script lang="ts" setup>
import type { FooterColumn } from "@nuxt/ui";
import * as uiLocales from "@nuxt/ui/locale";

const appConfig = useAppConfig();
const { t, locale, setLocale, locales: i18nLocales } = useI18n();

const availableLocales = computed(() => {
  return i18nLocales.value.map((l) => (uiLocales as any)[l.code]).filter(Boolean);
});

const columns = computed<FooterColumn[]>(() => [
  {
    label: t("footer_resources_title"),
    children: [
      {
        label: t("footer_branding_label"),
        to: "/branding",
      },
      {
        label: t("footer_visitor_count_label"),
        to: "/visitors",
      },
    ],
  },
  {
    label: t("footer_documents_title"),
    children: [
      {
        label: t("footer_privacy_policy_label"),
        to: "/documents/policies/privacy-policy",
      },
      {
        label: t("footer_cookie_policy_label"),
        to: "/documents/policies/cookie-policy",
      },
      {
        label: t("footer_terms_of_service_label"),
        to: "/documents/policies/term-of-service",
      },
      {
        label: t("footer_code_of_conduct_label"),
        to: "/documents/policies/code-of-conduct",
      },
      {
        label: t("footer_other_documents_label"),
        to: "/documents/other",
      },
    ],
  },
]);
onMounted(() => {
  console.log("AppFooter mounted on client");
});
</script>

<template>
  <RCFooter :contain="false" class="bg-black z-50 border-t-2 border-primary-500">
    <template #left>
      <RCNewsletterSignup class="max-w-64" />
      <div class="flex flex-col items-center gap-xs lg:items-start">
        <RCLogo class="h-6 w-auto" variant="type" />
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
