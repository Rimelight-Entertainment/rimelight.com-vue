<script setup lang="ts">
import type { TabsItem } from "#ui/types";

const { t } = useI18n();

const tabs: TabsItem[] = [
  {
    icon: "lucide:log-in",
    label: t("auth_sign-in"),
    value: "/auth/sign-in",
  },
  {
    icon: "lucide:square-pen",
    label: t("auth_sign-up"),
    value: "/auth/sign-up",
  },
];
</script>

<template>
  <RCAuthLayout
    :tabs="tabs"
    background-mobile="/images/auth_background_mobile.jpg"
    background-desktop="/images/auth_background_desktop.jpg"
  >
    <NuxtPage />
  </RCAuthLayout>
</template>
