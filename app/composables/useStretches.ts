import { computed } from "vue"

export interface WorkoutStretchItem {
  id: string
  name: string
  duration: number
}

export interface WorkoutStretchCategory {
  id: string
  name: string
  items: WorkoutStretchItem[]
}

let interval: any = null

export const useStretches = () => {
  const isRunning = useState("stretches-is-running", () => false)
  const isPaused = useState("stretches-is-paused", () => false)
  const currentStretchIndex = useState("stretches-current-index", () => -1)
  const timeLeft = useState("stretches-time-left", () => 0)
  const categories = useState<WorkoutStretchCategory[]>("stretches-categories", () => [])

  const allStretches = computed(() => {
    return categories.value.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryName: cat.name }))
    )
  })

  const currentStretch = computed(() => {
    if (currentStretchIndex.value >= 0 && currentStretchIndex.value < allStretches.value.length) {
      return allStretches.value[currentStretchIndex.value]
    }
    return null
  })

  const progress = computed(() => {
    if (!currentStretch.value || timeLeft.value <= 0) return 0
    return ((currentStretch.value.duration - timeLeft.value) / currentStretch.value.duration) * 100
  })

  function playSound() {
    if (!import.meta.client) return
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
    audio.play().catch(() => {})
  }

  function startTimer() {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        nextStretch()
      }
    }, 1000)
  }

  function startRoutine() {
    if (allStretches.value.length === 0) return
    stopRoutine()
    currentStretchIndex.value = 0
    isRunning.value = true
    isPaused.value = false
    startCurrentStretch()
  }

  function startCurrentStretch() {
    const stretch = allStretches.value[currentStretchIndex.value]
    if (!stretch) {
      completeRoutine()
      return
    }
    timeLeft.value = stretch.duration
    playSound()
    startTimer()
  }

  function nextStretch() {
    if (interval) clearInterval(interval)
    playSound()
    if (currentStretchIndex.value < allStretches.value.length - 1) {
      currentStretchIndex.value++
      startCurrentStretch()
    } else {
      completeRoutine()
    }
  }

  function pauseRoutine() {
    isPaused.value = true
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function resumeRoutine() {
    isPaused.value = false
    startTimer()
  }

  function stopRoutine() {
    isRunning.value = false
    isPaused.value = false
    currentStretchIndex.value = -1
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function completeRoutine() {
    stopRoutine()
    playSound()
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Stretching Routine Complete!", { body: "Great job!" })
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  if (isRunning.value && !isPaused.value && !interval && import.meta.client) {
    startTimer()
  }

  return {
    categories,
    isRunning,
    isPaused,
    currentStretchIndex,
    timeLeft,
    allStretches,
    currentStretch,
    progress,
    startRoutine,
    pauseRoutine,
    resumeRoutine,
    stopRoutine,
    formatTime
  }
}
