<script setup lang="ts">
import PracticeRoutine from "~/components/dashboard/music/PracticeRoutine.vue";
import ExerciseList from "~/components/dashboard/music/ExerciseList.vue";
import RepertoireList from "~/components/dashboard/music/RepertoireList.vue";
import PomodoroTimer from "~/components/dashboard/music/PomodoroTimer.vue";
import type { MusicData, RepertoireItem } from "~~/server/db/schema/music/music";

definePageMeta({
  layout: "dashboard"
});

const toast = useToast();
const { data, refresh } = await useApi<MusicData>("/api/music");

async function updateMusic(action: string, payload: any) {
    if (!data.value) return;

    if (action === 'updateRoutine') data.value.guitar.routine = payload.routine;
    if (action === 'updateExercises') data.value.guitar.exercises = payload.exercises;
    if (action === 'updateRepertoire') data.value.guitar.repertoire = payload.repertoire;
    if (action === 'updateRepertoireStates') data.value.guitar.repertoireStates = payload.states;
    if (action === 'updateRepertoireComposers') data.value.guitar.repertoireComposers = payload.composers;

    try {
        await $api("/api/music", {
            method: "POST",
            body: {
                action,
                section: "guitar",
                ...payload
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save", color: "error" });
        await refresh();
    }
}

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
      <UDashboardNavbar title="Guitar">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="data" class="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
         <PomodoroTimer />

         <USeparator />

         <PracticeRoutine 
            section="guitar"
            :initial-data="data.guitar.routine"
            @update="(routine) => updateMusic('updateRoutine', { routine })"
         />
         
         <USeparator />

         <ExerciseList 
            section="guitar"
            :initial-data="data.guitar.exercises"
            @update="(exercises) => updateMusic('updateExercises', { exercises })"
         />
         
         <USeparator />

         <RepertoireList 
            :initial-data="data.guitar.repertoire"
            :available-states="data.guitar.repertoireStates"
            :available-composers="data.guitar.repertoireComposers"
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
