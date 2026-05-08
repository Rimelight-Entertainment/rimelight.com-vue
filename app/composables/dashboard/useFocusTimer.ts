import { Time } from "@internationalized/date";
import { computed } from "vue";
import { defaultWindow } from "#utils";

export const useFocusTimer = () => {
  // 1. Initializing
  const nuxtApp = useNuxtApp();
  // State scoped to the app instance to avoid cross-user pollution
  if (!nuxtApp._focusTimerState) {
    nuxtApp._focusTimerState = {
      timer: null,
    };
  }
  const appState = nuxtApp._focusTimerState as { timer: any };

  // 2. Refs
  const initialTime = useState("focusTimer-initial-time", () => ({
    hour: 0,
    minute: 25,
    second: 0,
  }));
  const timeLeft = useState("focusTimer-time-left", () => 25 * 60);
  const isRunning = useState("focusTimer-is-running", () => false);
  const sessionsCompleted = useState("focusTimer-sessions-completed", () => 0);
  const mode = useState<"work" | "short-break" | "long-break">("focusTimer-mode", () => "work");
  const isModified = useState("focusTimer-is-modified", () => false);
  const error = useState<Error | null>("focusTimer-error", () => null);
  const status = useState<"idle" | "running" | "paused" | "completed">(
    "focusTimer-status",
    () => "idle",
  );

  const presets = {
    work: { label: "Work", time: { hour: 0, minute: 25, second: 0 }, theme: "primary" },
    "short-break": {
      label: "Short Break",
      time: { hour: 0, minute: 5, second: 0 },
      theme: "success",
    },
    "long-break": { label: "Long Break", time: { hour: 0, minute: 15, second: 0 }, theme: "info" },
  };

  // 3. Computed
  const initialTimeValue = computed({
    get: () => new Time(initialTime.value.hour, initialTime.value.minute, initialTime.value.second),
    set: (val) => {
      initialTime.value = { hour: val.hour, minute: val.minute, second: val.second };
      isModified.value = true;
    },
  });

  const formattedTime = computed(() => {
    const h = Math.floor(timeLeft.value / 3600);
    const m = Math.floor((timeLeft.value % 3600) / 60);
    const s = timeLeft.value % 60;

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  });

  const progress = computed(() => {
    const total =
      initialTime.value.minute * 60 + initialTime.value.second + initialTime.value.hour * 3600;
    if (total === 0) return 0;
    return ((total - timeLeft.value) / total) * 100;
  });

  // 4. Methods
  function setMode(newMode: "work" | "short-break" | "long-break") {
    mode.value = newMode;
    initialTime.value = presets[newMode].time;
    timeLeft.value =
      initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second;
    isModified.value = false;
  }

  function startTimer() {
    if (isRunning.value) return;

    if (timeLeft.value <= 0 || isModified.value) {
      timeLeft.value =
        initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second;
      isModified.value = false;
    }

    if (
      defaultWindow &&
      "Notification" in defaultWindow &&
      (defaultWindow as any).Notification.permission === "default"
    ) {
      (defaultWindow as any).Notification.requestPermission();
    }

    isRunning.value = true;
    status.value = "running";
    runInterval();
  }

  function runInterval() {
    if (appState.timer) clearInterval(appState.timer);
    appState.timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        completeSession();
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning.value = false;
    status.value = "paused";
    if (appState.timer) {
      clearInterval(appState.timer);
      appState.timer = null;
    }
  }

  function resetTimer() {
    pauseTimer();
    status.value = "idle";
    timeLeft.value =
      initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second;
    isModified.value = false;
  }

  function completeSession() {
    pauseTimer();
    status.value = "completed";

    if (mode.value === "work") {
      sessionsCompleted.value++;
    }

    if (defaultWindow) {
      const audio = new (defaultWindow as any).Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
      );
      audio.play().catch(() => {});
    }

    if (
      defaultWindow &&
      "Notification" in defaultWindow &&
      (defaultWindow as any).Notification.permission === "granted"
    ) {
      new (defaultWindow as any).Notification("Focus Timer Done!", {
        body: mode.value === "work" ? "Time for a break!" : "Break over, back to work!",
        icon: "/logo.png",
      });
    }

    if (mode.value === "work") {
      if (sessionsCompleted.value % 4 === 0) {
        setMode("long-break");
      } else {
        setMode("short-break");
      }
    } else {
      setMode("work");
    }
  }

  // 5. Lifecycle Hooks (Client-side sync)
  if (isRunning.value && !appState.timer && import.meta.client) {
    runInterval();
  }

  return {
    initialTimeValue,
    timeLeft,
    isRunning,
    sessionsCompleted,
    mode,
    isModified,
    error,
    status,
    formattedTime,
    progress,
    presets,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};
