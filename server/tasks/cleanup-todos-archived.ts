import { and, eq, lt } from "drizzle-orm";
import { db, todo } from "../db";

export default defineTask({
  meta: {
    name: "cleanup-todos-archived",
    description: "Wipe archived todos older than 30 days",
  },
  async run() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const deletedTodos = await db
        .delete(todo)
        .where(and(eq(todo.isArchived, true), lt(todo.updatedAt, thirtyDaysAgo)))
        .returning();

      return {
        result: {
          success: true,
          deletedCount: deletedTodos.length,
          timestamp: new Date().toISOString(),
          error: null as string | null,
        },
      };
    } catch (error) {
      console.error("Failed to cleanup archived todos:", error);
      return {
        result: {
          success: false,
          deletedCount: 0,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
});
