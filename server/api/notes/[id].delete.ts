import { eq, and } from "drizzle-orm";
import { db, note } from "../../db"
import { getQuery } from "h3";
import { getUserSession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing note ID" });
  }

  const query = getQuery(event);
  const isPermanent = query.permanent === "true";

  if (isPermanent) {
    const [hardDeletedNote] = await db
      .delete(note)
      .where(and(eq(note.id, id), eq(note.userId, userId)))
      .returning();

    if (!hardDeletedNote) {
      throw createError({ statusCode: 404, statusMessage: "Note not found" });
    }
    return hardDeletedNote;
  }

  const [softDeletedNote] = await db
    .update(note)
    .set({
      deleted_at: new Date(),
      isPinned: false
    })
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning();

  if (!softDeletedNote) {
    throw createError({ statusCode: 404, statusMessage: "Note not found" });
  }

  return softDeletedNote;
});
