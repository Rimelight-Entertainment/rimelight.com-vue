import { and, desc, eq } from "drizzle-orm";
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
    return await db.query.todo.findMany({
      where: and(eq(todo.userId, userId), eq(todo.isArchived, true)),
      orderBy: [desc(todo.completedAt), desc(todo.createdAt)],
    });
  } catch (error) {
    console.error("Failed to fetch archived todos:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
