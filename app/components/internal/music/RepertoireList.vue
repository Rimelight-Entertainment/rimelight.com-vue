<script setup lang="ts">
import { h, resolveComponent, useTemplateRef, watch, ref, triggerRef, computed } from "vue";
import { useClipboard } from '@vueuse/core';
import { v4 as uuidv4 } from "uuid";
import type { TableColumn, TableRow, ContextMenuItem } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";
import { useSortable } from "@vueuse/integrations/useSortable";
import { upperFirst } from 'scule';
import type { RepertoireItem } from "~~/server/db/schema/music/music";

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UInput = resolveComponent('UInput')
const USelectMenu = resolveComponent('USelectMenu')
const USelect = resolveComponent('USelect')

const toast = useToast()

const props = defineProps<{
  initialData: RepertoireItem[];
  availableStates: string[];
  availableComposers: string[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "update", data: RepertoireItem[]): void;
  (e: "updateStates", states: string[]): void;
  (e: "updateComposers", composers: string[]): void;
}>();

const repertoire = ref<RepertoireItem[]>([]);
const globalFilter = ref("");
const sorting = ref([{ id: 'title', desc: false }]);
const columnVisibility = ref({});
const rowSelection = ref({});
const columnPinning = ref({ left: ['select', 'expand', 'drag'] });
const expanded = ref<Record<string, boolean>>({});
const contextMenuItems = ref<ContextMenuItem[]>([]);
const table = useTemplateRef('table')
const { copy } = useClipboard();
const refreshKey = ref(0);

// Local state for states to allow immediate UI update
const repertoireStates = ref<string[]>([]);
watch(() => props.availableStates, (newVal) => {
    repertoireStates.value = [...newVal];
}, { immediate: true });

const repertoireComposers = ref<string[]>([]);
watch(() => props.availableComposers, (newVal) => {
    repertoireComposers.value = [...newVal || []];
}, { immediate: true });

// Sync prop
// Sync prop only when it actually changes from the outside
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        const newData = JSON.parse(JSON.stringify(newVal));
        // Simple comparison to avoid unnecessary resets
        if (JSON.stringify(newData) !== JSON.stringify(repertoire.value)) {
            repertoire.value = newData;
        }
    }
}, { immediate: true });

function updateParent() {
    refreshKey.value++;
    emit("update", repertoire.value);
}

function addItem() {
    const newItem: RepertoireItem = {
        id: uuidv4(),
        title: "New Piece",
        status: props.availableStates[0] || "New",
        difficulty: 1,
    };
    repertoire.value = [...repertoire.value, newItem];
    triggerRef(repertoire);
    updateParent();
}

function removeItem(id: string) {
    repertoire.value = repertoire.value.filter(i => i.id !== id);
    triggerRef(repertoire);
    updateParent();
}

function deleteSelected() {
    const selectedRows = table.value?.tableApi?.getFilteredSelectedRowModel().rows || [];
    const selectedIds = selectedRows.map((r: any) => r.original.id);
    repertoire.value = repertoire.value.filter(item => !selectedIds.includes(item.id));
    rowSelection.value = {};
    triggerRef(repertoire);
    updateParent();
}

function onCreateStatus(newItem: string, item: RepertoireItem) {
    repertoireStates.value.push(newItem);
    emit("updateStates", repertoireStates.value);
    item.status = newItem;
    updateParent();
}

function onCreateComposer(newItem: string, item: RepertoireItem) {
    repertoireComposers.value.push(newItem);
    emit("updateComposers", repertoireComposers.value);
    item.composer = newItem;
    updateParent();
}

/**
 * File Helpers
 */
function getFilesFromItem(item: RepertoireItem): File[] {
    if (!item.attachments || item.attachments.length === 0) return [];
    
    return item.attachments.map(att => ({
        name: att.name,
        size: att.size || 0,
        type: att.type || 'application/pdf',
        lastModified: Date.now(),
        // We store the ID or URL in a custom property if needed, 
        // but for display purposes name/size/type are enough
        _id: att.id 
    } as any as File));
}

