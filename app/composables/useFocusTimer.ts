import { useNuxtApp, useState, useToast } from "#imports"
import { Time } from "@internationalized/date"
import { computed } from "vue"

export const useFocusTimer = () => {
  const nuxtApp = useNuxtApp()

  // State scoped to the app instance to avoid cross-user pollution
  if (!nuxtApp._focusTimerState) {
    nuxtApp._focusTimerState = {
      timer: null
    }
  }
  const appState = nuxtApp._focusTimerState as { timer: any }

  const initialTime = useState("focusTimer-initial-time", () => ({
    hour: 0,
    minute: 25,
    second: 0
  }))
  const timeLeft = useState("focusTimer-time-left", () => 25 * 60)
  const isRunning = useState("focusTimer-is-running", () => false)
  const sessionsCompleted = useState("focusTimer-sessions-completed", () => 0)
  const mode = useState<"work" | "short-break" | "long-break">("focusTimer-mode", () => "work")
  const isModified = useState("focusTimer-is-modified", () => false)

  // Bridge for UInputTime (class instance) while keeping state as POJO
  const initialTimeValue = computed({
    get: () => new Time(initialTime.value.hour, initialTime.value.minute, initialTime.value.second),
    set: (val) => {
      initialTime.value = { hour: val.hour, minute: val.minute, second: val.second }
      isModified.value = true
    }
  })

  const toast = useToast()

  const presets = {
    work: { label: "Work", time: { hour: 0, minute: 25, second: 0 }, theme: "primary" },
    "short-break": {
      label: "Short Break",
      time: { hour: 0, minute: 5, second: 0 },
      theme: "success"
    },
    "long-break": { label: "Long Break", time: { hour: 0, minute: 15, second: 0 }, theme: "info" }
  }

  const formattedTime = computed(() => {
    const h = Math.floor(timeLeft.value / 3600)
    const m = Math.floor((timeLeft.value % 3600) / 60)
    const s = timeLeft.value % 60

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  })

  const progress = computed(() => {
    const total =
      initialTime.value.minute * 60 + initialTime.value.second + initialTime.value.hour * 3600
    if (total === 0) return 0
    return ((total - timeLeft.value) / total) * 100
  })

  function setMode(newMode: "work" | "short-break" | "long-break") {
    mode.value = newMode
    initialTime.value = presets[newMode].time
    timeLeft.value =
      initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second
    isModified.value = false
  }

  function startTimer() {
    if (isRunning.value) return

    if (timeLeft.value <= 0 || isModified.value) {
      timeLeft.value =
        initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second
      isModified.value = false
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    isRunning.value = true
    runInterval()
  }

  function runInterval() {
    if (appState.timer) clearInterval(appState.timer)
    appState.timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        completeSession()
      }
    }, 1000)
  }

  function pauseTimer() {
    isRunning.value = false
    if (appState.timer) {
      clearInterval(appState.timer)
      appState.timer = null
    }
  }

  function resetTimer() {
    pauseTimer()
    timeLeft.value =
      initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second
    isModified.value = false
  }

  function completeSession() {
    pauseTimer()

    if (mode.value === "work") {
      sessionsCompleted.value++
    }

    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
    audio.play().catch(() => {})

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Focus Timer Done!", {
        body: mode.value === "work" ? "Time for a break!" : "Break over, back to work!",
        icon: "/logo.png"
      })
    }

    toast.add({
      title: "Timer Finished!",
      description:
        mode.value === "work" ? "Great work! Take a break." : "Break is over! Time to focus.",
      color: "success"
    })

    if (mode.value === "work") {
      if (sessionsCompleted.value % 4 === 0) {
        setMode("long-break")
      } else {
        setMode("short-break")
      }
    } else {
      setMode("work")
    }
  }

  if (isRunning.value && !appState.timer && import.meta.client) {
    runInterval()
  }

  return {
    initialTimeValue,
    timeLeft,
    isRunning,
    sessionsCompleted,
    mode,
    isModified,
    formattedTime,
    progress,
    presets,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer
  }
}
