<script setup lang="ts">
const stretches = useStretches()
</script>

<template>
  <div class="flex flex-col gap-sm">
    <UProgress :model-value="stretches.progress.value" size="xs" color="primary" />
    <div v-if="stretches.currentStretch.value" class="flex flex-col items-center">
      <div class="text-xs text-dimmed truncate">
        {{ stretches.currentStretch.value.categoryName }}
      </div>
      <div class="text-lg font-bold truncate">
        {{ stretches.currentStretch.value.name || 'Unnamed' }}
      </div>
      <div class="text-3xl font-bold">
        {{ stretches.formatTime(stretches.timeLeft.value) }}
      </div>
    </div>

    <div class="flex items-center gap-sm">
      <UButton
          :icon="stretches.isPaused.value ? 'lucide:play' : 'lucide:pause'"
          :label="stretches.isPaused.value ? 'Resume' : 'Pause'"
          :color="stretches.isPaused.value ? 'success' : 'warning'"
          block
          size="sm"
          @click="stretches.isPaused.value ? stretches.resumeRoutine() : stretches.pauseRoutine()"
      />
      <UButton
          icon="lucide:square"
          color="error"
          variant="ghost"
          size="sm"
          @click="stretches.stopRoutine()"
      />
    </div>
  </div>
</template>

<style scoped>

</style>