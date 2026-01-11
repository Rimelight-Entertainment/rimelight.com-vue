<script setup lang="ts">
import { h, resolveComponent, useTemplateRef, watch, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Time } from "@internationalized/date";
import type { TableColumn, TableRow, ContextMenuItem } from "@nuxt/ui";
import { useClipboard } from '@vueuse/core';
import { useSortable } from "@vueuse/integrations/useSortable";
import type { DjMix } from "~~/server/db/schema/music/music";
import type { Column } from "@tanstack/vue-table";
import { upperFirst } from "scule";

const props = defineProps<{
  initialData: DjMix[];
  availableGenres: string[];
}>();

const emit = defineEmits<{
  (e: "update", data: DjMix[]): void;
  (e: "updateGenres", data: string[]): void;
}>();

const mixes = ref<DjMix[]>([]);
const genres = ref<string[]>([]);
const refreshKey = ref(0);
const { copy } = useClipboard();

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UIcon = resolveComponent('UIcon')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UInput = resolveComponent('UInput')
const UInputTime = resolveComponent('UInputTime')
const USelectMenu = resolveComponent('USelectMenu')
const UBadge = resolveComponent('UBadge')

watch(() => props.availableGenres, (newVal) => {
    if (newVal) genres.value = [...newVal];
}, { immediate: true });

// Sync prop
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        const newData = JSON.parse(JSON.stringify(newVal));
        if (JSON.stringify(newData) !== JSON.stringify(mixes.value)) {
            mixes.value = newData;
        }
    }
}, { immediate: true });

function updateParent() {
    refreshKey.value++;
    emit("update", mixes.value);
}

function addMix() {
    mixes.value.push({
        id: uuidv4(),
        name: "",
        duration: "00:00:00",
        genre: "",
        description: ""
    });
    updateParent();
}

function removeMix(id: string) {
    mixes.value = mixes.value.filter(m => m.id !== id);
    updateParent();
}

function deleteSelected() {
    const selectedRows = table.value?.tableApi.getSelectedRowModel().rows || [];
    const selectedIds = selectedRows.map((r: any) => r.original.id);
    mixes.value = mixes.value.filter(item => !selectedIds.includes(item.id));
    rowSelection.value = {};
    updateParent();
}

function onCreateGenre(newGenre: string, mix: DjMix) {
    genres.value.push(newGenre);
    emit("updateGenres", genres.value);
    mix.genre = newGenre;
    updateParent();
}

/**
 * Time Helpers for duration string <-> Time object
 */
function getDurationTime(duration: string) {
    try {
        const p = duration.split(':').map(Number);
        if (p.length === 3) return new Time(p[0], p[1], p[2]);
        if (p.length === 2) return new Time(p[0], p[1]);
        return new Time(0, 0);
    } catch {
        return new Time(0, 0);
    }
}

function updateDuration(time: any, mix: DjMix) {
    if (!time) return;
    const h = String(time.hour).padStart(2, '0');
    const m = String(time.minute).padStart(2, '0');
    const s = String(time.second || 0).padStart(2, '0');
    mix.duration = `${h}:${m}:${s}`;
    updateParent();
}

/**
 * Advanced Sorting Header with Dropdown
 */
function getHeader(column: Column<DjMix, any>, label: string, align: 'left' | 'right' = 'left') {
  const isSorted = column.getIsSorted()

  return h(UDropdownMenu, {
    content: { align: 'start' },
    'aria-label': `${label} sorting`,
    items: [
      {
        label: 'Asc',
        type: 'checkbox',
        icon: 'i-lucide-arrow-up-narrow-wide',
        checked: isSorted === 'asc',
        onSelect: () => isSorted === 'asc' ? column.clearSorting() : column.toggleSorting(false)
      },
      {
        label: 'Desc',
        icon: 'i-lucide-arrow-down-wide-narrow',
        type: 'checkbox',
        checked: isSorted === 'desc',
        onSelect: () => isSorted === 'desc' ? column.clearSorting() : column.toggleSorting(true)
      }
    ]
  }, () => h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
    class: [
        '-ml-2 data-[state=open]:bg-elevated/50 w-full justify-start',
        align === 'right' ? 'flex-row' : ''
    ],
    'aria-label': `Sort by ${label}`
  }))
}

