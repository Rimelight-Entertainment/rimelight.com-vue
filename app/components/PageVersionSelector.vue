<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useAuth } from "~/composables/useAuth"
import { formatDistanceToNow } from "date-fns"

export interface PageVersion {
  id: string
  pageId: string
  status: "pending" | "approved" | "rejected"
  slug: string
  type: string
  title: any
  description?: any
  tags: any[]
  authorIds: string[]
  content: {
    blocks: any[]
    properties: any
  }
  posted_at?: Date | null
  createdBy: string
  approvedBy?: string | null
  approvedAt?: Date | null
  created_at: Date
  updated_at: Date
  blocks?: any[]
  properties?: any
}

interface Props {
  pageId: string
  currentVersionId?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:currentVersionId": [value: string | null]
  "version-selected": [version: PageVersion]
  "version-approved": [version: PageVersion]
  "version-reverted": [version: PageVersion]
}>()

const { user } = useAuth()
const toast = useToast()
const { t } = useI18n()

const versions = ref<PageVersion[]>([])
const isLoading = ref(false)
const isApproving = ref<string | null>(null)
const isReverting = ref<string | null>(null)
const isOpen = ref(false)

const isAdmin = computed(() => {
  return user.value?.role === "owner" || user.value?.role === "admin"
})

const pendingVersions = computed(() => {
  return versions.value.filter(v => v.status === "pending")
})

const selectedVersionId = computed({
  get: () => props.currentVersionId,
  set: (value) => emit("update:currentVersionId", value || null)
})

const fetchVersions = async () => {
  if (!props.pageId) return
  
  isLoading.value = true
  try {
    const data = await $api<PageVersion[]>(`/api/pages/id/${props.pageId}/versions`)
    versions.value = data
  } catch (error) {
    console.error("Failed to fetch versions:", error)
    toast.add({ color: "error", title: "Failed to load versions" })
  } finally {
    isLoading.value = false
  }
}

const selectVersion = (version: PageVersion) => {
  selectedVersionId.value = version.id
  emit("version-selected", version)
  isOpen.value = false
}

const approveVersion = async (version: PageVersion) => {
  if (!isAdmin.value) return
  
  isApproving.value = version.id
  try {
    const result = await $api<{ message?: string }>(`/api/pages/versions/${version.id}/approve`, {
      method: "POST"
    })
    
    toast.add({ 
      color: "success", 
      title: "Version approved successfully",
      description: result?.message || "The page has been updated with the approved version"
    })
    
    emit("version-approved", version)
    
    // Refresh versions list
    await fetchVersions()
    
    // If this was the selected version, switch back to live page
    if (selectedVersionId.value === version.id) {
      selectedVersionId.value = null
    }
  } catch (error: any) {
    console.error("Failed to approve version:", error)
    toast.add({ 
      color: "error", 
      title: "Failed to approve version",
      description: error.message || "An error occurred"
    })
  } finally {
    isApproving.value = null
  }
}

const revertVersion = async (version: PageVersion) => {
  if (!isAdmin.value) return
  
  isReverting.value = version.id
  try {
    const result = await $api<{ message?: string }>(`/api/pages/versions/${version.id}/revert`, {
      method: "POST"
    })
    
    toast.add({ 
      color: "success", 
      title: "Version reverted successfully",
      description: result?.message || "The page has been reverted to this version. All newer versions have been marked as rejected."
    })
    
    emit("version-reverted", version)
    
    // Refresh versions list
    await fetchVersions()
    
    // Switch back to live page after revert
    selectedVersionId.value = null
  } catch (error: any) {
    console.error("Failed to revert version:", error)
    toast.add({ 
      color: "error", 
      title: "Failed to revert version",
      description: error.message || "An error occurred"
    })
  } finally {
    isReverting.value = null
  }
}

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "success"
    case "pending":
      return "warning"
    case "rejected":
      return "error"
    default:
      return "neutral"
  }
}

watch(() => props.pageId, () => {
  if (props.pageId) {
    fetchVersions()
  }
}, { immediate: true })
</script>

<template>
  <UPopover v-model:open="isOpen" :popper="{ placement: 'bottom-start' }">
    <UButton
      icon="lucide:git-branch"
      label="Versions"
      variant="outline"
      color="neutral"
      size="xs"
      :loading="isLoading"
    />
    
    <template #content>
      <div class="w-80 p-2">
        <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-sm font-semibold">Page Versions</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            View and manage page versions
          </p>
        </div>
        
        <div class="max-h-96 overflow-y-auto">
          <!-- Current/Live Version -->
          <div
            class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': !selectedVersionId }"
            @click="selectedVersionId = null; isOpen = false"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <UBadge color="success" size="xs">Live</UBadge>
                  <span class="text-sm font-medium">Current Version</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The published version of this page
                </p>
              </div>
            </div>
          </div>
          
          <!-- Version List -->
          <div v-if="isLoading" class="px-3 py-4 text-center">
            <USpinner size="sm" />
          </div>
          
          <div v-else-if="versions.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
            No versions yet
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="version in versions"
              :key="version.id"
              class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded"
              :class="{ 'bg-primary-50 dark:bg-primary-900/20': selectedVersionId === version.id }"
              @click="selectVersion(version)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <UBadge 
                      :color="getStatusColor(version.status)" 
                      size="xs"
                    >
                      {{ version.status }}
                    </UBadge>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(version.created_at) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {{ version.title?.en || version.title || "Untitled" }}
                  </p>
                  <p v-if="version.approvedBy && version.approvedAt" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Approved {{ formatDate(version.approvedAt) }}
                  </p>
                </div>
                
                <div v-if="isAdmin" class="flex-shrink-0 flex items-center gap-1">
                  <!-- Approve button for pending versions -->
                  <UButton
                    v-if="version.status === 'pending'"
                    icon="lucide:check"
                    color="success"
                    size="xs"
                    variant="ghost"
                    :loading="isApproving === version.id"
                    @click.stop="approveVersion(version)"
                    title="Approve version"
                  />
                  <!-- Revert button for any version (when viewing it) -->
                  <UButton
                    v-if="selectedVersionId === version.id"
                    icon="lucide:rotate-ccw"
                    color="warning"
                    size="xs"
                    variant="ghost"
                    :loading="isReverting === version.id"
                    @click.stop="revertVersion(version)"
                    title="Revert to this version"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="pendingVersions.length > 0 && isAdmin" class="px-3 py-2 border-t border-gray-200 dark:border-gray-800 mt-2">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ pendingVersions.length }} pending version{{ pendingVersions.length !== 1 ? 's' : '' }} awaiting approval
          </p>
        </div>
      </div>
    </template>
  </UPopover>
</template>
