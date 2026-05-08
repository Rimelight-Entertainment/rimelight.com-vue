<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";
import type { Notification } from "#types";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface NotificationsSlideoverProps {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<NotificationsSlideoverProps>();

const { rc } = useRC("NotificationsSlideover", rcProp);
/* endregion */

/* region Emits */
export interface NotificationsSlideoverEmits {}

const emit = defineEmits<NotificationsSlideoverEmits>();
/* endregion */

/* region Slots */
export interface NotificationsSlideoverSlots {}

const slots = defineSlots<NotificationsSlideoverSlots>();
/* endregion */

/* region Styles */
const notificationsSlideoverStyles = tv({
  slots: {
    root: "",
    notificationItem:
      "relative -mx-3 flex items-center gap-3 rounded-md px-3 py-2.5 first:-mt-3 last:-mb-3 hover:bg-elevated/50",
    notificationContent: "flex-1 text-sm",
    notificationHeader: "flex items-center justify-between",
    senderName: "font-medium text-highlighted",
    timestamp: "text-xs text-muted",
    notificationBody: "text-sm text-dimmed",
  },
});

const {
  root,
  notificationItem,
  notificationContent,
  notificationHeader,
  senderName,
  timestamp,
  notificationBody,
} = notificationsSlideoverStyles();
type NotificationsSlideoverVariants = VariantProps<typeof notificationsSlideoverStyles>;
/* endregion */

/* region State */
const { isNotificationsSlideoverOpen } = useDashboard();

const { data: notifications } = await useFetch<Notification[]>("/api/notifications");
/* endregion */

/* region Meta */
defineOptions({
  name: "NotificationsSlideover",
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
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    side="right"
    title="Notifications"
    :ui="{
      header: 'flex items-center justify-between',
      content: 'w-full max-w-4/5 lg:w-96 rounded-none',
    }"
  >
    <template #body>
      <NuxtLink
        v-for="notification in notifications"
        :key="notification.id"
        :to="`/dashboard/inbox?id=${notification.id}`"
        :class="notificationItem()"
      >
        <UChip color="error" :show="!!notification.unread" inset>
          <UAvatar v-bind="notification.sender.avatar" :alt="notification.sender.name" size="md" />
        </UChip>

        <div :class="notificationContent()">
          <p :class="notificationHeader()">
            <span :class="senderName()">{{ notification.sender.name }}</span>

            <time
              :datetime="notification.date"
              :class="timestamp()"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p :class="notificationBody()">
            {{ notification.body }}
          </p>
        </div>
      </NuxtLink>
    </template>
  </USlideover>
</template>

<style scoped></style>
