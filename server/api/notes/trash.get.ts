import { and, desc, eq, isNotNull } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { db, note } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const trashNotes = await db.query.note.findMany({
    where: and(eq(note.userId, userId), isNotNull(note.deletedAt)),
    orderBy: [desc(note.deletedAt)],
    with: {
      noteLabels: {
        with: {
          label: true,
        },
      },
    },
  });

  return trashNotes.map((n) => ({
    ...n,
    labels: n.noteLabels.map((nl) => nl.label),
  }));
});
