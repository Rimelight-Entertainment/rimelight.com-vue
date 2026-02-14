import { db, customFieldDefinition, board } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { z } from "zod";
import { eq } from "drizzle-orm";

const createFieldSchema = z.object({
  boardId: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(["TEXT", "NUMBER", "DATE", "SELECT", "CHECKBOX", "URL"]),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        color: z.string().optional(),
      }),
    )
    .optional(),
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

  const data = await readValidatedBody(event, createFieldSchema.parse);

  // Verify board ownership
  const boardExists = await db.query.board.findFirst({
    where: eq(board.id, data.boardId),
  });

  if (!boardExists || boardExists.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Board not found",
    });
  }

  try {
    const newField = await db
      .insert(customFieldDefinition)
      .values({
        boardId: data.boardId,
        name: data.name,
        type: data.type,
        options: data.options || [],
      })
      .returning();

    return newField[0];
  } catch (error) {
    console.error("Failed to create custom field:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create custom field.",
    });
  }
});