async function handlePdfUpload(file: File | File[] | null | undefined, item: RepertoireItem) {
    if (!file) {
        // This is usually triggered if all files are removed from the uploader
        // But since we handle individual deletes, we might want to be careful.
        // For now, if null, we don't do anything destructive to existing R2 files 
        // unless explicitly requested via removePdf.
        return;
    }
    
    const files = Array.isArray(file) ? file : [file];
    if (files.length === 0) return;

    const newFiles = files.filter(f => !(f as any)._id);
    
    for (const f of newFiles) {
        const formData = new FormData();
        formData.append('file', f);

        try {
            const response = await $fetch<any>('/api/music/upload', {
                method: 'POST',
                body: formData
            });

            if (!item.attachments) item.attachments = [];
            
            item.attachments.push({
                id: response.id,
                name: response.name,
                url: response.url,
                size: response.size,
                type: response.type,
                // We store the key for deletion later
                key: response.key 
            } as any);

            toast.add({
                title: 'File Uploaded',
                description: `${f.name} has been attached.`,
                color: 'success'
            });
        } catch (e: any) {
            toast.add({
                title: 'Upload Failed',
                description: `Could not upload ${f.name}: ${e.message}`,
                color: 'error'
            });
        }
    }
    
    updateParent();
}

async function removePdf(item: RepertoireItem, attachmentId: string) {
    if (!item.attachments) return;
    
    const index = item.attachments.findIndex(a => a.id === attachmentId);
    if (index === -1) return;

    const attachment = item.attachments[index];
    
    try {
        // Call API to delete from R2
        if ((attachment as any).key) {
            await $fetch('/api/music/file', {
                method: 'DELETE',
                query: { key: (attachment as any).key }
            });
        }

        item.attachments.splice(index, 1);
        updateParent();
        
        toast.add({
            title: 'File Removed',
            description: 'The attachment has been removed.',
            color: 'neutral'
        });
    } catch (e: any) {
        toast.add({
            title: 'Removal Failed',
            description: `Could not delete file: ${e.message}`,
            color: 'error'
        });
    }
}

function openAttachment(url: string) {
    window.open(url, '_blank');
}

/**
 * Advanced Sorting Header with Dropdown
 */
function getHeader(column: Column<RepertoireItem, any>, label: string, align: 'left' | 'right' = 'left') {
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

const columns: TableColumn<RepertoireItem>[] = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
      'aria-label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  {
    id: 'expand',
    header: '',
    cell: ({ row }) => h(UButton, {
      'color': 'neutral',
      'variant': 'ghost',
      'icon': 'i-lucide-chevron-right',
      'size': 'xs',
      'ui': {
        leadingIcon: ['transition-transform duration-200', row.getIsExpanded() ? 'rotate-90' : '']
      },
      'onClick': (e: Event) => {
          e.stopPropagation();
          row.toggleExpanded();
      }
    }),
    size: 40,
    enableHiding: false
  },
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
    accessorKey: 'title', 
    header: ({ column }) => getHeader(column as any, 'Title'),
    size: 250
  },
  { 
    accessorKey: 'composer', 
    header: ({ column }) => getHeader(column as any, 'Composer'),
    size: 150
  },
  { 
    accessorKey: 'status', 
    header: ({ column }) => getHeader(column as any, 'Status'),
    size: 140
  },
  { 
    accessorKey: 'difficulty', 
    header: ({ column }) => getHeader(column as any, 'Diff'),
    size: 80
  },
  { 
    id: 'pdf', 
    header: ({ column }) => getHeader(column as any, 'PDF'),
    meta: {
      class: {
        td: 'text-center'
      }
    },
    size: 100
  },
  { 
    id: 'actions', 
    header: '',
    enableHiding: false,
    size: 40
  }
];

function onContextmenu(e: Event, row: TableRow<RepertoireItem>) {
  contextMenuItems.value = [
    { label: row.original.title, type: 'label' },
    { label: row.getIsExpanded() ? 'Collapse' : 'Expand', icon: 'i-lucide-info', onSelect: () => row.toggleExpanded() },
    { type: 'separator' },
    { label: 'Edit Piece (Coming Soon)', icon: 'i-lucide-edit' },
    { label: 'Copy ID', icon: 'i-lucide-copy', onSelect: () => copy(row.original.id) },
    { type: 'separator' },
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => removeItem(row.original.id) }
  ]
}

