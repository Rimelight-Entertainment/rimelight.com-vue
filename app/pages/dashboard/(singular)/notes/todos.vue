<script lang="ts" setup>
import type { Todo } from "../../../../../server/db/schema";

const { data: todos, refresh: refreshTodos } = await useFetch<Todo[]>("/api/todos");
const { data: archivedTodos, refresh: refreshArchivedTodos } =
  await useFetch<Todo[]>("/api/todos/archived");

const { todoRefreshTrigger } = useTodos();

watch(todoRefreshTrigger, () => {
  refreshTodos();
  refreshArchivedTodos();
});

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div class="p-sm">
    <RLTodoList :todos="todos || []" :archived-todos="archivedTodos || []" />
  </div>
</template>
