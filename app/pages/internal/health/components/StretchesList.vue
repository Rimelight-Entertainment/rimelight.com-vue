<script setup lang="ts">
import { v7 as uuidv7 } from "uuid";
import draggable from "vuedraggable";
import type { WorkoutStretchCategory } from "~~/server/db/schema/health/workout";
import { useStretches } from '~/composables/useStretches'
import { useFloatingTools } from '~/composables/useFloatingTools'

const props = defineProps<{
    modelValue: WorkoutStretchCategory[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", data: WorkoutStretchCategory[]): void;
    (e: "change"): void;
}>();

const {
  categories,
  isRunning,
  isPaused,
  currentStretchIndex,
  timeLeft,
  allStretches,
  currentStretch,
  progress,
  startRoutine,
  pauseRoutine,
  resumeRoutine,
  stopRoutine,
  formatTime
} = useStretches()

const { openTool } = useFloatingTools()

// Sync categories with props
watch(() => props.modelValue, (newVal) => {
    categories.value = newVal
}, { immediate: true, deep: true })

watch(categories, (newVal) => {
    emit("update:modelValue", newVal)
}, { deep: true })

function onChange() {
    emit("change");
}

function onStartRoutine() {
  startRoutine()
  openTool('stretches')
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

function removeCategory(catId: string) {
    categories.value = categories.value.filter(c => c.id !== catId);
    onChange();
}

function addStretch(catId: string) {
    const newCategories = [...categories.value];
    const cat = newCategories.find(c => c.id === catId);
    if (cat) {
        cat.items.push({
            id: uuidv7(),
            name: "",
            duration: 60
        });
        categories.value = newCategories;
        onChange();
    }
}

function removeStretch(catId: string, stretchId: string) {
    const newCategories = [...categories.value];
    const cat = newCategories.find(c => c.id === catId);
    if (cat) {
        cat.items = cat.items.filter(s => s.id !== stretchId);
        categories.value = newCategories;
        onChange();
    }
}
</script>

<template>
  <div class="flex flex-col gap-xl">
    <div class="flex flex-col gap-sm">
      <div class="flex items-center justify-between">
        <h3>Stretches</h3>

        <UButton
          v-if="!isRunning"
          icon="lucide:play"
          label="Start Routine"
          @click="onStartRoutine"
          :disabled="allStretches.length === 0"
        />
      </div>

      <USeparator />
    </div>

    <!-- Active Stretch Overlay/Display -->
    <div
      v-if="isRunning && currentStretch"
      class="sticky top-4 z-20 bg-elevated text-highlighted rounded-xl p-md shadow-xl"
    >
      <div class="flex items-start justify-between">
        <div class="flex flex-col gap-xs">
          <div class="text-sm">
            {{ currentStretch.categoryName }} •
            {{ currentStretchIndex + 1 }}/{{ allStretches.length }}
          </div>
          <div class="text-2xl font-bold">{{ currentStretch.name || 'Unnamed Stretch' }}</div>
          <div class="text-4xl font-mono font-semibold">{{ formatTime(timeLeft) }}</div>
        </div>

        <div class="flex flex-row gap-xs">
          <UButton
            v-if="!isPaused"
            variant="soft"
            color="warning"
            icon="lucide:pause"
            label="Pause"
            @click="pauseRoutine"
          />
          <UButton
            v-else
            variant="soft"
            color="success"
            icon="lucide:play"
            label="Resume"
            @click="resumeRoutine"
          />

          <UButton
            variant="soft"
            color="error"
            icon="lucide:square"
            label="Stop"
            @click="stopRoutine"
          />
        </div>
      </div>
    </div>

    <UEmpty
      v-if="categories.length === 0"
      title="No stretch categories found."
      description="Create one to get started."
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
                placeholder="Category Name"
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

            <!-- Items -->
            <draggable
              v-model="category.items"
              item-key="id"
              handle=".drag-handle"
              group="stretch-items"
              @end="onChange"
              class="flex flex-col gap-sm"
            >
              <template #item="{ element: stretch }">
                <div
                  class="flex items-center gap-sm p-sm group"
                  :class="[
                                      currentStretch && stretch.id === currentStretch.id
                                          ? 'bg-dimmed border-elevated'
                                          : 'bg-dimmed border-muted'
                                  ]"
                >
                  <UButton
                    size="sm"
                    variant="ghost"
                    icon="lucide:grip-vertical"
                    class="drag-handle"
                  />

                  <UInput
                    v-model="stretch.name"
                    placeholder="Stretch Name"
                    variant="none"
                    size="sm"
                    class="w-full"
                    @blur="onChange"
                    @keyup.enter="onChange"
                  />

                  <div class="w-24 flex flex-row gap-xs items-center">
                    <UInputNumber
                      v-model="stretch.duration"
                      orientation="vertical"
                      size="sm"
                      variant="soft"
                      @change="onChange"
                    />
                    <span class="text-sm text-muted">s</span>
                  </div>

                  <UButton
                    icon="i-lucide-trash"
                    color="error"
                    variant="ghost"
                    size="xs"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="removeStretch(category.id, stretch.id)"
                  />
                </div>
              </template>
            </draggable>

            <UButton
              icon="lucide:plus"
              size="sm"
              variant="ghost"
              label="Add Stretch"
              @click="addStretch(category.id)"
            />
          </UCard>
        </template>
      </draggable>

      <div class="flex justify-start">
        <UButton
          icon="lucide:plus"
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
