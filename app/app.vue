<script lang="ts" setup>
import { ULink } from "#components"
import * as locales from "@nuxt/ui/locale"
import { PiniaColadaDevtools } from "@pinia/colada-devtools"
import { useFavicon } from "@vueuse/core"

const { locale } = useI18n()
const { session } = useAuth()
const currentLocale = computed(() => {
  return (locales as any)[locale.value] || locales.en
})
const lang = computed(() => currentLocale.value?.code || "en")
const dir = computed(() => (currentLocale.value as any)?.dir || "ltr")

const colorMode = useColorMode()

const color = computed(() => {
  return colorMode.value === "dark" ? "#020618" : "white"
})

const icon = import.meta.client ? useFavicon() : undefined

const router = useRouter()
// Moved to a more specific scope if possible, or left top-level but with safer implementation
const dashboard = useDashboard()
const { isNotificationsSlideoverOpen } = dashboard

function alertMode() {
  if (icon) icon.value = "/favicon-alert.svg"
}

function normalMode() {
  if (icon) icon.value = "/favicon.svg"
}

/* sample reactive favicon for future implementation
const chat = useChatStore()
const favicon = useFavicon()

watch(()=> chat.unreadCount, ()=>{
      favicon.value = chat.unreadCount > 0
          ? '/favicon-alert.png'
          : 'favicon.png'
})
 */

defineShortcuts({
  "g-h": () => router.push("/"),
  "g-i": () => router.push("/inbox"),
  "g-c": () => router.push("/customers"),
  "g-s": () => router.push("/settings"),
  n: () => {
    isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  }
})

const toast = useToast()

type CookieConsent = "accepted" | "rejected" | null

const cookie = useCookie<CookieConsent>("cookie-consent", {
  default: () => null,
  maxAge: 60 * 60 * 24 * 90,
  secure: import.meta.env.PROD,
  sameSite: "lax"
})

const createCookieDescription = () => {
  return h("div", { class: "text-sm text-muted mt-1" }, [
    "This website uses ",
    h("span", [
      h(
        ULink,
        {
          href: "https://en.wikipedia.org/wiki/HTTP_COOKIE",
          class: "text-primary",
          target: "_blank"
        },
        { default: () => "cookies" }
      )
    ]),
    " to enhance your browsing experience. ",
    h("br"),
    "By continuing to use our site, you agree to our ",
    h("span", [
      h(
        ULink,
        {
          href: "/documents/cookie-policy/",
          class: "text-primary"
        },
        { default: () => "Cookie Policy" }
      )
    ]),
    "."
  ])
}

onMounted(() => {
  if (cookie.value === "accepted") {
    return
  }

  toast.add({
    duration: 0,
    color: "primary",
    icon: "lucide:cookie",
    title: "Cookie Consent",
    description: createCookieDescription,
    actions: [
      {
        icon: "lucide:check",
        label: "Accept All",
        color: "success",
        variant: "solid",
        onClick: (e) => {
          e?.stopPropagation()
          cookie.value = "accepted"
          toast.clear()
        }
      },
      {
        icon: "lucide:x",
        label: "Reject All",
        color: "error",
        variant: "solid",
        onClick: (e) => {
          e?.stopPropagation()
          cookie.value = "rejected"
          toast.clear()
        }
      }
    ],
    close: false
  })
})

useHead({
  meta: [
    {
      charset: "utf-8"
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    },
    {
      name: "theme-color",
      content: color
    }
  ],
  link: [
    {
      rel: "icon",
      href: "/favicon.svg"
    }
  ],
  htmlAttrs: {
    lang,
    dir
  }
})

useSeoMeta({
  titleTemplate: "%s - rimelight.com",
  ogImage: "https://cdn.rimelight.com/images/logos/logomark-white.webp",
  twitterImage: "https://cdn.rimelight.com/images/logos/logomark-white.webp",
  twitterCard: "summary_large_image"
})
</script>

<template>
  <UApp :locale="currentLocale" :tooltip="{ delayDuration: 0 }">
    <NuxtRouteAnnouncer />
    <NuxtAnnouncer />
    <NuxtLoadingIndicator color="#0064d7" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <RCConfirmModal />
      <template v-if="session">
        <RCNotificationsSlideover />
        <RCFloatingActionsOverlay />
        <RCFloatingToolsOverlay />
      </template>
      <PiniaColadaDevtools />
    </ClientOnly>
  </UApp>
</template>

<style scoped></style>
