<script setup lang="ts">
import PracticeRoutine from "~/components/internal/music/PracticeRoutine.vue";
import ExerciseList from "~/components/internal/music/ExerciseList.vue";
import DjMixes from "~/components/internal/music/DjMixes.vue";
import PomodoroTimer from "~/components/internal/music/PomodoroTimer.vue";
import type { MusicData } from "~~/server/db/schema/music/music";

definePageMeta({
  layout: "dashboard"
});

const toast = useToast();
const { data, refresh } = await useApi<MusicData>("/api/music");

async function updateMusic(action: string, payload: any) {
    if (!data.value) return;

    if (action === 'updateExercises') data.value.dj.exercises = payload.exercises;
    if (action === 'updateMixes') data.value.dj.mixes = payload.mixes;
    if (action === 'updateDjGenres') data.value.dj.djGenres = payload.genres;

    try {
        await $api("/api/music", {
            method: "POST",
            body: {
                action,
                section: "dj",
                ...payload
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save", color: "error" });
        await refresh();
    }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="DJ">
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
            section="dj"
            :initial-data="data.dj.routine"
            @update="(routine) => updateMusic('updateRoutine', { routine })"
         />
         
         <USeparator />

         <ExerciseList 
            section="dj"
            :initial-data="data.dj.exercises"
            @update="(exercises) => updateMusic('updateExercises', { exercises })"
         />
         
         <USeparator />

          <DjMixes 
            :initial-data="data.dj.mixes"
            :available-genres="data.dj.djGenres"
            @update="(mixes) => updateMusic('updateMixes', { mixes })"
            @update-genres="(genres) => updateMusic('updateDjGenres', { genres })"
          />
      </div>
      
      <div v-else class="flex justify-center py-12">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

    </template>
  </UDashboardPanel>
</template>
