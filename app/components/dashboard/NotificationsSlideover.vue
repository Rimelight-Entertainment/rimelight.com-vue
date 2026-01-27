<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core"
import type { Notification } from "~/types"

const { isNotificationsSlideoverOpen } = useDashboard()

const { data: notifications } =
  await useFetch<Notification[]>("/api/notifications")
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    side="right"
    title="Notifications"
    :ui="{
      header: 'flex items-center justify-between',
      content: 'w-full max-w-4/5 lg:w-96 rounded-none'
    }"
  >
    <template #body>
      <NuxtLink
        v-for="notification in notifications"
        :key="notification.id"
        :to="`/dashboard/inbox?id=${notification.id}`"
        class="relative -mx-3 flex items-center gap-3 rounded-md px-3 py-2.5 first:-mt-3 last:-mb-3 hover:bg-elevated/50"
      >
        <UChip color="error" :show="!!notification.unread" inset>
          <UAvatar v-bind="notification.sender.avatar" :alt="notification.sender.name" size="md" />
        </UChip>

        <div class="flex-1 text-sm">
          <p class="flex items-center justify-between">
            <span class="font-medium text-highlighted">{{
              notification.sender.name
            }}</span>

            <time
              :datetime="notification.date"
              class="text-xs text-muted"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p class="text-sm text-dimmed">
            {{ notification.body }}
          </p>
        </div>
      </NuxtLink>
    </template>
  </USlideover>
</template>
