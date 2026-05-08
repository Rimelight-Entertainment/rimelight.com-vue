export const useTodos = () => {
  // 1. Initializing (N/A)

  // 2. Refs
  const todoRefreshTrigger = useState("todos-refresh-trigger", () => 0);
  const status = useState<"idle" | "loading" | "success" | "error">("todos-status", () => "idle");
  const error = useState<Error | null>("todos-error", () => null);

  // 3. Methods
  const triggerRefresh = () => {
    todoRefreshTrigger.value++;
  };

  const wrapApi = async (fn: () => Promise<any>) => {
    status.value = "loading";
    error.value = null;
    try {
      await fn();
      status.value = "success";
      triggerRefresh();
    } catch (e) {
      status.value = "error";
      error.value = e instanceof Error ? e : new Error(String(e));
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await wrapApi(() =>
      $fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: { completed, completedAt: completed ? new Date().toISOString() : null },
      }),
    );
  };

  const archiveTodo = async (id: string) => {
    await wrapApi(() =>
      $fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: { isArchived: true },
      }),
    );
  };

  const restoreTodo = async (id: string) => {
    await wrapApi(() =>
      $fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: { isArchived: false },
      }),
    );
  };

  const deleteTodo = async (id: string) => {
    await wrapApi(() =>
      $fetch(`/api/todos/${id}`, {
        method: "DELETE",
      }),
    );
  };

  const createTodo = async (title: string, description?: string) => {
    await wrapApi(() =>
      $fetch("/api/todos", {
        method: "POST",
        body: { title, description },
      }),
    );
  };

  const clearCompleted = async () => {
    await wrapApi(() =>
      $fetch("/api/todos/clear-completed", {
        method: "POST",
      }),
    );
  };

  return {
    todoRefreshTrigger,
    status,
    error,
    triggerRefresh,
    toggleTodo,
    archiveTodo,
    restoreTodo,
    deleteTodo,
    createTodo,
    clearCompleted,
  };
};
