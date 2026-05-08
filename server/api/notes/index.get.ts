import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { getValidatedQuery } from "h3";
import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, note } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required to fetch notes.",
    });
  }

  const { archived, trash } = await getValidatedQuery(
    event,
    z.object({
      archived: z.string().optional(),
      trash: z.string().optional(),
    }).parse,
  );
  const isArchivedView = archived === "true";
  const isTrashView = trash === "true";

  try {
    // 3. Build Dynamic Filters
    // We always require the User ID
    const filters = [eq(note.userId, userId)];

    if (isTrashView) {
      // TRASH: Must have a deletedAt date
      filters.push(isNotNull(note.deletedAt));
    } else if (isArchivedView) {
      // ARCHIVE: Must be archived AND NOT deleted
      filters.push(eq(note.isArchived, true));
      filters.push(isNull(note.deletedAt));
    } else {
      // DEFAULT (Index): Must NOT be archived AND NOT deleted
      filters.push(eq(note.isArchived, false));
      filters.push(isNull(note.deletedAt));
    }

    // 4. Execute Query
    const notes = await db.query.note.findMany({
      where: and(...filters),
      with: {
        noteLabels: {
          with: {
            label: true,
          },
        },
      },
      orderBy: [desc(note.createdAt)],
    });

    return notes.map((n) => ({
      ...n,
      labels: n.noteLabels,
    }));
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not fetch notes.",
    });
  }
});
