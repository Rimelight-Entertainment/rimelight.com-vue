import { computed, watch } from "vue"

export type BeatState = "normal" | "accent" | "muted"
export type Division =
  | "quarter"
  | "eighth"
  | "sixteenth"
  | "triplet"
  | "quarter-2eighth"
  | "2eighth-quarter"

interface DivisionConfig {
  label: string
  beatsPerMeasure: number
  pattern?: number[]
}

const divisions: Record<Division, DivisionConfig> = {
  quarter: { label: "Quarter Note (♩)", beatsPerMeasure: 1 },
  eighth: { label: "Eighth Note (♪)", beatsPerMeasure: 2 },
  sixteenth: { label: "Sixteenth Note (♬)", beatsPerMeasure: 4 },
  triplet: { label: "Triplet (♪♪♪)", beatsPerMeasure: 3 },
  "quarter-2eighth": { label: "♩ + ♪♪", beatsPerMeasure: 3, pattern: [2, 1, 1] },
  "2eighth-quarter": { label: "♪♪ + ♩", beatsPerMeasure: 3, pattern: [1, 1, 2] }
}

// Global state and non-reactive variables to persist across usage
let audioContext: AudioContext | null = null
let nextNoteTime = 0
let currentSubdivisionIndex = 0
let schedulerTimer: any = null
let durationTimer: any = null

export const useMetronome = () => {
  const bpm = useState("metronome-bpm", () => 120)
  const bpmInput = useState("metronome-bpm-input", () => "120")
  const beats = useState("metronome-beats", () => 4)
  const division = useState<Division>("metronome-division", () => "quarter")
  const isPlaying = useState("metronome-is-playing", () => false)
  const currentBeat = useState("metronome-current-beat", () => -1)
  const beatStates = useState<BeatState[]>("metronome-beat-states", () => Array(4).fill("normal"))

  const isInfinite = useState("metronome-is-infinite", () => true)
  const durationMinutes = useState("metronome-duration-minutes", () => 5)
  const durationSeconds = useState("metronome-duration-seconds", () => 0)
  const remainingTime = useState("metronome-remaining-time", () => 0)

  const lookahead = 25.0
  const scheduleAheadTime = 0.1

  const totalSubdivisions = computed(() => {
    return beats.value * divisions[division.value].beatsPerMeasure
  })

  // Initialize beat states if they don't match totalSubdivisions
  watch(
    [beats, division],
    () => {
      const total = totalSubdivisions.value
      if (beatStates.value.length !== total) {
        beatStates.value = Array(total).fill("normal")
        currentBeat.value = -1
      }
    },
    { immediate: true }
  )

  function initAudioContext() {
    if (!audioContext && import.meta.client) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioContext?.state === "suspended") {
      audioContext.resume()
    }
  }

  function playClick(time: number, isAccent: boolean) {
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = isAccent ? 1200 : 800
    gainNode.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05)

    oscillator.start(time)
    oscillator.stop(time + 0.05)
  }

  function scheduleNote(beatNumber: number, time: number) {
    const state = beatStates.value[beatNumber]
    if (state === "muted") return
    const isAccent = state === "accent"
    playClick(time, isAccent)
  }

  function scheduler() {
    if (!audioContext) return

    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
      currentBeat.value = (currentBeat.value + 1) % totalSubdivisions.value
      scheduleNote(currentBeat.value, nextNoteTime)

      const divisionConfig = divisions[division.value]
      const secondsPerBeat = 60.0 / bpm.value

      if (divisionConfig.pattern) {
        const pattern = divisionConfig.pattern
        const totalPatternUnits = pattern.reduce((sum, val) => sum + val, 0)
        const currentPatternIndex = currentSubdivisionIndex % pattern.length
        const currentSubdivisionDuration = pattern[currentPatternIndex]

        if (currentSubdivisionDuration !== undefined) {
          const secondsPerSubdivision =
            (secondsPerBeat * currentSubdivisionDuration) / totalPatternUnits
          nextNoteTime += secondsPerSubdivision
        }
        currentSubdivisionIndex = (currentSubdivisionIndex + 1) % pattern.length
      } else {
        const subdivisions = divisionConfig.beatsPerMeasure
        const secondsPerSubdivision = secondsPerBeat / subdivisions
        nextNoteTime += secondsPerSubdivision
      }
    }
  }

  function startMetronome() {
    if (isPlaying.value) return
    initAudioContext()
    if (!audioContext) return

    isPlaying.value = true
    currentBeat.value = -1
    currentSubdivisionIndex = 0
    nextNoteTime = audioContext.currentTime

    if (!isInfinite.value) {
      remainingTime.value = durationMinutes.value * 60 + durationSeconds.value
      durationTimer = setInterval(() => {
        remainingTime.value--
        if (remainingTime.value <= 0) {
          stopMetronome()
        }
      }, 1000)
    }

    schedulerTimer = setInterval(scheduler, lookahead)
  }

  function stopMetronome() {
    isPlaying.value = false
    currentBeat.value = -1
    currentSubdivisionIndex = 0

    if (schedulerTimer) {
      clearInterval(schedulerTimer)
      schedulerTimer = null
    }
    if (durationTimer) {
      clearInterval(durationTimer)
      durationTimer = null
    }
  }

  // Handle cross-sync if isPlaying is true but timers are not (e.g. navigation)
  if (isPlaying.value && !schedulerTimer && import.meta.client) {
    startMetronome()
  }

  return {
    bpm,
    bpmInput,
    beats,
    division,
    isPlaying,
    currentBeat,
    beatStates,
    isInfinite,
    durationMinutes,
    durationSeconds,
    remainingTime,
    startMetronome,
    stopMetronome,
    divisions
  }
}
