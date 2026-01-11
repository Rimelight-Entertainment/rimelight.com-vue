import { eq, desc, and, isNotNull } from "drizzle-orm";
import { db, note } from "../../db"
import { getUserSession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const trashNotes = await db.query.note.findMany({
    where: and(eq(note.userId, userId), isNotNull(note.deleted_at)),
    orderBy: [desc(note.deleted_at)],
    with: {
      noteLabels: {
        with: {
          label: true
        }
      }
    }
  });

  return trashNotes.map((n) => ({
    ...n,
    labels: n.noteLabels.map((nl) => nl.label)
  }));
});
