<script setup lang="ts">
import type { MeasurementsData, MeasurementValue, Measurement } from "~~/server/db/schema/health/measurements";
import { v4 as uuidv4 } from 'uuid';

definePageMeta({
    layout: 'dashboard'
});

const toast = useToast();
const { data: measurementsData, refresh } = await useApi<MeasurementsData>('/api/health/measurements');

const localData = ref<MeasurementsData>({
    measurements: []
});

watch(measurementsData, (newVal) => {
    if (newVal) {
        localData.value = JSON.parse(JSON.stringify(newVal));
    }
}, { immediate: true, deep: true });

const selectedYearIndex = ref(0);
const newYearInput = ref("");

const localYears = ref<number[]>([]);

const years = computed(() => {
    const yrs = new Set<number>();
    yrs.add(new Date().getFullYear());
    localData.value.measurements.forEach(m => {
        Object.keys(m.values).forEach(y => yrs.add(parseInt(y)));
    });
    localYears.value.forEach(y => yrs.add(y));
    return Array.from(yrs).sort((a, b) => b - a);
});

// Auto-select current year on load
watch(years, (newYears) => {
    if (newYears.length > 0) {
        const currentYearNum = new Date().getFullYear();
        const idx = newYears.indexOf(currentYearNum);
        if (idx !== -1 && selectedYearIndex.value === 0) {
            selectedYearIndex.value = idx;
        }
    }
}, { immediate: true });

const selectedYear = computed(() => years.value[selectedYearIndex.value] || new Date().getFullYear());

const yearItems = computed(() => {
  return years.value.map((y, index) => ({
    label: String(y),
    value: index
  }));
});

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const newMeasurement = ref({
    name: '',
    unit: 'kg'
});

const unitOptions = ['kg', 'cm', '%', 'lbs', 'in'];

async function addYear() {
    const year = parseInt(newYearInput.value);
    if (!year || isNaN(year)) return;

    if (!years.value.includes(year)) {
        localYears.value.push(year);
    }

    newYearInput.value = "";
    await nextTick();
    const idx = years.value.indexOf(year);
    if (idx !== -1) {
        selectedYearIndex.value = idx;
    }
}

async function addMeasurement() {
    if (!newMeasurement.value.name) return;

    const measurement: Measurement = {
        id: uuidv4(),
        name: newMeasurement.value.name,
        unit: newMeasurement.value.unit,
        values: {}
    };

    localData.value.measurements.push(measurement);
    await save();
    newMeasurement.value.name = '';
    toast.add({ title: 'Measurement added' });
}

async function removeMeasurement(id: string) {
    localData.value.measurements = localData.value.measurements.filter(m => m.id !== id);
    await save();
    toast.add({ title: 'Measurement removed' });
}

// Auto-save logic
let saveTimeout: any = null;
async function save() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        try {
            await $api('/api/health/measurements', {
                method: 'POST',
                body: localData.value
            });
        } catch (e) {
            toast.add({ title: 'Failed to save', color: 'error' });
        }
    }, 1000);
}

function getValue(measurementId: string, month: number) {
    const measurement = localData.value.measurements.find(m => m.id === measurementId);
    if (!measurement) return '';
    const yearValues = measurement.values[selectedYear.value] || [];
    const val = yearValues.find(v => v.month === month);
    return val ? val.value : '';
}

function updateValue(measurementId: string, month: number, value: string | number) {
    const measurement = localData.value.measurements.find(m => m.id === measurementId);
    if (!measurement) return;

    if (!measurement.values[selectedYear.value]) {
        measurement.values[selectedYear.value] = [];
    }

    const yearValues = measurement.values[selectedYear.value];
    if (!yearValues) return; // Should not happen due to check above but keeps TS happy

    const existingIndex = yearValues.findIndex(v => v.month === month);

    if (value === '' || value === null) {
        if (existingIndex !== -1) {
            yearValues.splice(existingIndex, 1);
        }
    } else {
        if (existingIndex !== -1) {
            const entry = yearValues[existingIndex];
            if (entry) {
                entry.value = value;
            }
        } else {
            yearValues.push({ month, value });
        }
    }
    save();
}

function getMenuItems(id: string) {
    return [
        [{
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => removeMeasurement(id)
        }]
    ];
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Measurements">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 space-y-8">
        <!-- Year Tabs and Add Year -->
        <div
          class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 justify-between"
        >
          <div class="flex-1 overflow-x-auto">
            <UTabs v-if="yearItems.length" v-model="selectedYearIndex" :items="yearItems" />
          </div>

          <div class="flex items-center gap-2">
            <UInput
              v-model="newYearInput"
              placeholder="Year (e.g. 2026)"
              type="number"
              class="w-32"
              @keyup.enter="addYear"
            />
            <UButton icon="i-lucide-plus" color="neutral" variant="ghost" @click="addYear" />
          </div>
        </div>

        <!-- Add Measurement Form -->
        <div
          class="flex items-end gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <UFormField label="New Measurement" class="flex-1">
            <UInput
              v-model="newMeasurement.name"
              placeholder="e.g. Waist, Weight, Bicep..."
              @keyup.enter="addMeasurement"
            />
          </UFormField>
          <UFormField label="Unit" class="w-32">
            <USelectMenu v-model="newMeasurement.unit" :options="unitOptions" />
          </UFormField>
          <UButton label="Add" icon="i-lucide-plus" @click="addMeasurement" color="neutral" />
        </div>

        <!-- Measurements Table -->
        <div v-if="localData.measurements.length > 0" class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-left border-b border-gray-200 dark:border-gray-800">
                <th class="py-3 pr-4 font-semibold text-sm w-40">Measurement</th>
                <th
                  v-for="month in months"
                  :key="month"
                  class="py-3 px-1 text-center font-semibold text-xs uppercase text-gray-500 w-20"
                >
                  {{ month }}
                </th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="m in localData.measurements"
                :key="m.id"
                class="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <td class="py-4 pr-4">
                  <div class="flex flex-col">
                    <span class="font-medium text-sm">{{ m.name }}</span>
                    <span class="text-xs text-gray-500">{{ m.unit }}</span>
                  </div>
                </td>
                <td v-for="(month, index) in months" :key="index" class="py-2 px-1">
                  <UInput
                    :model-value="getValue(m.id, index)"
                    @update:model-value="(val) => updateValue(m.id, index, val)"
                    type="text"
                    size="xs"
                    class="w-full text-center"
                    placeholder="-"
                  />
                </td>
                <td class="py-2 pl-2">
                  <UDropdownMenu :items="getMenuItems(m.id)">
                    <UButton
                      icon="i-lucide-ellipsis-vertical"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </UDropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else
          class="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl"
        >
          <UIcon name="i-lucide-scale" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">No measurements added yet. Start by adding one above.</p>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
