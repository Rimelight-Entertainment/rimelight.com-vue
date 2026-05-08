import { and, desc, eq, isNull } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { board, db } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required.",
    });
  }

  try {
    const boards = await db.query.board.findMany({
      where: and(eq(board.userId, userId), eq(board.isArchived, false), isNull(board.deletedAt)),
      orderBy: [desc(board.createdAt)],
    });

    return boards;
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not fetch boards.",
    });
  }
});
