<script lang="ts" setup>
import type { NavigationMenuItem } from "#ui/types";
import type { Page } from "#rimelight-components/types";
import { PAGE_MAP as pageDefinitions } from "~/types";
import { computed, markRaw, ref, watch, onMounted, onUnmounted } from "vue";
import RCFocusTimerTool from "rimelight-components/app/components/dashboard/floating-tools/FocusTimerTool.vue";

const { totalHeight } = useHeaderStack();

const { registerTool, openTool, removeTool } = useFloatingTools();
const { registerAction, unregisterAction } = useQuickActions();

const focusTimer = useFocusTimer();

onMounted(() => {
  registerTool({
    id: "focusTimer",
    title: "Focus Timer",
    icon: "lucide:timer",
    component: markRaw(RCFocusTimerTool),
    tooltip: () => useFocusTimer().formattedTime.value,
    onClose: () => useFocusTimer().resetTimer(),
  });

  registerAction({
    id: "focus-timer-action",
    label: "New Focus Timer",
    icon: "lucide:timer",
    group: 0,
    onSelect: () => openTool("focusTimer"),
  });

  registerAction({
    id: "action-new-note",
    label: "New Note",
    icon: "lucide-sticky-note",
    group: 1,
    onSelect: () => {
      isNoteModalOpen.value = true;
    },
  });

  registerAction({
    id: "action-new-todo",
    label: "New To-do",
    icon: "lucide:check-circle-2",
    group: 1,
    onSelect: () => {
      isTodoModalOpen.value = true;
    },
  });

  registerAction({
    id: "action-new-page",
    label: "New Page",
    icon: "lucide:file-plus",
    group: 1,
    onSelect: () => {
      isCreatePageModalOpen.value = true;
    },
  });

  registerAction({
    id: "action-assets",
    label: "Assets",
    icon: "lucide:folder-open",
    group: 1,
    onSelect: () => {
      isAssetModalOpen.value = true;
    },
  });
});

onUnmounted(() => {
  removeTool("focusTimer");
  unregisterAction("focus-timer-action");
  unregisterAction("action-new-note");
  unregisterAction("action-new-todo");
  unregisterAction("action-new-page");
  unregisterAction("action-assets");
});

watch([focusTimer.isRunning], ([timer]) => {
  if (timer) openTool("focusTimer");
});

const isNoteModalOpen = ref(false);
const { triggerRefresh } = useNotes();

const isTodoModalOpen = ref(false);
const { createTodo, triggerRefresh: triggerTodoRefresh } = useTodos();

const isAssetModalOpen = ref(false);

const isCreatePageModalOpen = ref(false);
const isCreatingPage = ref(false);
const router = useRouter();
const { t } = useI18n();
const toast = useToast();

const handleCreatePage = async (newPageData: Partial<Page>) => {
  try {
    isCreatingPage.value = true;
    const createdPage = await $fetch<Page>("/api/pages", {
      method: "POST",
      body: newPageData,
    });

    toast.add({ color: "success", title: t("toast_create_success", "Page created successfully") });

    isCreatePageModalOpen.value = false;
    // Redirect to the new page's editor
    await router.push(`/${createdPage.slug}/edit`);
  } catch (e) {
    console.error(e);
    toast.add({ color: "error", title: t("toast_create_error", "Failed to create page") });
  } finally {
    isCreatingPage.value = false;
  }
};

const newTodoTitle = ref("");
const newTodoDescription = ref("");
const handleQuickTodoSave = async () => {
  if (!newTodoTitle.value.trim()) return;
  await createTodo(newTodoTitle.value.trim(), newTodoDescription.value.trim() || undefined);
  newTodoTitle.value = "";
  newTodoDescription.value = "";
  isTodoModalOpen.value = false;
};

const open = ref(false);

const { user } = useAuth();

const links = computed<NavigationMenuItem[][]>(() => [
  markRaw([
    {
      label: "Home",
      icon: "lucide:home",
      to: "/dashboard",
      defaultOpen: false,
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Inbox",
      icon: "lucide:inbox",
      to: "/dashboard/inbox",
      badge: "4",
      defaultOpen: false,
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Notes",
      icon: "lucide:notebook",
      to: "/dashboard/notes",
      defaultOpen: false,
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Projects",
      icon: "lucide:square-kanban",
      to: "/dashboard/projects",
      defaultOpen: false,
      onSelect: () => {
        open.value = false;
      },
    },
  ]),
  markRaw([
    ...(user.value?.role && ["admin", "owner"].includes(user.value.role)
      ? [
          {
            label: "Admin",
            icon: "lucide:shield-check",
            to: "/dashboard/admin",
            defaultOpen: false,
            onSelect: () => {
              open.value = false;
            },
          },
        ]
      : []),

    {
      label: "Users",
      icon: "lucide-users",
      to: "/dashboard/users",
      defaultOpen: false,
      onSelect: () => {
        open.value = false;
      },
    },
  ]),
]);

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.value.flat(),
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "simple-icons:github",
      },
    ],
  },
]);
</script>

<template>
  <RCBaseDashboardLayout
    v-model:sidebar-open="open"
    :links="links[0] ?? []"
    :footer-links="links[1] ?? []"
    :search-groups="groups"
  >
    <template #header>
      <RLAppHeader />
    </template>

    <template #sidebar-footer-actions>
      <div class="flex flex-row gap-xs">
        <UButton
          color="neutral"
          icon="lucide:cog"
          size="sm"
          to="/dashboard/settings"
          variant="soft"
        />
      </div>

      <div class="flex flex-row gap-xs">
        <UButton
          color="neutral"
          icon="lucide:circle-question-mark"
          size="sm"
          to="/dashboard/help"
          variant="soft"
        />
        <UButton
          color="neutral"
          icon="lucide:bug"
          size="sm"
          to="/dashboard/report-issue"
          variant="soft"
        />
      </div>
    </template>

    <slot />

    <template #modals>
      <RCCreatePageModal
        v-model:open="isCreatePageModalOpen"
        :definitions="pageDefinitions"
        :loading="isCreatingPage"
        @close="isCreatePageModalOpen = false"
        @confirm="handleCreatePage"
      />
      <RCNoteModal v-model:open="isNoteModalOpen" @saved="triggerRefresh" />
      <UModal v-model:open="isTodoModalOpen" :ui="{ content: 'p-md flex flex-col gap-sm' }">
        <template #content>
          <h3 class="text-lg font-bold">New To-do</h3>
          <UInput
            v-model="newTodoTitle"
            autofocus
            placeholder="What needs to be done?"
            variant="outline"
            @keydown.enter="handleQuickTodoSave"
          />
          <UInput
            v-model="newTodoDescription"
            placeholder="Description (optional)"
            size="sm"
            variant="outline"
            @keydown.enter="handleQuickTodoSave"
          />
          <div class="flex justify-end gap-sm">
            <UButton
              color="neutral"
              label="Cancel"
              variant="ghost"
              @click="isTodoModalOpen = false"
            />
            <UButton color="primary" label="Create" @click="handleQuickTodoSave" />
          </div>
        </template>
      </UModal>
      <RCAssetManagerModal v-model:open="isAssetModalOpen" />
    </template>
  </RCBaseDashboardLayout>
</template>

<style scoped></style>
