import { db, list } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { z } from "zod";
import { eq } from "drizzle-orm";

const updateListSchema = z.object({
  title: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;
  const listId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required.",
    });
  }

  if (!listId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "List ID is required",
    });
  }

  const data = await readValidatedBody(event, updateListSchema.parse);

  // Verify list belongs to a board owned by user
  // This requires a join or two queries.
  // Optimization: Just check if we can update it. Drizzle doesn't support joins in update easily without subqueries or checks.
  // Let's verify ownership first.
  const listExists = await db.query.list.findFirst({
    where: eq(list.id, listId),
    with: {
      board: true,
    },
  });

  if (!listExists || listExists.board.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "List not found or unauthorized",
    });
  }

  try {
    const updatedList = await db
      .update(list)
      .set({
        ...data,
      })
      .where(eq(list.id, listId))
      .returning();

    return updatedList[0];
  } catch (error) {
    console.error("Failed to update list:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not update list.",
    });
  }
});
