<script setup lang="ts">
import PracticeRoutine from "~/components/internal/music/PracticeRoutine.vue";
import ExerciseList from "~/components/internal/music/ExerciseList.vue";
import RepertoireList from "~/components/internal/music/RepertoireList.vue";
import PomodoroTimer from "~/components/internal/music/PomodoroTimer.vue";
import type { MusicData, RepertoireItem } from "~~/server/db/schema/music/music";

definePageMeta({
  layout: "dashboard"
});

const toast = useToast();
const { data, refresh } = await useApi<MusicData>("/api/music");

// --- API Actions ---

// We use a simple lock or queue to prevent concurrent updates from overwriting each other
// since the backend uses a read-modify-write pattern on the JSONB column.
let isUpdating = false;

async function updateMusic(action: string, payload: any) {
    if (!data.value) return;

    // Apply change locally (Optimistic)
    if (action === 'updateRoutine') data.value.piano.routine = payload.routine;
    if (action === 'updateExercises') data.value.piano.exercises = payload.exercises;
    if (action === 'updateRepertoire') data.value.piano.repertoire = payload.repertoire;
    if (action === 'updateRepertoireStates') data.value.piano.repertoireStates = payload.states;
    if (action === 'updateRepertoireComposers') data.value.piano.repertoireComposers = payload.composers;

    try {
        await $api("/api/music", {
            method: "POST",
            body: {
                action,
                section: "piano",
                ...payload
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save", color: "error" });
        await refresh();
    }
}

// Special handler for cases where multiple things change (like creating a status)
async function handleRepertoireUpdate(repertoire: RepertoireItem[]) {
    await updateMusic('updateRepertoire', { repertoire });
}

async function handleStatesUpdate(states: string[]) {
    await updateMusic('updateRepertoireStates', { states });
}

async function handleComposersUpdate(composers: string[]) {
    await updateMusic('updateRepertoireComposers', { composers });
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Piano">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="data" class="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
         <PomodoroTimer />

         <USeparator />

         <!-- Routine -->
         <PracticeRoutine 
            section="piano"
            :initial-data="data.piano.routine"
            @update="(routine) => updateMusic('updateRoutine', { routine })"
         />
         
         <USeparator />

         <!-- Exercises -->
         <ExerciseList 
            section="piano"
            :initial-data="data.piano.exercises"
            @update="(exercises) => updateMusic('updateExercises', { exercises })"
         />
         
         <USeparator />

         <!-- Repertoire -->
         <RepertoireList 
            :initial-data="data.piano.repertoire"
            :available-states="data.piano.repertoireStates"
            :available-composers="data.piano.repertoireComposers"
            @update="handleRepertoireUpdate"
            @update-states="handleStatesUpdate"
            @update-composers="handleComposersUpdate"
         />
      </div>
      
      <div v-else class="flex justify-center py-12">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

    </template>
  </UDashboardPanel>
</template>
