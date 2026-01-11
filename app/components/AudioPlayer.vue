<script setup lang="ts">

const audio = useTemplateRef<HTMLAudioElement>("audio")
const canvas = ref<HTMLCanvasElement | null>(null)
const isWaveformInitialized = ref(false)

const {
  imageSrc,
  imageAlt,
  audioSrc,
  initialVolume = 0.5
} = defineProps<{
  imageSrc: string
  imageAlt: string
  audioSrc: string
  initialVolume?: number
}>()

const {
  playing,
  currentTime,
  duration,
  volume = initialVolume,
  muted
} = useMediaControls(audio, {
  src: audioSrc
})

const waveformProps = {
  src: audioSrc,
  canvWidth: 600,
  canvHeight: 240,
  audioControls: false,
  playtimeClickable: true,
  playtimeWithMs: false,
  playtimeSlider: false,
  playtimeLineWidth: 0.8,
  playtimeLineColor: "cyan",
  noplayedLineColor: "green",
  playtimeFontColor: "cyan",
  playtimeTextBottom: true
}

watch(
  duration,
  (newDuration) => {
    // duration becomes a positive, finite number once the audio file metadata is loaded.
    if (
      isFinite(newDuration) &&
      newDuration > 0 &&
      !isWaveformInitialized.value
    ) {

      // Set flag to prevent subsequent calls.
      isWaveformInitialized.value = true

      // Optional (but sometimes necessary) quick-start to ensure the Web Audio Context initializes
      // In a production app, use an event listener on the <audio> tag for 'canplaythrough'
      // for more reliable readiness, but watching duration is often sufficient
      // when using VueUse's useMediaControls.

      console.log("Audio fully loaded. Waveform initialization triggered.")
    }
  },
  { immediate: true }
)

/**
 * Converts seconds to a 'MM:SS' format.
 */
const formatTime = (seconds: number) => {
  if (!isFinite(seconds)) return "00:00"
  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))
</script>

<template>
  <UCard>
    <audio ref="audio" preload="auto" class="hidden" />
    <template #header>
      <div class="flex flex-row gap-md">
        <NuxtImg v-if="imageSrc" :src="imageSrc" :alt="imageAlt" class="aspect-square size-64" />
        <div class="flex flex-col gap-md">
          <canvas
            ref="canvas"
            :style="{
              width: `${waveformProps.canvWidth}px`,
              height: `${waveformProps.canvHeight}px`
            }"
            class="block"
          />
        </div>
      </div>
    </template>
    <div class="flex w-full flex-row gap-lg">
      <div class="flex w-full flex-row items-center gap-sm">
        <UButton
          size="xl"
          variant="ghost"
          :icon="playing ? 'lucide:circle-pause' : 'lucide:circle-play'"
          @click="playing = !playing"
          :aria-label="playing ? 'Pause Audio' : 'Play Audio'"
        />
        <div class="text-sm text-muted">
          {{ formattedCurrentTime }}
        </div>
        <USlider
          v-model="currentTime"
          :min="0"
          :max="duration"
          :step="0.1"
          :disabled="duration === 0 || !isFinite(duration)"
          :default-value="0"
          :ui="{ track: 'h-[4px]' }"
        />
        <div class="font-mono text-sm text-white/50">
          {{ formattedDuration }}
        </div>
      </div>
      <div class="flex flex-row items-center gap-xs">
        <UButton
          :icon="muted ? 'lucide:volume-x' : 'lucide:volume-2'"
          @click="muted = !muted"
          variant="ghost"
          :aria-label="muted ? 'Unmute Audio' : 'Mute Audio'"
        />
        <USlider
          v-model="volume"
          :min="0"
          :max="1"
          :step="0.01"
          aria-label="Volume Control"
          :ui="{ track: 'h-[4px]' }"
          class="w-24"
        />
        <div class="w-8 text-right text-xs">{{ Math.round(volume * 100) }}%</div>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row justify-between gap-md">
        <div class="flex flex-row gap-xs">
          <UButton variant="ghost" icon="lucide:play" />
          <UButton variant="ghost" icon="lucide:heart" />
          <UButton variant="ghost" icon="lucide:share" />
        </div>
        <div class="flex flex-row gap-xs">
          <UButton variant="ghost" icon="lucide:play" label="0000" />
          <UButton variant="ghost" icon="lucide:heart" label="0000" />
          <UButton variant="ghost" icon="lucide:send" label="Share" />
        </div>
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
