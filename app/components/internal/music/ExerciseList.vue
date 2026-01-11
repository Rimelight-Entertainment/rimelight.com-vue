<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import draggable from "vuedraggable";
import type { Exercise } from "~~/server/db/schema/music/music";

const props = defineProps<{
  initialData: Exercise[];
  section: "piano" | "dj" | "guitar";
}>();

const emit = defineEmits<{
  (e: "update", data: Exercise[]): void;
}>();

const exercises = ref<Exercise[]>([]);
const checkedItems = ref<Set<string>>(new Set());

// Sync prop
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        exercises.value = JSON.parse(JSON.stringify(newVal));
    }
}, { immediate: true, deep: true });

function updateParent() {
    emit("update", exercises.value);
}

function addExercise() {
    exercises.value.push({
        id: uuidv4(),
        name: "",
        bpm: 60,
        targetBpm: null
    });
    updateParent();
}

function removeExercise(id: string) {
    exercises.value = exercises.value.filter(e => e.id !== id);
    updateParent();
}

function toggleCheck(id: string) {
    if (checkedItems.value.has(id)) {
        checkedItems.value.delete(id);
    } else {
        checkedItems.value.add(id);
    }
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

     <UEmpty v-if="exercises.length === 0" title="No exercises yet." description="Add one to get started." :actions="[ { icon: 'lucide:plus', label: 'Add Exercise', onClick: addExercise }]"/>

    <template v-else>
        <UCard variant="soft" :ui="{ body: 'flex flex-col gap-md' }">
            <draggable 
                v-model="exercises" 
                item-key="id"
                handle=".drag-handle"
                :animation="200"
                @end="updateParent"
                class="flex flex-col gap-sm"
            >
                <template #item="{ element: exercise }">
                     <div class="flex items-center gap-sm p-sm group bg-dimmed border border-muted rounded-lg transition-colors">
                        <UButton size="sm" variant="ghost" icon="lucide:grip-vertical" class="drag-handle opacity-0 group-hover:opacity-100 transition-opacity" />

                        <UCheckbox 
                            :model-value="checkedItems.has(exercise.id)" 
                            @update:model-value="toggleCheck(exercise.id)"
                        />

                        <div class="flex-1">
                            <UInput 
                                v-model="exercise.name" 
                                variant="none"
                                class="w-full"
                                placeholder="Exercise Name"
                                @blur="updateParent"
                            />
                        </div>

                        <div class="flex items-center gap-sm">
                            <div class="w-24 flex flex-col gap-xs">
                                 <div class="text-[10px] text-muted uppercase font-bold px-1">Current</div>
                                 <UInput 
                                    v-model.number="exercise.bpm" 
                                    type="number"
                                    size="xs"
                                    placeholder="0"
                                     class="text-center"
                                     :ui="{ base: 'text-center' }"
                                     @blur="updateParent"
                                >
                                     <template #trailing>
                                         <span class="text-[10px] text-muted">BPM</span>
                                     </template>
                                </UInput>
                            </div>

                            <div class="w-24 flex flex-col gap-xs">
                                 <div class="text-[10px] text-muted uppercase font-bold px-1">Target</div>
                                 <UInput 
                                    v-model.number="exercise.targetBpm" 
                                    type="number"
                                    size="xs"
                                    placeholder="0"
                                     class="text-center"
                                     :ui="{ base: 'text-center' }"
                                     @blur="updateParent"
                                >
                                     <template #trailing>
                                         <span class="text-[10px] text-muted">BPM</span>
                                     </template>
                                </UInput>
                            </div>
                        </div>
                        
                        <UButton icon="i-lucide-trash" color="error" variant="ghost" size="xs" class="opacity-0 group-hover:opacity-100 transition-opacity" @click="removeExercise(exercise.id)" />
                    </div>
                </template>
            </draggable>

            <div class="flex justify-start">
               <UButton icon="i-lucide-plus" size="sm" variant="ghost" color="neutral" label="Add Exercise" @click="addExercise" />
            </div>
        </UCard>
    </template>
  </div>
</template>
