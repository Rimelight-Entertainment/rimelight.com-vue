import { and, eq } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { board, db } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;
  const boardId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required.",
    });
  }

  if (!boardId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Board ID is required",
    });
  }

  // Verify ownership
  const boardExists = await db.query.board.findFirst({
    where: and(eq(board.id, boardId), eq(board.userId, userId)),
  });

  if (!boardExists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Board not found",
    });
  }

  try {
    // Soft delete
    await db.update(board).set({ deletedAt: new Date() }).where(eq(board.id, boardId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete board:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not delete board.",
    });
  }
});
