import { and, desc, eq, isNull, isNotNull } from "drizzle-orm";
import { db, note } from "../../db"
import { getUserSession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required to fetch notes."
    });
  }

  const query = getQuery(event);
  const isArchivedView = query.archived === "true";
  const isTrashView = query.trash === "true";

  try {
    // 3. Build Dynamic Filters
    // We always require the User ID
    const filters = [eq(note.userId, userId)];

    if (isTrashView) {
      // TRASH: Must have a deleted_at date
      filters.push(isNotNull(note.deleted_at));
    } else if (isArchivedView) {
      // ARCHIVE: Must be archived AND NOT deleted
      filters.push(eq(note.isArchived, true));
      filters.push(isNull(note.deleted_at));
    } else {
      // DEFAULT (Index): Must NOT be archived AND NOT deleted
      filters.push(eq(note.isArchived, false));
      filters.push(isNull(note.deleted_at));
    }

    // 4. Execute Query
    const notes = await db.query.note.findMany({
      where: and(...filters),
      with: {
        noteLabels: {
          with: {
            label: true
          }
        }
      },
      orderBy: [desc(note.created_at)]
    });

    return notes.map((n) => ({
      ...n,
      labels: n.noteLabels
    }));
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not fetch notes."
    });
  }
});
