import { db, card, list } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { z } from "zod";
import { eq } from "drizzle-orm";

const createCardSchema = z.object({
  listId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
});

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

  const data = await readValidatedBody(event, createCardSchema.parse);

  // Verify list belongs to board owned by user
  const listExists = await db.query.list.findFirst({
    where: eq(list.id, data.listId),
    with: {
      board: true,
    },
  });

  if (!listExists || listExists.board.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "List not found",
    });
  }

  try {
    const newCard = await db
      .insert(card)
      .values({
        listId: data.listId,
        title: data.title,
        description: data.description,
        order: 1000, // Default to end
      })
      .returning();

    return newCard[0];
  } catch (error) {
    console.error("Failed to create card:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create card.",
    });
  }
});
