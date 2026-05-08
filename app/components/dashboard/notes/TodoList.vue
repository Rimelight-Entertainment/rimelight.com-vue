<script setup lang="ts">
import { ref } from "vue";
import { useTodos } from "~/composables";
import type { Todo } from "#shared/db";
import { useI18n } from "vue-i18n";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface TodoListProps {
  todos: Todo[];
  archivedTodos?: Todo[];
  loading?: boolean;
  rc?: {
    root?: string;
  };
}

const { todos, archivedTodos = [], loading = false, rc: rcProp } = defineProps<TodoListProps>();

const { rc } = useRC("TodoList", rcProp);
/* endregion */

/* region Emits */
export interface TodoListEmits {}

const emit = defineEmits<TodoListEmits>();
/* endregion */

/* region Slots */
export interface TodoListSlots {}

const slots = defineSlots<TodoListSlots>();
/* endregion */

/* region Styles */
const todoListStyles = tv({
  slots: {
    root: "flex flex-col gap-md",
    header: "flex items-center justify-between",
    headerTitle: "text-sm font-semibold tracking-wider text-gray-500 uppercase",
    mainContainer: "flex flex-col gap-sm",
    quickAddWrapper: "flex flex-col gap-xs",
    inputRow: "flex gap-sm items-center",
    descriptionRow: "pl-0",
    todoGrid: "flex flex-col gap-xs",
    emptyText: "text-xs text-dimmed text-center py-sm",
    archivedGrid: "flex flex-col gap-xs",
  },
});

const {
  root,
  header,
  headerTitle,
  mainContainer,
  quickAddWrapper,
  inputRow,
  descriptionRow,
  todoGrid,
  emptyText,
  archivedGrid,
} = todoListStyles();
type TodoListVariants = VariantProps<typeof todoListStyles>;
/* endregion */

/* region State */
const { toggleTodo, archiveTodo, restoreTodo, deleteTodo, createTodo } = useTodos();
const { t } = useI18n();

const newTodoTitle = ref("");
const newTodoDescription = ref("");
const isAdding = ref(false);
const showArchived = ref(false);
/* endregion */

/* region Meta */
defineOptions({
  name: "TodoList",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return;
  isAdding.value = true;
  try {
    await createTodo(newTodoTitle.value.trim(), newTodoDescription.value.trim() || undefined);
    newTodoTitle.value = "";
    newTodoDescription.value = "";
  } finally {
    isAdding.value = false;
  }
};
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <div :class="header()">
      <h3 :class="headerTitle()">
        {{ t("todo.title") }}
      </h3>
      <UButton
        :icon="showArchived ? 'lucide:archive-x' : 'lucide:archive'"
        color="neutral"
        size="xs"
        variant="ghost"
        :label="showArchived ? t('todo.hide_archive') : t('todo.show_archive')"
        @click="showArchived = !showArchived"
      />
    </div>

    <UCard variant="soft" :ui="{ body: 'p-sm' }">
      <div :class="mainContainer()">
        <!-- Quick Add -->
        <div :class="quickAddWrapper()">
          <div :class="inputRow()">
            <UInput
              v-model="newTodoTitle"
              :placeholder="t('todo.add_placeholder')"
              class="flex-1"
              @keydown.enter="handleAddTodo"
            />
            <UButton icon="lucide:plus" size="sm" :loading="isAdding" @click="handleAddTodo" />
          </div>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div v-if="newTodoTitle.length > 0" :class="descriptionRow()">
              <UInput
                v-model="newTodoDescription"
                :placeholder="t('todo.description_placeholder')"
                size="xs"
                variant="outline"
                color="neutral"
                @keydown.enter="handleAddTodo"
              />
            </div>
          </transition>
        </div>

        <!-- Active Todos -->
        <div :class="todoGrid()">
          <RLTodoCard
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @toggle="(completed) => toggleTodo(todo.id, completed)"
            @archive="archiveTodo(todo.id)"
          />

          <p v-if="todos.length === 0" :class="emptyText()">
            {{ t("todo.no_active") }}
          </p>
        </div>

        <!-- Archived Section -->
        <template v-if="showArchived">
          <USeparator :label="t('common.archive')" />
          <div :class="archivedGrid()">
            <RLTodoCard
              v-for="todo in archivedTodos"
              :key="todo.id"
              :todo="todo"
              @restore="restoreTodo(todo.id)"
              @delete="deleteTodo(todo.id)"
            />
          </div>
        </template>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
