<script setup lang="ts">
import type { PetsData, Pet, PetHistoryEntry, PetHistoryType } from "~~/server/db/schema"
import { format, parseISO } from "date-fns";
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'

definePageMeta({
    layout: "dashboard"
});

const toast = useToast();
const { data: tracker, refresh } = await useApi<PetsData>("/api/pets");


// --- State ---
const isPetModalOpen = ref(false);
const isHistoryModalOpen = ref(false);
const petState = ref<Partial<Pet>>({});
const historyState = ref<Partial<PetHistoryEntry>>({});
const selectedPetId = ref<string | null>(null);
const isEditing = ref(false);

const dobDate = ref<any>(null);
const adoptionDate = ref<any>(null);
const historyDate = ref<any>(null);

const dobInput = useTemplateRef('dobInput');
const adoptionInput = useTemplateRef('adoptionInput');
const historyInput = useTemplateRef('historyInput');

const historyTypes: { label: string, value: PetHistoryType }[] = [
    { label: 'Vet Visit', value: 'vet' },
    { label: 'Vaccine', value: 'vaccine' },
    { label: 'Medication', value: 'medication' },
    { label: 'Other', value: 'other' },
];

watch(dobDate, (newVal) => {
    if (newVal) petState.value.dateOfBirth = newVal.toString();
});

watch(adoptionDate, (newVal) => {
    if (newVal) petState.value.adoptionDate = newVal.toString();
});

watch(historyDate, (newVal) => {
    if (newVal) historyState.value.date = newVal.toString();
});

// --- Actions ---

function openAddPetModal() {
    const today = new Date();
    petState.value = {
        name: '',
        species: '',
        breed: '',
        dateOfBirth: format(today, 'yyyy-MM-dd'),
        adoptionDate: format(today, 'yyyy-MM-dd'),
        weight: undefined,
        weightUnit: 'kg',
        microchipId: '',
    };
    dobDate.value = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    adoptionDate.value = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    isEditing.value = false;
    isPetModalOpen.value = true;
}

function openEditPetModal(pet: Pet) {
    petState.value = { ...pet };
    if (pet.dateOfBirth) {
        const d = parseISO(pet.dateOfBirth);
        dobDate.value = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    } else {
        dobDate.value = null;
    }
    if (pet.adoptionDate) {
        const d = parseISO(pet.adoptionDate);
        adoptionDate.value = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    } else {
        adoptionDate.value = null;
    }
    isEditing.value = true;
    isPetModalOpen.value = true;
}

async function savePet() {
    try {
        if (isEditing.value && petState.value.id) {
            await $api("/api/pets", {
                method: "POST",
                body: {
                    action: "updatePet",
                    petId: petState.value.id,
                    pet: petState.value
                }
            });
            toast.add({ title: "Pet updated" });
        } else {
            await $api("/api/pets", {
                method: "POST",
                body: {
                    action: "addPet",
                    pet: petState.value
                }
            });
            toast.add({ title: "Pet added", color: "success" });
        }
        await refresh();
        isPetModalOpen.value = false;
    } catch (e) {
        toast.add({ title: "Failed to save pet", color: "error" });
    }
}

async function deletePet(petId: string) {
    if (!confirm("Are you sure you want to delete this pet?")) return;
    try {
        await $api("/api/pets", {
            method: "POST",
            body: { action: "deletePet", petId }
        });
        await refresh();
        toast.add({ title: "Pet deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete pet", color: "error" });
    }
}

function openAddHistoryModal(petId: string) {
    const today = new Date();
    selectedPetId.value = petId;
    historyState.value = {
        date: format(today, 'yyyy-MM-dd'),
        type: 'vet',
        title: '',
        notes: ''
    };
    historyDate.value = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    isHistoryModalOpen.value = true;
}

async function saveHistory() {
    if (!selectedPetId.value) return;
    try {
        await $api("/api/pets", {
            method: "POST",
            body: {
                action: "addHistoryEntry",
                petId: selectedPetId.value,
                entry: historyState.value
            }
        });
        await refresh();
        toast.add({ title: "History entry added", color: "success" });
        isHistoryModalOpen.value = false;
    } catch (e) {
        toast.add({ title: "Failed to add history entry", color: "error" });
    }
}

async function deleteHistoryEntry(petId: string, entryId: string) {
    try {
        await $api("/api/pets", {
            method: "POST",
            body: { action: "deleteHistoryEntry", petId, entryId }
        });
        await refresh();
        toast.add({ title: "History entry deleted" });
    } catch (e) {
        toast.add({ title: "Failed to delete history entry", color: "error" });
    }
}