const columns: TableColumn<DjMix>[] = [
  {
    id: 'drag',
    header: '',
    cell: () => h('div', { class: 'drag-handle cursor-move opacity-30 group-hover:opacity-100 transition-opacity flex justify-center' }, [
        h(UIcon, { name: 'i-lucide-grip-vertical', class: 'w-4 h-4 text-gray-400' })
    ]),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'ariaLabel': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  { 
    accessorKey: 'name', 
    header: ({ column }) => getHeader(column as any, 'Mix Name'),
    size: 250
  },
  { 
    accessorKey: 'genre', 
    header: ({ column }) => getHeader(column as any, 'Genre'),
    size: 180
  },
  { 
    accessorKey: 'duration', 
    header: ({ column }) => getHeader(column as any, 'Duration'),
    size: 150
  },
  { 
    accessorKey: 'description', 
    header: ({ column }) => getHeader(column as any, 'Description'),
    size: 400
  },
  { 
    id: 'actions', 
    header: '',
    enableHiding: false,
    size: 40
  }
]

const sorting = ref([]);
const globalFilter = ref("");
const columnVisibility = ref({});
const rowSelection = ref({});
const columnPinning = ref({});
const expanded = ref({});

const table = useTemplateRef('table')

/**
 * Context Menu 
 */
function onContextMenu(event: MouseEvent, row: TableRow<DjMix>) {
    const mix = row.original;
    contextMenuItems.value = [
        { label: mix.name || 'Untitled Mix', type: 'label' },
        { type: 'separator' },
        { label: 'Copy Name', icon: 'i-lucide-copy', onSelect: () => copy(mix.name) },
        { label: 'Copy Duration', icon: 'i-lucide-clock', onSelect: () => copy(mix.duration) },
        { type: 'separator' },
        { label: 'Delete Mix', icon: 'i-lucide-trash', color: 'error', onSelect: () => removeMix(mix.id) }
    ];
}

const contextMenuItems = ref<ContextMenuItem[]>([]);

// Drag and drop integration
useSortable('.mixes-table-tbody', mixes, {
  handle: '.drag-handle',
  animation: 200,
  onEnd: () => {
    updateParent();
  }
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Mixes</h3>
    </div>

    <div class="flex flex-col flex-1 divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
      <!-- Top Bar -->
      <div class="flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20">
          <UDropdownMenu
              :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
                label: upperFirst(column.id),
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked: (val: boolean) => column.toggleVisibility(val),
                onSelect: (e: Event) => e.preventDefault()
              }))"
              :content="{ align: 'start' }"
          >
              <UButton
                label="Columns"
                color="neutral"
                variant="outline"
                size="sm"
                trailing-icon="i-lucide-chevron-down"
              />
          </UDropdownMenu>

          <UInput 
              v-model="globalFilter" 
              icon="i-lucide-search" 
              placeholder="Filter mixes..." 
              class="flex-1 max-w-sm"
              size="sm"
              variant="subtle"
          />
        
        <div class="flex items-center gap-2 ml-auto">
             <UButton 
                v-if="Object.keys(rowSelection).length > 0"
                icon="i-lucide-trash" 
                size="sm" 
                color="error" 
                variant="subtle"
                :label="`Delete Selected (${Object.keys(rowSelection).length})`" 
                @click="deleteSelected" 
            />
            
            <UButton icon="i-lucide-plus" size="sm" color="primary" label="Add Mix" @click="addMix" />
        </div>
    </div>

    <!-- Table Container -->
    <UContextMenu :items="contextMenuItems" class="flex-1">
        <UTable 
            ref="table"
            :key="refreshKey"
            v-model:sorting="sorting"
            v-model:global-filter="globalFilter"
            v-model:column-visibility="columnVisibility"
            v-model:row-selection="rowSelection"
            v-model:column-pinning="columnPinning"
            v-model:expanded="expanded"
            :data="mixes" 
            :columns="columns" 
            sticky
            class="max-h-[600px] overflow-auto"
            :ui="{ 
                tbody: 'mixes-table-tbody',
                tr: 'group transition-colors data-[selected=true]:bg-gray-100/50 dark:data-[selected=true]:bg-gray-800/50',
                td: 'py-2 px-4 h-12'
            }"
            @row-contextmenu="onContextMenu"
        >
            <!-- Mix Name -->
            <template #name-cell="{ row }">
                <UInput 
                    v-model="row.original.name" 
                    variant="none" 
                    class="w-full -ml-2 font-bold text-gray-900 dark:text-white"
                    placeholder="Mix Name" 
                    @blur="updateParent" 
                />
            </template>

            <!-- Genre -->
            <template #genre-cell="{ row }">
                <USelectMenu 
                    v-model="row.original.genre" 
                    :items="genres"
                    size="xs"
                    class="w-full -ml-2"
                    searchable
                    create-item
                    variant="none"
                    placeholder="Genre"
                    @change="updateParent"
                    @create="(val: string) => onCreateGenre(val, row.original)" 
                />
            </template>

            <!-- Duration -->
            <template #duration-cell="{ row }">
                <div class="flex items-center gap-1.5 -ml-1">
                    <UInputTime 
                        :model-value="getDurationTime(row.original.duration)" 
                        size="xs" 
                        variant="none"
                        class="w-28"
                        :hour-cycle="24"
                        granularity="second"
                        @update:model-value="(val: any) => updateDuration(val, row.original)"
                    />
                </div>
            </template>

            <!-- Description -->
            <template #description-cell="{ row }">
                <UInput 
                    v-model="row.original.description" 
                    variant="none" 
                    class="w-full -ml-2 text-sm text-gray-500"
                    placeholder="Notes..." 
                    @blur="updateParent" 
                />
            </template>

            <!-- Actions -->
            <template #actions-cell="{ row }">
                <UDropdownMenu
                    :items="[
                        [{ label: 'Copy Name', icon: 'i-lucide-copy', onSelect: () => copy(row.original.name) }],
                        [{ label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => removeMix(row.original.id) }]
                    ]"
                    :content="{ align: 'end' }"
                >
                    <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
                </UDropdownMenu>
            </template>

            <template #empty>
                <div class="flex flex-col items-center justify-center py-16 gap-3">
                    <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center ring-8 ring-gray-100 dark:ring-gray-950">
                        <UIcon name="i-lucide-music" class="w-6 h-6 text-gray-300 dark:text-gray-700" />
                    </div>
                    <p class="text-gray-400 text-sm mt-4 italic text-center">No mixes found matching your criteria</p>
                    <UButton v-if="globalFilter" label="Clear Filters" variant="soft" color="neutral" size="xs" @click="globalFilter = ''" />
                </div>
            </template>
        </UTable>
    </UContextMenu>

    <!-- Bottom Summary Bar -->
    <div class="flex items-center justify-between px-4 py-3 text-[11px] font-medium text-gray-400 bg-gray-50/50 dark:bg-gray-800/20 uppercase tracking-widest">
        <div v-if="Object.keys(rowSelection).length > 0" class="flex items-center gap-1 text-primary-500">
            <UIcon name="i-lucide-check-circle-2" class="w-3.5 h-3.5" />
            <span>{{ Object.keys(rowSelection).length }} Item(s) Selected</span>
        </div>
        <div v-else></div>
        
        <div class="flex items-center gap-4">
            <span>{{ mixes.length }} Total Mixes</span>
        </div>
    </div>
    </div>
  </div>
</template>
