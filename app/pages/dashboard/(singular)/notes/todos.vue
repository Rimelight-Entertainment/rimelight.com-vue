<script lang="ts" setup>
import type { Todo } from "rimelight-components/db"

const { data: todos, refresh: refreshTodos } = await useApi<Todo[]>("/api/todos")
const { data: archivedTodos, refresh: refreshArchivedTodos } =
  await useApi<Todo[]>("/api/todos/archived")

const { todoRefreshTrigger } = useTodos()

watch(todoRefreshTrigger, () => {
  refreshTodos()
  refreshArchivedTodos()
})

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
    <RCTodoList :todos="todos || []" :archived-todos="archivedTodos || []" />
  </div>
</template>
