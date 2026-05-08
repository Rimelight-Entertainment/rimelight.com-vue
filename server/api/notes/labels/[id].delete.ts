import { eq, and } from "drizzle-orm";
import { db, noteLabel } from "#server/db";
import { getUserSession } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing label ID" });
  }

  const [deletedLabel] = await db
    .delete(noteLabel)
    .where(and(eq(noteLabel.id, id), eq(noteLabel.userId, userId)))
    .returning();

  if (!deletedLabel) {
    throw createError({ statusCode: 404, statusMessage: "Label not found" });
  }

  return deletedLabel;
});
