import { eq } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { db, list } from "#server/db";

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

  const listExists = await db.query.list.findFirst({
    where: eq(list.id, listId),
    with: {
      board: true,
    },
  });

  if (!listExists || listExists.board.userId !== userId) {
    // Return 200/204 to maintain idempotency/privacy or 404
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "List not found",
    });
  }

  try {
    await db.update(list).set({ deletedAt: new Date() }).where(eq(list.id, listId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not delete list.",
    });
  }
});
