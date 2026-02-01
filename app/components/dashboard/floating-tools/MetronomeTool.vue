<script setup lang="ts">
const metronome = useMetronome()
</script>

<template>
  <div class="flex flex-col gap-4">
    <USlider v-model="metronome.bpm.value" :min="40" :max="240" color="primary" />
    <div class="flex flex-col items-center gap-xs">
      <div class="flex items-center gap-xs justify-center">
        <span class="text-4xl font-bold tabular-nums">
          {{ metronome.bpm }}
        </span>
        <span class="text-sm text-dimmed">BPM</span>
      </div>
      <div class="flex gap-xs">
        <div
          v-for="i in 4"
          :key="i"
          class="w-2 h-2 rounded-full transition-all duration-100"
          :class="[metronome.currentBeat.value % 4 === i-1 ? 'bg-primary-500 scale-125 shadow-[0_0_8px_rgba(var(--color-primary-500),0.5)]' : 'bg-primary-800']"
        />
      </div>
    </div>
    <UButton
      :label="metronome.isPlaying.value ? 'Stop' : 'Start'"
      block
      @click="metronome.isPlaying.value ? metronome.stopMetronome() : metronome.startMetronome()"
    />
  </div>
</template>

<style scoped></style>
