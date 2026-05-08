import { and, eq } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { db, todo } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;
  const id = getRouterParam(event, "id");

  if (!userId || !id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const deleted = await db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning();

    if (!deleted.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
