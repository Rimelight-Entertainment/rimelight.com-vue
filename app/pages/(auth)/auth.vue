<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const tabs: TabsItem[] = [
  {
    icon: 'lucide:log-in',
    label: t('auth_sign-in'),
    value: '/auth/sign-in',
  },
  {
    icon: "lucide:square-pen",
    label: t('auth_sign-up'),
    value: '/auth/sign-up',
  }
]

const activeTab = computed({
  get() {
    return tabs.some(i => i.value === route.path)
        ? route.path
        : '/auth/sign-in'
  },
  set(path) {
    router.push(path as string)
  }
})
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
    <div class="absolute inset-0">
      <NuxtImg
        src="/images/auth_background_mobile.jpg"
        alt="Background"
        class="h-full w-full object-cover md:hidden"
      />
      <NuxtImg
        src="/images/auth_background_desktop.jpg"
        alt="Background"
        class="hidden h-full w-full object-cover md:block"
      />
      <div class="absolute inset-0 bg-black/15" />
    </div>
    <UContainer class="flex z-10 min-h-screen items-center justify-center">
      <UCard variant="solid" class="bg-white" :ui="{ body: 'flex flex-col gap-md' }">
        <UTabs
          v-model="activeTab"
          color="primary"
          variant="link"
          :items="tabs"
          :content="false"
          class="w-full"
          :ui="{ trigger: 'grow' }"
        />
        <NuxtPage />
      </UCard>
    </UContainer>
  </div>
</template>
