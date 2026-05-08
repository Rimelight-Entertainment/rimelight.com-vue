<script setup lang="ts">
import { computed } from "vue";
import type { TabsItem } from "@nuxt/ui";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface AuthLayoutProps {
  tabs: TabsItem[];
  backgroundMobile?: string;
  backgroundDesktop?: string;
  rc?: {
    root?: string;
    content?: string;
  };
}

const {
  tabs = [],
  backgroundMobile = "",
  backgroundDesktop = "",
  rc,
} = defineProps<AuthLayoutProps>();
/* endregion */

/* region Emits */
export interface AuthLayoutEmits {}

const emit = defineEmits<AuthLayoutEmits>();
/* endregion */

/* region Slots */
export interface AuthLayoutSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<AuthLayoutSlots>();
/* endregion */

/* region Styles */
const authLayoutStyles = tv({
  slots: {
    root: "relative flex min-h-screen w-full flex-col overflow-x-hidden",
    bgWrapper: "absolute inset-0 pointer-events-none",
    bgMobile: "h-full w-full object-cover md:hidden",
    bgDesktop: "hidden h-full w-full object-cover md:block",
    overlay: "absolute inset-0 bg-black/15",
    container: "flex z-10 min-h-screen items-center justify-center",
    card: "bg-white",
    tabsClass: "w-full",
  },
});

const { root, bgWrapper, bgMobile, bgDesktop, overlay, container, card, tabsClass } =
  authLayoutStyles();
type AuthLayoutVariants = VariantProps<typeof authLayoutStyles>;
/* endregion */

/* region State */
const route = useRoute();
const router = useRouter();

const activeTab = computed({
  get() {
    return tabs.find((i) => i.value === route.path)?.value || tabs[0]?.value;
  },
  set(path) {
    if (path) router.push(path as string);
  },
});
/* endregion */

/* region Meta */
defineOptions({
  name: "AuthLayout",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div :class="root()">
    <div :class="bgWrapper()">
      <NuxtImg
        v-if="backgroundMobile"
        :src="backgroundMobile"
        alt="Background"
        :class="bgMobile()"
      />
      <NuxtImg
        v-if="backgroundDesktop"
        :src="backgroundDesktop"
        alt="Background"
        :class="bgDesktop()"
      />
      <div :class="overlay()" />
    </div>
    <UContainer :class="container()">
      <UCard variant="solid" :class="card()" :ui="{ body: 'flex flex-col gap-md' }">
        <UTabs
          v-model="activeTab"
          color="primary"
          variant="link"
          :items="tabs"
          :content="false"
          :class="tabsClass()"
          :ui="{ trigger: 'grow' }"
        />
        <slot />
      </UCard>
    </UContainer>
  </div>
</template>

<style scoped></style>