// Drag and drop integration
useSortable('.repertoire-table-tbody', repertoire, {
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
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Repertoire</h3>
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
              placeholder="Filter pieces..." 
              class="flex-1 max-w-sm"
              size="sm"
              variant="subtle"
          />
        
        <div class="flex items-center gap-2 ml-auto">
            <UButton 
                v-if="Object.keys(rowSelection).length > 0"
                icon="i-lucide-trash" 
                color="error" 
                variant="subtle" 
                size="sm"
                :label="`Delete Selected (${Object.keys(rowSelection).length})`"
                @click="deleteSelected"
            />

            <UButton icon="i-lucide-plus" size="sm" color="primary" label="Add Piece" @click="addItem" />
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
            :data="repertoire" 
            :columns="columns" 
            :loading="props.loading"
            :ui="{ 
                tbody: 'repertoire-table-tbody',
                tr: 'group transition-colors data-[expanded=true]:bg-primary-50/10 dark:data-[expanded=true]:bg-primary-950/10 data-[selected=true]:bg-gray-100/50 dark:data-[selected=true]:bg-gray-800/50',
                td: 'py-2 px-4 h-12'
            }"
            sticky
            class="max-h-[600px] overflow-auto"
            @row-contextmenu="onContextmenu"
        >
            <!-- Title -->
            <template #title-cell="{ row }">
                <UInput 
                    v-model="row.original.title" 
                    variant="none" 
                    class="font-bold text-gray-900 dark:text-white -ml-2" 
                    placeholder="Title" 
                    @blur="updateParent" 
                />
            </template>

            <!-- Composer -->
            <template #composer-cell="{ row }">
                <USelectMenu 
                    v-model="row.original.composer" 
                    :items="repertoireComposers"
                    size="xs"
                    class="w-full -ml-2"
                    searchable
                    create-item
                    variant="none"
                    placeholder="Composer"
                    @change="updateParent"
                    @create="(val: string) => onCreateComposer(val, row.original)" 
                />
            </template>

            <!-- Status -->
            <template #status-cell="{ row }">
                <USelectMenu 
                    v-model="row.original.status" 
                    :items="repertoireStates"
                    size="xs"
                    class="min-w-32"
                    searchable
                    create-item
                    variant="soft"
                    @change="updateParent"
                    @create="(val: string) => onCreateStatus(val, row.original)" 
                />
            </template>

            <!-- Difficulty -->
            <template #difficulty-cell="{ row }">
                <USelect 
                    v-model="row.original.difficulty" 
                    :items="[1,2,3,4,5]" 
                    size="xs" 
                    variant="none"
                    class="w-16"
                    @update:model-value="updateParent"
                />
            </template>

            <!-- PDF -->
            <template #pdf-cell="{ row }">
                <div class="flex justify-center">
                    <UFileUpload 
                        accept="application/pdf"
                        multiple
                        :dropzone="false"
                        @update:model-value="(val) => handlePdfUpload(val, row.original)"
                    >
                        <template #default="{ open }">
                            <UButton 
                                v-if="row.original.attachments?.length"
                                icon="i-lucide-file-text"
                                color="primary"
                                variant="soft"
                                size="xs"
                                :label="row.original.attachments.length === 1 ? row.original.attachments[0]!.name : `${row.original.attachments.length} Files`"
                                class="max-w-[120px] truncate"
                                @click.stop="row.original.attachments.length === 1 ? openAttachment(row.original.attachments[0]!.url) : expanded[row.id] = true"
                            >
                                <template #trailing v-if="row.original.attachments.length > 1">
                                    <UBadge size="sm" variant="solid" class="ml-1 rounded-full px-1.5 min-w-[1.25rem] h-5">{{ row.original.attachments.length }}</UBadge>
                                </template>
                            </UButton>
                            <UButton 
                                v-else
                                icon="i-lucide-upload" 
                                color="neutral"
                                variant="ghost"
                                size="xs"
                                label="Upload"
                                @click="open()"
                            />
                        </template>
                    </UFileUpload>
                </div>
            </template>

            <!-- Actions -->
            <template #actions-cell="{ row }">
                <UDropdownMenu
                    :items="[
                        [{ label: 'Copy ID', icon: 'i-lucide-copy', onSelect: () => copy(row.original.id) }],
                        [{ label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => removeItem(row.original.id) }]
                    ]"
                    :content="{ align: 'end' }"
                >
                    <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
                </UDropdownMenu>
            </template>

            <!-- Expanded Slot -->
            <template #expanded="{ row }">
                <div class="p-4 bg-gray-50/30 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-300">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-uppercase tracking-wider text-gray-400 font-semibold">ITEM METADATA</label>
                            <div class="text-xs font-mono text-gray-500 break-all select-all">UUID: {{ row.original.id }}</div>
                        </div>
                        <div class="space-y-2">
                             <label class="text-[10px] font-uppercase tracking-wider text-gray-400 font-semibold">STATUS INFO</label>
                             <div class="flex items-center gap-2">
                                <UBadge size="sm" variant="subtle" color="primary">{{ row.original.status }}</UBadge>
                                <span class="text-xs text-gray-500">Difficulty: {{ row.original.difficulty }}/5</span>
                             </div>
                        </div>
                         <div class="space-y-3 col-span-1 md:col-span-1">
                              <UFileUpload
                                :model-value="getFilesFromItem(row.original)"
                                accept="application/pdf"
                                class="w-full min-h-32"
                                icon="i-lucide-file-text"
                                label="Attachments"
                                description="Drop PDF files here or click to upload"
                                :dropzone="true"
                                multiple
                                @update:model-value="(val) => handlePdfUpload(val, row.original)"
                              >
                                 <template #actions="{ open }">
                                     <UButton
                                         :label="row.original.attachments?.length ? 'Add More' : 'Select PDF'"
                                         icon="i-lucide-upload"
                                         color="neutral"
                                         variant="outline"
                                         @click="open()"
                                     />
                                 </template>
 
                                 <template #files-top v-if="row.original.attachments?.length">
                                     <div class="mb-2 flex items-center justify-between px-1">
                                         <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Files ({{ row.original.attachments.length }})</p>
                                     </div>
                                 </template>
 
                                 <template #files v-if="row.original.attachments?.length">
                                    <div class="space-y-2">
                                        <div 
                                            v-for="att in row.original.attachments"
                                            :key="att.id"
                                            class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                            @click="openAttachment(att.url)"
                                        >
                                            <div class="w-10 h-10 rounded bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                                                <UIcon name="i-lucide-file-text" class="w-6 h-6 text-primary-500" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-semibold truncate text-gray-900 dark:text-white">{{ att.name }}</p>
                                                <p class="text-[10px] text-gray-400 uppercase tracking-widest font-mono">PDF DOCUMENT • {{ att.type }}</p>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <UButton 
                                                    icon="i-lucide-download" 
                                                    variant="ghost" 
                                                    color="neutral" 
                                                    size="xs" 
                                                    @click.stop="openAttachment(att.url)"
                                                />
                                                <UButton 
                                                    icon="i-lucide-trash" 
                                                    variant="ghost" 
                                                    color="error" 
                                                    size="xs" 
                                                    @click.stop="removePdf(row.original, att.id)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                 </template>
                              </UFileUpload>
                         </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="flex flex-col items-center justify-center py-16 gap-3">
                    <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center ring-8 ring-gray-100 dark:ring-gray-950">
                        <UIcon name="i-lucide-music" class="w-6 h-6 text-gray-300 dark:text-gray-700" />
                    </div>
                    <p class="text-gray-400 text-sm mt-4 italic text-center">No pieces found matching your criteria</p>
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
            <span>{{ repertoire.length }} Total Pieces</span>
        </div>
    </div>
    </div>
  </div>
</template>
