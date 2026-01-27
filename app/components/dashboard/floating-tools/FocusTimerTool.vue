<script setup lang="ts">
const focusTimer = useFocusTimer()
</script>

<template>
  <div class="flex flex-col gap-sm">
    <UProgress :model-value="focusTimer.progress.value" size="sm" color="primary" />

    <div class="flex flex-col items-center">
      <div class="text-4xl font-bold tabular-nums">
        {{ focusTimer.formattedTime.value }}
      </div>
      <div class="text-md text-muted uppercase">
        {{ focusTimer.mode.value.replace('-', ' ') }}
      </div>
    </div>

    <div class="flex items-center gap-sm">
      <UButton
          :icon="focusTimer.isRunning.value ? 'lucide:pause' : 'lucide:play'"
          :label="focusTimer.isRunning.value ? 'Pause' : 'Start'"
          :color="focusTimer.isRunning.value ? 'warning' : 'primary'"
          block
          size="sm"
          @click="focusTimer.isRunning.value ? focusTimer.pauseTimer() : focusTimer.startTimer()"
      />
      <UButton
          icon="lucide:rotate-ccw"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="focusTimer.resetTimer()"
      />
    </div>
  </div>
</template>

<style scoped>

</style>