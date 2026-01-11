<script setup lang="ts">
import type { WorkoutData } from "~~/server/db/schema/health/workout";

definePageMeta({
    layout: 'dashboard'
});

const { data: workoutData } = await useApi<WorkoutData>('/api/health/workout');

const localData = ref<WorkoutData>({
    exercises: [],
    stretches: []
});

watch(workoutData, (newVal) => {
    if (newVal) {
        const data = JSON.parse(JSON.stringify(newVal));
        // Migration: Stretches
        if (data.stretches && data.stretches.length > 0 && !data.stretches[0].items) {
            data.stretches = [{
                id: 'migrated-stretches',
                name: 'My Stretches',
                items: data.stretches
            }];
        }
        // Migration: Exercises
        if (data.exercises && data.exercises.length > 0 && !data.exercises[0].items) {
            data.exercises = [{
                id: 'migrated-exercises',
                name: 'My Exercises',
                items: data.exercises
            }];
        }
        localData.value = data;
    }
}, { immediate: true, deep: true });

// Auto-save logic
let saveTimeout: any = null;

function save() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        await $api('/api/health/workout', {
            method: 'POST',
            body: localData.value
        });
    }, 1000);
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Workout Tracker">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="workoutData" class="w-full p-sm flex flex-col gap-xl">
        <!-- Global Timer -->
        <IDPomodoroTimer />
        
        <USeparator />

        <!-- Stretches Section -->
        <IDStretchesList
            v-model="localData.stretches"
            @change="save"
        />

        <USeparator />

        <!-- Exercises Section -->
        <IDWorkoutList
            v-model="localData.exercises"
            @change="save"
        />

      </div>

      <div v-else class="flex justify-center">
          <USkeleton class="w-full h-full" />
      </div>
    </template>
  </UDashboardPanel>
</template>
