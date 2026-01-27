<script setup lang="ts">
import { CalendarDate, Time, type DateValue } from '@internationalized/date'
import { format, differenceInSeconds } from 'date-fns'

// 1. Define the Range type to match Nuxt UI / Reka UI expectations
type DateRange = {
  start: DateValue | undefined
  end: DateValue | undefined
}

definePageMeta({
  layout: "dashboard"
})

const links = computed(() => ([
  { label: 'Overview', icon: 'lucide:home', to: '/dashboard/health', exact: true },
  { label: 'Workout', icon: 'lucide:biceps-flexed', to: '/dashboard/health/workout' },
  { label: 'Measurements', icon: 'lucide:scale', to: '/dashboard/health/measurements' },
  { label: 'Dieting', icon: 'lucide:apple', to: '/dashboard/health/dieting' }
]))

const { data, refresh } = await useFetch('/api/health/fasting')

const activeFast = computed(() => data.value?.activeFast)
const history = computed(() => data.value?.history || [])

const inputDate = useTemplateRef('inputDate')
const now = new Date()

// Helper functions for conversion
function dateToCalendarDate(date: Date): any {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function dateToTime(date: Date): any {
  return new Time(date.getHours(), date.getMinutes())
}

interface SimpleTime {
  hour: number
  minute: number
  second?: number
  millisecond?: number
}

interface SimpleDate {
  year: number
  month: number
  day: number
}

function combineDateTime(dateVal: SimpleDate | undefined, timeVal: SimpleTime | null | undefined): Date {
  if (!dateVal) return new Date()
  const d = new Date(dateVal.year, dateVal.month - 1, dateVal.day)
  if (timeVal) {
    d.setHours(timeVal.hour, timeVal.minute, timeVal.second || 0, timeVal.millisecond || 0)
  } else {
    d.setHours(0, 0, 0, 0)
  }
  return d
}

// 2. Use the generic DateValue/Time types for the refs to satisfy the component props
const modelValue = ref<any>({
  start: dateToCalendarDate(new Date()),
  end: dateToCalendarDate(new Date(now.getTime() + 24 * 60 * 60 * 1000))
})

// Using 'any' as a fallback if the library-internal TimeValue interface is still failing
// though 'Time' usually works if the versions are synced.
// Explicitly typing as 'any' here is often necessary for UInputTime v-model compatibility
// because of the ZonedDateTime private fields.
const startTimeValue = ref<any>(dateToTime(new Date()))
const endTimeValue = ref<any>(dateToTime(new Date()))

const ignoreNextModelUpdate = ref(false)

watch(activeFast, (val) => {
  if (val) {
    ignoreNextModelUpdate.value = true
    const start = new Date(val.startTime)
    const end = new Date(val.endTime)

    modelValue.value = {
      start: dateToCalendarDate(start),
      end: dateToCalendarDate(end)
    }
    startTimeValue.value = dateToTime(start)
    endTimeValue.value = dateToTime(end)
  }
}, { immediate: true })

watch([modelValue, startTimeValue, endTimeValue], async ([newModel]) => {
  if (ignoreNextModelUpdate.value) {
    ignoreNextModelUpdate.value = false
    return
  }

  if (newModel.start && newModel.end) {
    if (activeFast.value) {
      await updateFast()
    }
  }
}, { deep: true })

const isStarting = ref(false)

async function startFast() {
  isStarting.value = true
  try {
    const start = combineDateTime(modelValue.value.start, startTimeValue.value)
    const end = combineDateTime(modelValue.value.end, endTimeValue.value)

    await $fetch('/api/health/fasting', {
      method: 'POST',
      body: {
        startTime: start.toISOString(),
        endTime: end.toISOString()
      }
    })
    await refresh()
  } catch (e) {
    console.error(e)
  } finally {
    isStarting.value = false
  }
}

async function updateFast() {
  if (!activeFast.value) return
  try {
    const start = combineDateTime(modelValue.value.start, startTimeValue.value)
    const end = combineDateTime(modelValue.value.end, endTimeValue.value)

    await $fetch('/api/health/fasting', {
      method: 'PATCH',
      body: {
        id: activeFast.value.id,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      }
    })
    await refresh()
  } catch (e) {
    console.error(e)
  }
}

async function stopFast() {
  if (!activeFast.value) return
  try {
    await $fetch('/api/health/fasting', {
      method: 'PATCH',
      body: {
        id: activeFast.value.id,
        isActive: false
      }
    })
    await refresh()
  } catch (e) {
    console.error(e)
  }
}

// Timer logic
const currentTime = ref(new Date())
let timer: any = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const progress = computed(() => {
  if (!activeFast.value) return 0
  const start = new Date(activeFast.value.startTime).getTime()
  const end = new Date(activeFast.value.endTime).getTime()
  const nowVal = currentTime.value.getTime()

  if (nowVal < start) return 0
  const total = end - start
  const elapsed = nowVal - start
  return Math.min(Math.round((elapsed / total) * 100), 100)
})

const timeElapsed = computed(() => {
  if (!activeFast.value) return '00:00:00'
  const start = new Date(activeFast.value.startTime)
  const diff = Math.max(0, differenceInSeconds(currentTime.value, start))

  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const timeRemaining = computed(() => {
  if (!activeFast.value) return '00:00:00'
  const end = new Date(activeFast.value.endTime)
  const diff = Math.max(0, differenceInSeconds(end, currentTime.value))

  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

function formatDateTime(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

function calculateDuration(start: string | Date, end: string | Date) {
  const diff = differenceInSeconds(new Date(end), new Date(start))
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function getCompletionText(fast: any) {
  const start = new Date(fast.startTime)
  const end = new Date(fast.endTime)
  const plannedEnd = fast.originalEndTime ? new Date(fast.originalEndTime) : end

  const plannedDiff = differenceInSeconds(plannedEnd, start)
  const actualDiff = differenceInSeconds(end, start)

  const plannedDurationText = calculateDuration(fast.startTime, plannedEnd)
  const completedDurationText = calculateDuration(fast.startTime, end)

  if (plannedDiff <= 0) return `Completed ${completedDurationText}`

  const percentage = Math.min(Math.round((actualDiff / plannedDiff) * 100), 100)

  if (percentage < 100) {
    return `Completed ${completedDurationText} of ${plannedDurationText} (${percentage}%)`
  }

  return `Completed ${completedDurationText}`
}
</script>

<template>
  <UDashboardPanel id="dieting" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Dieting">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col w-full lg:max-w-4xl mx-auto gap-8">
        <!-- Fasting Tracker Card -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-timer" class="w-5 h-5 text-primary" />
                Fasting Tracker
              </h3>
              <UBadge v-if="activeFast" color="primary" variant="subtle">Active</UBadge>
              <UBadge v-else color="neutral" variant="subtle">Inactive</UBadge>
            </div>
          </template>

          <div class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Fast Duration</label
                >
                <UInputDate
                  ref="inputDate"
                  v-model="modelValue"
                  range
                  format="dd/MM/yyyy"
                  locale="en-GB"
                  class="w-full"
                >
                  <template #trailing>
                    <UPopover :reference="inputDate?.inputsRef[0]?.$el">
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-calendar"
                        aria-label="Select a date range"
                        class="px-0"
                      />

                      <template #content>
                        <UCalendar
                          v-model="modelValue"
                          class="p-2"
                          :number-of-months="2"
                          range
                          locale="en-GB"
                        />
                      </template>
                    </UPopover>
                  </template>
                </UInputDate>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Start Time</label
                  >
                  <UInputTime
                    v-model="startTimeValue"
                    icon="i-lucide-clock"
                    :hour-cycle="24"
                    class="w-full"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >End Time</label
                  >
                  <UInputTime
                    v-model="endTimeValue"
                    icon="i-lucide-clock"
                    :hour-cycle="24"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Active Fast Stats -->
            <div v-if="activeFast" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">Time Elapsed</p>
                <p class="text-2xl font-mono font-bold">{{ timeElapsed }}</p>
              </div>
              <div
                class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">Time Remaining</p>
                <p class="text-2xl font-mono font-bold">{{ timeRemaining }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="activeFast" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>Progress</span>
                <span>{{ progress }}%</span>
              </div>
              <UProgress :value="progress" color="primary" />
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <template v-if="!activeFast">
                <UButton
                  block
                  color="primary"
                  icon="i-lucide-play"
                  :loading="isStarting"
                  @click="startFast"
                >
                  Start Fast
                </UButton>
              </template>
              <template v-else>
                <UButton color="error" icon="i-lucide-square" block @click="stopFast">
                  End Fast
                </UButton>
              </template>
            </div>
          </div>
        </UCard>

        <!-- History -->
        <UCard v-if="history.length > 0">
          <template #header>
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-history" class="w-5 h-5 text-primary" />
              Recent Fasts
            </h3>
          </template>

          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div
              v-for="fast in history"
              :key="fast.id"
              class="py-3 flex items-center justify-between"
            >
              <div>
                <p class="font-medium">
                  {{ formatDateTime(fast.startTime) }} - {{ formatDateTime(fast.endTime) }}
                </p>
                <p class="text-sm text-gray-500">{{ getCompletionText(fast) }}</p>
              </div>
              <UBadge color="neutral" variant="subtle">Completed</UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
