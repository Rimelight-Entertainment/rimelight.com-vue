<script setup lang="ts">
import { ref, computed, onUnmounted, resolveComponent } from 'vue'
import { Time } from '@internationalized/date'

const toast = useToast()
const UInputTime = resolveComponent('UInputTime')

// State
const initialTime = ref(new Time(0, 25, 0))
const timeLeft = ref(25 * 60) // in seconds
const isRunning = ref(false)
const timer = ref<any>(null)
const sessionsCompleted = ref(0)
const mode = ref<'work' | 'short-break' | 'long-break'>('work')
const isModified = ref(false)

// Presets
const presets = {
  work: { label: 'Work', time: new Time(0, 25, 0), theme: 'primary' },
  'short-break': { label: 'Short Break', time: new Time(0, 5, 0), theme: 'success' },
  'long-break': { label: 'Long Break', time: new Time(0, 15, 0), theme: 'info' }
}

const formattedTime = computed(() => {
  const h = Math.floor(timeLeft.value / 3600)
  const m = Math.floor((timeLeft.value % 3600) / 60)
  const s = timeLeft.value % 60
  
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const progress = computed(() => {
  const total = initialTime.value.minute * 60 + initialTime.value.second + (initialTime.value.hour * 3600)
  if (total === 0) return 0
  return ((total - timeLeft.value) / total) * 100
})

function setMode(newMode: 'work' | 'short-break' | 'long-break') {
  mode.value = newMode
  initialTime.value = presets[newMode].time
}

function startTimer() {
  if (isRunning.value) return
  
  // If the user modified the target time or the timer finished, 
  // we sync the active timer with the input values
  if (timeLeft.value <= 0 || isModified.value) {
    timeLeft.value = initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second
    isModified.value = false
  }
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }

  isRunning.value = true
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      completeSession()
    }
  }, 1000)
}

function pauseTimer() {
  isRunning.value = false
  if (timer.value) clearInterval(timer.value)
}

function resetTimer() {
  pauseTimer()
  timeLeft.value = initialTime.value.hour * 3600 + initialTime.value.minute * 60 + initialTime.value.second
  isModified.value = false
}

function completeSession() {
  pauseTimer()
  
  if (mode.value === 'work') {
    sessionsCompleted.value++
  }

  // Play sound
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
  audio.play().catch(() => {
    // Chrome blocks auto-play if no user interaction
  })

  // Show notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Timer Done!', {
      body: mode.value === 'work' ? 'Time for a break!' : 'Break over, back to work!',
      icon: '/logo.png'
    })
  }

  toast.add({
    title: 'Timer Finished!',
    description: mode.value === 'work' ? 'Great work! Take a break.' : 'Break is over! Time to focus.',
    color: 'success'
  })

  // Auto-switch modes
  if (mode.value === 'work') {
    if (sessionsCompleted.value % 4 === 0) {
      setMode('long-break')
    } else {
      setMode('short-break')
    }
  } else {
    setMode('work')
  }
}

// Mark as modified whenever the input or presets change
watch(initialTime, () => {
  isModified.value = true
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})
</script>

<template>
  <div class="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-timer" class="w-6 h-6 text-primary-500" />
        <h3 class="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">Practice Timer</h3>
      </div>
      
      <div class="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <UButton 
          v-for="(data, key) in presets" 
          :key="key"
          :label="data.label"
          :variant="mode === key ? 'solid' : 'ghost'"
          :color="data.theme as any"
          size="xs"
          @click="setMode(key as any)"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Timer Display -->
      <div class="relative flex flex-col items-center justify-center py-4">
        <div class="text-6xl font-black font-mono tracking-tighter text-gray-900 dark:text-white tabular-nums drop-shadow-sm">
          {{ formattedTime }}
        </div>
        <div class="mt-2 flex items-center gap-2">
          <UBadge variant="subtle" color="neutral" size="sm">
            <UIcon name="i-lucide-check-circle-2" class="mr-1" />
            {{ sessionsCompleted }} Sessions
          </UBadge>
        </div>
        
        <!-- Progress Bar -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
           <!-- Subtle background indicator could go here -->
        </div>
      </div>

      <!-- Controls -->
      <div class="space-y-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Set Duration</label>
          <UInputTime 
            v-model="initialTime" 
            size="lg" 
            class="w-full"
            :hour-cycle="24"
            icon="i-lucide-clock"
          />
        </div>

        <div class="flex items-center gap-3">
          <UButton 
            v-if="!isRunning" 
            icon="i-lucide-play" 
            label="Start" 
            color="primary" 
            size="lg" 
            block 
            @click="startTimer" 
          />
          <UButton 
            v-else 
            icon="i-lucide-pause" 
            label="Pause" 
            color="warning" 
            size="lg" 
            block 
            @click="pauseTimer" 
          />
          <UButton 
            icon="i-lucide-rotate-ccw" 
            color="neutral" 
            variant="ghost" 
            size="lg" 
            @click="resetTimer" 
          />
        </div>
      </div>
    </div>
    
    <UProgress :value="progress" color="primary" size="sm" class="transition-all duration-1000" />
  </div>
</template>
