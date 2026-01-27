<script setup lang="ts">
import { v7 as uuidv7 } from "uuid";
import draggable from "vuedraggable";
import type { WorkoutExerciseCategory } from "~~/server/db/schema/health/workout";

const props = defineProps<{
    modelValue: WorkoutExerciseCategory[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", data: WorkoutExerciseCategory[]): void;
    (e: "change"): void;
}>();

const categories = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit("update:modelValue", val);
        emit("change");
    }
});

// Local state for set timers
const activeTimers = ref<Record<string, any>>({}); // set.id -> intervalId
const timeRemaining = ref<Record<string, number>>({}); // set.id -> seconds remaining
const completedSets = ref<Set<string>>(new Set());

// Watch for changes to save, but we rely on parent to debounce save if needed
function onChange() {
    emit("change");
}

function addCategory() {
    categories.value = [
        ...categories.value,
        {
            id: uuidv7(),
            name: "",
            items: []
        }
    ];
    onChange();
}

function removeCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id);
    onChange();
}

function addExercise(catId: string) {
    const newCategories = [...categories.value];
    const cat = newCategories.find(c => c.id === catId);
    if (cat) {
        cat.items.push({
            id: uuidv7(),
            name: "",
            notes: "",
            sets: [{
                id: uuidv7(),
                kg: "",
                reps: "",
                restTimer: 60
            }]
        });
        categories.value = newCategories;
        onChange();
    }
}

function removeExercise(catId: string, exId: string) {
    const newCategories = [...categories.value];
    const cat = newCategories.find(c => c.id === catId);
    if (cat) {
        cat.items = cat.items.filter(e => e.id !== exId);
        categories.value = newCategories;
        onChange();
    }
}

function addSet(catId: string, exerciseId: string) {
    const newCategories = [...categories.value];
    const cat = newCategories.find(c => c.id === catId);
    if (cat) {
        const ex = cat.items.find(e => e.id === exerciseId);
        if (ex) {
            const lastSet = ex.sets[ex.sets.length - 1];
            ex.sets.push({
                id: uuidv7(),
                kg: lastSet ? lastSet.kg : "",
                reps: lastSet ? lastSet.reps : "",
                restTimer: lastSet ? lastSet.restTimer : 60
            });
            categories.value = newCategories;
            onChange();
        }
    }
}

function removeSet(catId: string, exerciseId: string, setId: string) {
    const newCategories = [...categories.value];
    const cat = newCategories.find(c => c.id === catId);
    if (cat) {
        const ex = cat.items.find(e => e.id === exerciseId);
        if (ex) {
            ex.sets = ex.sets.filter(s => s.id !== setId);
            categories.value = newCategories;
            onChange();
        }
    }
}

function onSetComplete(setId: string) {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(() => {});
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rest Timer Done!', { body: 'Time for your next set!' });
    }
    // Clear timer
    if (activeTimers.value[setId]) {
        clearInterval(activeTimers.value[setId]);
        delete activeTimers.value[setId];
    }
    delete timeRemaining.value[setId];
}

function toggleSet(setId: string, restTime: number) {
    if (completedSets.value.has(setId)) {
        completedSets.value.delete(setId);
        if (activeTimers.value[setId]) {
            clearInterval(activeTimers.value[setId]);
            delete activeTimers.value[setId];
            delete timeRemaining.value[setId];
        }
    } else {
        completedSets.value.add(setId);
        startSetTimer(setId, restTime);
    }
}

function startSetTimer(setId: string, duration: number) {
  if (activeTimers.value[setId]) {
    clearInterval(activeTimers.value[setId]);
  }

  timeRemaining.value[setId] = duration;

  activeTimers.value[setId] = setInterval(() => {
    const remaining = timeRemaining.value[setId];

    if (remaining !== undefined && remaining > 0) {
      timeRemaining.value[setId] = remaining - 1;
    } else {
      onSetComplete(setId);
    }
  }, 1000);
}

onUnmounted(() => {
    Object.values(activeTimers.value).forEach(curr => clearInterval(curr));
});

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
</script>

