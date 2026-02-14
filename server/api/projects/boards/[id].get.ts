import { and, asc, eq, isNull } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { board, card, customFieldDefinition, db, list } from "#server/db";

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

  try {
    const result = await db.query.board.findFirst({
      where: and(eq(board.id, boardId), eq(board.userId, userId), isNull(board.deletedAt)),
      with: {
        lists: {
          where: isNull(list.deletedAt),
          orderBy: [asc(list.order)],
          with: {
            cards: {
              where: isNull(card.deletedAt),
              orderBy: [asc(card.order)],
            },
          },
        },
        customFields: {
          where: isNull(customFieldDefinition.deletedAt),
        },
      },
    });

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Board not found",
      });
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch board:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not fetch board.",
    });
  }
});
