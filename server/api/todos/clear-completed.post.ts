import { and, eq } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { db, todo } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    await db.delete(todo).where(and(eq(todo.userId, userId), eq(todo.completed, true)));

    return { success: true };
  } catch (error) {
    console.error("Failed to clear completed todos:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
