import { eq } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { card, db } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;
  const cardId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required.",
    });
  }

  if (!cardId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Card ID is required",
    });
  }

  const cardExists = await db.query.card.findFirst({
    where: eq(card.id, cardId),
    with: {
      list: {
        with: {
          board: true,
        },
      },
    },
  });

  if (!cardExists || cardExists.list.board.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Card not found",
    });
  }

  try {
    await db.update(card).set({ deletedAt: new Date() }).where(eq(card.id, cardId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete card:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not delete card.",
    });
  }
});
