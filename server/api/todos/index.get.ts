import { and, desc, eq } from "drizzle-orm";
import { getValidatedQuery } from "h3";
import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, todo } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required to fetch todos.",
    });
  }

  const { archived } = await getValidatedQuery(
    event,
    z.object({
      archived: z.string().optional(),
    }).parse,
  );
  const isArchivedView = archived === "true";

  try {
    const filters = [eq(todo.userId, userId), eq(todo.isArchived, isArchivedView)];

    return await db.query.todo.findMany({
      where: and(...filters),
      orderBy: [desc(todo.createdAt)],
    });
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not fetch todos.",
    });
  }
});
