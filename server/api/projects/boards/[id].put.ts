import { db, board } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

const updateBoardSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isArchived: z.boolean().optional(),
});

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

  const data = await readValidatedBody(event, updateBoardSchema.parse);

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
    const updatedBoard = await db
      .update(board)
      .set({ ...data })
      .where(eq(board.id, boardId))
      .returning();

    return updatedBoard[0];
  } catch (error) {
    console.error("Failed to update board:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not update board.",
    });
  }
});
