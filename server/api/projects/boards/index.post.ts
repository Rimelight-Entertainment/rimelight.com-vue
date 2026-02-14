import { db, board } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { z } from "zod";

const createBoardSchema = z.object({
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

  const data = await readValidatedBody(event, createBoardSchema.parse);

  try {
    const newBoard = await db
      .insert(board)
      .values({
        userId,
        title: data.title,
        description: data.description,
      })
      .returning();

    return newBoard[0];
  } catch (error) {
    console.error("Failed to create board:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create board.",
    });
  }
});
