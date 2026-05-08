import { db, card } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { z } from "zod";
import { eq } from "drizzle-orm";

const updateCardSchema = z.object({
  listId: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().optional(),
  dueDate: z.string().datetime().optional().nullable(), // Receive string from JSON
  customFields: z.record(z.string(), z.any()).optional(),
});

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

  const data = await readValidatedBody(event, updateCardSchema.parse);

  // Verify card ownership
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

  const updateData: any = { ...data };
  if (updateData.dueDate) {
    updateData.dueDate = new Date(updateData.dueDate);
  }

  try {
    const updatedCard = await db
      .update(card)
      .set(updateData)
      .where(eq(card.id, cardId))
      .returning();

    return updatedCard[0];
  } catch (error) {
    console.error("Failed to update card:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not update card.",
    });
  }
});
