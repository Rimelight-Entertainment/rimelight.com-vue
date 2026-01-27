<script setup lang="ts">
import PracticeRoutine from "~/components/dashboard/music/PracticeRoutine.vue";
import ExerciseList from "~/components/dashboard/music/ExerciseList.vue";
import RepertoireList from "~/components/dashboard/music/RepertoireList.vue";
import DjMixes from "~/components/dashboard/music/DjMixes.vue";
import type { MusicData, RoutineCategory, Exercise, RepertoireItem, DjMix } from "~~/server/db/schema/music/music";

definePageMeta({
  layout: "dashboard"
});

const toast = useToast();

const items = [{
  label: 'Piano',
  icon: 'i-lucide-piano',
  slot: 'piano'
}, {
  label: 'Guitar',
  icon: 'i-lucide-guitar',
  slot: 'guitar'
}, {
  label: 'DJ',
  icon: 'i-lucide-disc',
  slot: 'dj'
}];

const route = useRoute();
const router = useRouter();

const selectedTab = computed({
  get() {
    const index = items.findIndex((item) => item.label === route.query.tab);
    if (index === -1) {
      return 0;
    }
    return index;
  },
  set(value) {
    // Hash is sticky, but we can update query param for tab
    const item = items[value];
    if (item) {
      router.replace({ query: { tab: item.label } });
    }
  }
});


const { data, refresh } = await useApi<MusicData>("/api/music");

// --- API Actions ---

async function updateRoutine(section: "piano" | "dj" | "guitar", routine: RoutineCategory[]) {
    if (!data.value) return;
    
    // Optimistic Update
    data.value[section].routine = routine;

    try {
        await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateRoutine",
                section,
                routine
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save routine", color: "error" });
        await refresh();
    }
}

async function updateExercises(section: "piano" | "dj" | "guitar", exercises: Exercise[]) {
    if (!data.value) return;
    
    data.value[section].exercises = exercises;

    try {
         await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateExercises",
                section,
                exercises
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save exercises", color: "error" });
         await refresh();
    }
}

async function updateRepertoire(section: "piano" | "guitar", repertoire: RepertoireItem[]) {
    if (!data.value) return;
    
    data.value[section].repertoire = repertoire;

    try {
         await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateRepertoire",
                section,
                repertoire
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save repertoire", color: "error" });
         await refresh();
    }
}

async function updateRepertoireStates(section: "piano" | "guitar", states: string[]) {
    if (!data.value) return;
    
    data.value[section].repertoireStates = states;

    try {
         await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateRepertoireStates",
                section,
                states
            }
        });
        toast.add({ title: "Status added" });
    } catch (e) {
         toast.add({ title: "Failed to save status", color: "error" });
         await refresh();
    }
}

async function updateMixes(mixes: DjMix[]) {
    if (!data.value) return;
    
    data.value.dj.mixes = mixes;

     try {
         await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateMixes",
                mixes
            }
        });
    } catch (e) {
        toast.add({ title: "Failed to save mixes", color: "error" });
         await refresh();
    }
}

async function updateDjGenres(genres: string[]) {
    if (!data.value) return;
    
    data.value.dj.djGenres = genres;

     try {
         await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateDjGenres",
                genres
            }
        });
        toast.add({ title: "Genre added" });
    } catch (e) {
        toast.add({ title: "Failed to save genre", color: "error" });
         await refresh();
    }
}

async function updateRepertoireComposers(section: "piano" | "guitar", composers: string[]) {
    if (!data.value) return;
    
    data.value[section].repertoireComposers = composers;

    try {
         await $api("/api/music", {
            method: "POST",
            body: {
                action: "updateRepertoireComposers",
                section,
                composers
            }
        });
        toast.add({ title: "Composer added" });
    } catch (e) {
         toast.add({ title: "Failed to save composer", color: "error" });
         await refresh();
    }
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Music">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="data" class="max-w-4xl mx-auto w-full">
         <UTabs v-model="selectedTab" :items="items" class="w-full mb-6">
             <!-- Piano Tab -->
             <template #piano>
                 <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <!-- Routine -->
                     <PracticeRoutine 
                        section="piano"
                        :initial-data="data.piano.routine"
                        @update="(d) => updateRoutine('piano', d)"
                     />
                     
                     <USeparator />

                     <!-- Exercises -->
                     <ExerciseList 
                        section="piano"
                        :initial-data="data.piano.exercises"
                        @update="(d) => updateExercises('piano', d)"
                     />
                     
                     <USeparator />

                     <!-- Repertoire -->
                     <RepertoireList 
                        :initial-data="data.piano.repertoire"
                        :available-states="data.piano.repertoireStates"
                        :available-composers="data.piano.repertoireComposers"
                        @update="(d) => updateRepertoire('piano', d)"
                        @update-states="(s) => updateRepertoireStates('piano', s)"
                        @update-composers="(c) => updateRepertoireComposers('piano', c)"
                     />
                 </div>
             </template>

             <!-- Guitar Tab -->
             <template #guitar>
                 <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <!-- Routine -->
                     <PracticeRoutine 
                        section="guitar"
                        :initial-data="data.guitar.routine"
                        @update="(d) => updateRoutine('guitar', d)"
                     />
                     
                     <USeparator />

                     <!-- Exercises -->
                     <ExerciseList 
                        section="guitar"
                        :initial-data="data.guitar.exercises"
                        @update="(d) => updateExercises('guitar', d)"
                     />
                     
                     <USeparator />

                     <!-- Repertoire -->
                     <RepertoireList 
                        :initial-data="data.guitar.repertoire"
                        :available-states="data.guitar.repertoireStates"
                        :available-composers="data.guitar.repertoireComposers"
                        @update="(d) => updateRepertoire('guitar', d)"
                        @update-states="(s) => updateRepertoireStates('guitar', s)"
                        @update-composers="(c) => updateRepertoireComposers('guitar', c)"
                     />
                 </div>
             </template>

             <!-- DJ Tab -->
             <template #dj>
                <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <!-- Routine -->
                     <PracticeRoutine 
                        section="dj"
                        :initial-data="data.dj.routine"
                        @update="(d) => updateRoutine('dj', d)"
                     />
                     
                     <USeparator />

                     <!-- Exercises -->
                     <ExerciseList 
                        section="dj"
                        :initial-data="data.dj.exercises"
                        @update="(d) => updateExercises('dj', d)"
                     />
                     
                     <USeparator />

                     <!-- Mixes -->
                     <DjMixes 
                        :initial-data="data.dj.mixes"
                        :available-genres="data.dj.djGenres"
                        @update="updateMixes"
                        @update-genres="updateDjGenres"
                     />
                 </div>
             </template>
         </UTabs>
      </div>
      
      <div v-else class="flex justify-center py-12">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

    </template>
  </UDashboardPanel>
</template>
