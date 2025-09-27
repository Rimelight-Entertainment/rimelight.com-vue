<script setup lang="ts">
const {} = defineProps<{
  feedback: FeedbackItem
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()

const { getRatingFromFeedback, getScoreColor } = useFeedbackRatings()

const rating = computed(() => getRatingFromFeedback(props.feedback))

const isDeleting = ref(false)

async function handleDelete() {
  if (!confirm(`Are you sure you want to delete this feedback?`)) {
    return
  }

  isDeleting.value = true
  try {
    emit(`delete`, props.feedback.id)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border border-default p-4">
    <div class="mb-3 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex flex-col items-center">
          <span class="text-2xl">{{ rating.emoji }}</span>
          <span class="text-xs font-bold" :class="getScoreColor(rating.score)">
            {{ rating.score }}/4
          </span>
        </div>
        <div>
          <div class="mb-1 flex items-center gap-2">
            <span class="text-sm font-medium">{{ rating.label }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-muted">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-calendar" class="size-3" />
              {{
                new Date(feedback.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              }}
            </span>
            <span v-if="feedback.country" class="flex items-center gap-1">
              <UIcon name="i-lucide-map-pin" class="size-3" />
              {{ feedback.country }}
            </span>
          </div>
        </div>
      </div>
      <UButton
        color="error"
        variant="ghost"
        size="sm"
        icon="i-lucide-trash-2"
        :loading="isDeleting"
        :disabled="isDeleting"
        @click="handleDelete"
      />
    </div>

    <div
      v-if="feedback.feedback"
      class="rounded bg-muted/30 p-3 text-sm leading-relaxed"
    >
      "{{ feedback.feedback }}"
    </div>
    <div v-else class="text-sm text-muted italic">
      No additional comment provided
    </div>
  </div>
</template>