function getPetMenuItems(pet: Pet) {
    return [
        [{
            label: 'Edit Pet',
            icon: 'i-lucide-pencil',
            onSelect: () => openEditPetModal(pet)
        }, {
            label: 'Add History',
            icon: 'i-lucide-plus',
            onSelect: () => openAddHistoryModal(pet.id)
        }],
        [{
            label: 'Delete Pet',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deletePet(pet.id)
        }]
    ];
}

function getHistoryMenuItems(petId: string, entryId: string) {
    return [
        [{
            label: 'Delete Entry',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            onSelect: () => deleteHistoryEntry(petId, entryId)
        }]
    ];
}

function getHistoryIcon(type: PetHistoryType) {
    switch (type) {
        case 'vet': return 'i-lucide-stethoscope';
        case 'vaccine': return 'i-lucide-syringe';
        case 'medication': return 'i-lucide-pill';
        default: return 'i-lucide-clipboard-list';
    }
}
</script>

<template>
  <UDashboardPage id="housing-pets">
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Pets">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #right>
            <UButton label="Add Pet" icon="i-lucide-plus" @click="openAddPetModal" />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="p-4">
          <div
            v-if="!tracker?.pets?.length"
            class="flex flex-col items-center justify-center min-h-64 text-gray-500"
          >
            <UIcon name="i-lucide-dog" class="w-12 h-12 mb-4" />
            <p>No pets tracked yet. Add your first pet!</p>
            <UButton label="Add Pet" variant="ghost" class="mt-2" @click="openAddPetModal" />
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard v-for="pet in tracker.pets" :key="pet.id" class="flex flex-col">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UAvatar :alt="pet.name" size="lg" />
                    <div>
                      <h3 class="font-bold text-lg leading-tight">{{ pet.name }}</h3>
                      <p class="text-sm text-gray-500">
                        {{ pet.species }}<span v-if="pet.breed"> • {{ pet.breed }}</span>
                      </p>
                    </div>
                  </div>
                  <UDropdownMenu :items="getPetMenuItems(pet)">
                    <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
                  </UDropdownMenu>
                </div>
              </template>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div v-if="pet.dateOfBirth">
                    <span class="text-gray-500 block">Birthday</span>
                    <span>{{ pet.dateOfBirth }}</span>
                  </div>
                  <div v-if="pet.adoptionDate">
                    <span class="text-gray-500 block">Adoption Date</span>
                    <span>{{ pet.adoptionDate }}</span>
                  </div>
                  <div v-if="pet.weight">
                    <span class="text-gray-500 block">Weight</span>
                    <span>{{ pet.weight }} {{ pet.weightUnit }}</span>
                  </div>
                  <div v-if="pet.microchipId" class="col-span-2">
                    <span class="text-gray-500 block">Microchip ID</span>
                    <code
                      class="bg-gray-100 dark:bg-gray-800 px-1 rounded"
                      >{{ pet.microchipId }}</code
                    >
                  </div>
                </div>

                <UDivider label="History" />

                <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <div v-if="!pet.history.length" class="text-center text-sm text-gray-500 py-2">
                    No history entries yet.
                  </div>
                  <div
                    v-for="entry in pet.history"
                    :key="entry.id"
                    class="flex gap-3 text-sm group"
                  >
                    <UIcon :name="getHistoryIcon(entry.type)" class="w-5 h-5 mt-0.5 text-primary" />
                    <div class="flex-grow">
                      <div class="flex justify-between items-start">
                        <span class="font-medium">{{ entry.title }}</span>
                        <span class="text-xs text-gray-400">{{ entry.date }}</span>
                      </div>
                      <p v-if="entry.notes" class="text-gray-500 text-xs">{{ entry.notes }}</p>
                    </div>
                    <UDropdownMenu :items="getHistoryMenuItems(pet.id, entry.id)">
                      <UButton
                        icon="i-lucide-ellipsis-vertical"
                        variant="ghost"
                        color="neutral"
                        size="xs"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </UDropdownMenu>
                  </div>
                </div>
              </div>

              <template #footer>
                <UButton
                  label="Add History Entry"
                  variant="ghost"
                  block
                  icon="i-lucide-plus"
                  @click="openAddHistoryModal(pet.id)"
                />
              </template>
            </UCard>
          </div>
        </div>
      </template>
    </UDashboardPanel>

    <!-- Pet Modal -->
    <UModal v-model:open="isPetModalOpen" :title="isEditing ? 'Edit Pet' : 'Add Pet'">
      <template #body>
        <div class="p-4">
          <UForm :state="petState" @submit="savePet" class="space-y-4">
            <UFormField label="Name" name="name" required>
              <UInput v-model="petState.name" placeholder="Buddy" />
            </UFormField>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Species" name="species" required>
                <UInput v-model="petState.species" placeholder="Dog" />
              </UFormField>
              <UFormField label="Breed" name="breed">
                <UInput v-model="petState.breed" placeholder="Golden Retriever" />
              </UFormField>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Date of Birth" name="dateOfBirth">
                <UInputDate
                  ref="dobInput"
                  :model-value="dobDate as any"
                  @update:model-value="dobDate = $event"
                  format="dd/MM/yyyy"
                  class="w-full"
                >
                  <template #trailing>
                    <UPopover :reference="dobInput?.inputsRef[3]?.$el">
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-calendar"
                        aria-label="Select a date"
                        class="px-0"
                      />
                      <template #content>
                        <UCalendar
                          :model-value="dobDate as any"
                          @update:model-value="dobDate = $event"
                          class="p-2"
                        />
                      </template>
                    </UPopover>
                  </template>
                </UInputDate>
              </UFormField>
              <UFormField label="Adoption Date" name="adoptionDate">
                <UInputDate
                  ref="adoptionInput"
                  :model-value="adoptionDate as any"
                  @update:model-value="adoptionDate = $event"
                  format="dd/MM/yyyy"
                  class="w-full"
                >
                  <template #trailing>
                    <UPopover :reference="adoptionInput?.inputsRef[3]?.$el">
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-calendar"
                        aria-label="Select a date"
                        class="px-0"
                      />
                      <template #content>
                        <UCalendar
                          :model-value="adoptionDate as any"
                          @update:model-value="adoptionDate = $event"
                          class="p-2"
                        />
                      </template>
                    </UPopover>
                  </template>
                </UInputDate>
              </UFormField>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Weight" name="weight">
                <UInput v-model.number="petState.weight" type="number" step="0.1" />
              </UFormField>
              <UFormField label="Unit" name="weightUnit">
                <USelectMenu v-model="petState.weightUnit" :items="['kg', 'lb']" class="w-full" />
              </UFormField>
            </div>
            <UFormField label="Microchip ID" name="microchipId">
              <UInput v-model="petState.microchipId" placeholder="123456789..." />
            </UFormField>

            <div class="flex justify-end gap-3 mt-10">
              <UButton
                color="neutral"
                variant="ghost"
                label="Cancel"
                @click="isPetModalOpen = false"
              />
              <UButton
                type="submit"
                color="primary"
                :label="isEditing ? 'Update Pet' : 'Save Pet'"
              />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- History Modal -->
    <UModal v-model:open="isHistoryModalOpen" title="Add History Entry">
      <template #body>
        <div class="p-4">
          <UForm :state="historyState" @submit="saveHistory" class="space-y-4">
            <UFormField label="Date" name="date" required>
              <UInputDate
                ref="historyInput"
                :model-value="historyDate as any"
                @update:model-value="historyDate = $event"
                format="dd/MM/yyyy"
                class="w-full"
              >
                <template #trailing>
                  <UPopover :reference="historyInput?.inputsRef[3]?.$el">
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      icon="i-lucide-calendar"
                      aria-label="Select a date"
                      class="px-0"
                    />
                    <template #content>
                      <UCalendar
                        :model-value="historyDate as any"
                        @update:model-value="historyDate = $event"
                        class="p-2"
                      />
                    </template>
                  </UPopover>
                </template>
              </UInputDate>
            </UFormField>
            <UFormField label="Type" name="type" required>
              <USelectMenu
                v-model="historyState.type as any"
                :items="historyTypes"
                value-attribute="value"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Title" name="title" required>
              <UInput v-model="historyState.title" placeholder="Annual Checkup" />
            </UFormField>
            <UFormField label="Notes" name="notes">
              <UTextarea v-model="historyState.notes" placeholder="Details about the visit..." />
            </UFormField>

            <div class="flex justify-end gap-3 mt-10">
              <UButton
                color="neutral"
                variant="ghost"
                label="Cancel"
                @click="isHistoryModalOpen = false"
              />
              <UButton type="submit" color="primary" label="Add Entry" />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </UDashboardPage>
</template>

<style scoped></style>