<template>
  <div class="flex flex-col gap-xl">
    <div class="flex flex-col gap-sm">
      <div class="flex items-center justify-between">
        <h3>Exercises</h3>
      </div>

      <USeparator />
    </div>

    <UEmpty
      v-if="categories.length === 0"
      title="No exercise categories added yet."
      description="Start your workout plan!"
      :actions="[ { icon: 'lucide:plus', label: 'Add Category', onClick: addCategory }]"
    />

    <template v-else>
      <draggable
        v-model="categories"
        item-key="id"
        handle=".category-drag-handle"
        :animation="200"
        @end="onChange"
        class="flex flex-col gap-lg"
      >
        <template #item="{ element: category }">
          <UCard variant="soft" :ui="{ body: 'flex flex-col gap-md' }">
            <!-- Category Header -->
            <div class="flex items-center group">
              <UButton
                size="sm"
                variant="ghost"
                icon="lucide:grip-vertical"
                class="category-drag-handle"
              />

              <UInput
                v-model="category.name"
                variant="none"
                placeholder="Category Name (e.g. Chest Day, Pull)"
                class="w-full"
                @blur="onChange"
                @keyup.enter="onChange"
              />
              <UButton
                icon="i-lucide-trash"
                color="error"
                variant="ghost"
                size="xs"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                @click="removeCategory(category.id)"
              />
            </div>

            <draggable
              v-model="category.items"
              item-key="id"
              handle=".drag-handle"
              :animation="200"
              group="exercise-items"
              class="flex flex-col gap-lg"
              @end="onChange"
            >
              <template #item="{ element: exercise }">
                <div class="flex flex-col gap-md group">
                  <!-- Exercise Header -->
                  <div class="flex items-start gap-sm">
                    <UButton
                      size="sm"
                      variant="ghost"
                      icon="lucide:grip-vertical"
                      class="drag-handle opacity-0 group-hover:opacity-100 transition-opacity"
                    />

                    <div class="flex-1 flex flex-col gap-xs">
                      <UInput
                        v-model="exercise.name"
                        placeholder="Exercise Name (e.g. Bench Press)"
                        variant="none"
                        class="w-full"
                        @change="onChange"
                      />
                      <UInput
                        v-model="exercise.notes"
                        placeholder="Notes..."
                        variant="none"
                        size="xs"
                        icon="lucide:sticky-note"
                        class="w-full"
                        @change="onChange"
                      />
                    </div>
                    <UButton
                      color="error"
                      variant="ghost"
                      icon="i-lucide-trash"
                      size="sm"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="removeExercise(category.id, exercise.id)"
                    />
                  </div>

                  <!-- Sets List -->
                  <div class="flex flex-col gap-sm pl-8">
                    <div
                      class="grid grid-cols-12 gap-2 text-[10px] font-bold text-muted uppercase tracking-wider px-2"
                    >
                      <div class="col-span-1 text-center">Set</div>
                      <div class="col-span-3">Kg</div>
                      <div class="col-span-3">Reps</div>
                      <div class="col-span-3">Rest (s)</div>
                      <div class="col-span-2 text-center">Done</div>
                    </div>

                    <div
                      v-for="(set, index) in exercise.sets"
                      :key="set.id"
                      class="grid grid-cols-12 gap-2 items-center bg-dimmed p-2 rounded-lg border border-muted relative group/set"
                    >
                      <div
                        class="col-span-1 flex items-center justify-center font-mono text-sm text-muted"
                      >
                        {{ index + 1 }}
                      </div>
                      <div class="col-span-3">
                        <UInput
                          v-model="set.kg"
                          size="xs"
                          placeholder="kg"
                          variant="soft"
                          @change="onChange"
                        >
                          <template #trailing
                            ><span class="text-muted text-[10px]">KG</span></template
                          >
                        </UInput>
                      </div>
                      <div class="col-span-3">
                        <UInput
                          v-model="set.reps"
                          size="xs"
                          placeholder="reps"
                          variant="soft"
                          @change="onChange"
                        >
                          <template #trailing
                            ><span class="text-muted text-[10px]">REPS</span></template
                          >
                        </UInput>
                      </div>
                      <div class="col-span-3">
                        <UInput
                          v-model.number="set.restTimer"
                          size="xs"
                          type="number"
                          variant="soft"
                          placeholder="60s"
                          @change="onChange"
                        >
                          <template #trailing
                            ><span class="text-muted text-[10px]">SEC</span></template
                          >
                        </UInput>
                      </div>
                      <div class="col-span-2 flex items-center justify-center relative">
                        <UCheckbox
                          :model-value="completedSets.has(set.id)"
                          @update:model-value="toggleSet(set.id, set.restTimer)"
                        />
                        <UBadge
                          v-if="timeRemaining[set.id] !== undefined"
                          color="primary"
                          variant="solid"
                          size="xs"
                          class="absolute -top-3 -right-2 z-10 shadow-lg animate-pulse"
                        >
                          {{ formatTime(timeRemaining[set.id] ?? 0) }}
                        </UBadge>
                      </div>

                      <UButton
                        icon="i-lucide-x"
                        color="error"
                        variant="ghost"
                        size="xs"
                        class="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/set:opacity-100 transition-opacity"
                        @click="removeSet(category.id, exercise.id, set.id)"
                      />
                    </div>

                    <UButton
                      icon="i-lucide-plus"
                      label="Add Set"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      @click="addSet(category.id, exercise.id)"
                    />
                  </div>
                </div>
              </template>
            </draggable>

            <div class="flex justify-start">
              <UButton
                icon="i-lucide-plus"
                size="sm"
                variant="ghost"
                color="neutral"
                label="Add Exercise"
                @click="addExercise(category.id)"
              />
            </div>
          </UCard>
        </template>
      </draggable>

      <div class="flex justify-start">
        <UButton
          icon="i-lucide-plus"
          size="sm"
          color="neutral"
          variant="soft"
          label="Add Category"
          @click="addCategory"
        />
      </div>
    </template>
  </div>
</template>
