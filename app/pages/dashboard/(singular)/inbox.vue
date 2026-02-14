<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";

import { type Mail } from "#rimelight-components/types";

definePageMeta({
  layout: "dashboard",
});

const tabItems = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
];

const selectedTab = ref("all");
const selectedMail = ref<Mail | null>();

const { data: mails } = await useApi<Mail[]>("/api/mails", { default: () => ref([]) as any });
const breakpoints = useBreakpoints(breakpointsTailwind);

const isMobile = breakpoints.smaller("lg");

// Filter mails based on the selected tab
const filteredMails = computed(() => {
  if (selectedTab.value === "unread") {
    return mails.value!.filter((mail) => !!mail.unread);
  }

  return mails.value!;
});

const isMailPanelOpen = computed({
  get() {
    return !!selectedMail.value;
  },
  set(value: boolean) {
    if (!value) {
      selectedMail.value = null;
    }
  },
});

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, () => {
  if (!filteredMails.value!.find((mail) => mail.id === selectedMail.value?.id)) {
    selectedMail.value = null;
  }
});
</script>

<template>
  <UDashboardPanel id="inbox" :default-size="25" :max-size="30" :min-size="20" resizable>
    <UDashboardNavbar title="Inbox">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge :label="filteredMails!.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs v-model="selectedTab" :content="false" :items="tabItems" size="xs" />
      </template>
    </UDashboardNavbar>
    <RLInboxList v-model="selectedMail" :mails="filteredMails!" />
  </UDashboardPanel>

  <RLInboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
  <div v-else class="hidden flex-1 items-center justify-center lg:flex">
    <UIcon class="size-32 text-dimmed" name="lucide:inbox" />
  </div>

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
      <template #content>
        <RLInboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
