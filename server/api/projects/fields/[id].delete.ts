import { eq } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { customFieldDefinition, db } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;
  const fieldId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required.",
    });
  }

  if (!fieldId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Field ID is required",
    });
  }

  const fieldExists = await db.query.customFieldDefinition.findFirst({
    where: eq(customFieldDefinition.id, fieldId),
    with: {
      board: true,
    },
  });

  if (!fieldExists || fieldExists.board.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Custom field not found",
    });
  }

  try {
    // Soft delete
    await db
      .update(customFieldDefinition)
      .set({ deletedAt: new Date() })
      .where(eq(customFieldDefinition.id, fieldId));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete custom field:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not delete custom field.",
    });
  }
});
