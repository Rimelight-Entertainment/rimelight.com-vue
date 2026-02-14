import { readValidatedBody } from "h3";
import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, todo } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { title, description } = await readValidatedBody(
    event,
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    }).parse,
  );

  try {
    const newTodo = await db
      .insert(todo)
      .values({
        userId,
        title,
        description,
        completed: false,
        isArchived: false,
      })
      .returning();

    return newTodo[0];
  } catch (error) {
    console.error("Failed to create todo:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
