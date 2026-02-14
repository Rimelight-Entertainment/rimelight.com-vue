import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, note, note_noteLabel, noteLabel } from "#server/db";

const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  labels: z.array(z.string()).optional(),
});

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

  const validatedBody = await readValidatedBody(event, updateNoteSchema.parse);
  const { labels, ...noteData } = validatedBody;

  // 1. Update note details (Standard update)
  const [updatedNote] = await db
    .update(note)
    .set(noteData)
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning();

  if (!updatedNote) {
    throw createError({ statusCode: 404, statusMessage: "Note not found" });
  }

  // 2. Handle Labels (Sequential without Transaction)
  if (labels) {
    // A. Deduplicate: Prevent PK violations from the frontend sending ["id1", "id1"]
    const uniqueLabelIds = [...new Set(labels)];

    let validLabelIds: string[] = [];

    // B. Validation: Only attempt to link labels that actually exist and belong to user
    // This prevents Foreign Key crashes during the INSERT step
    if (uniqueLabelIds.length > 0) {
      const validLabels = await db.query.noteLabel.findMany({
        where: and(eq(noteLabel.userId, userId), inArray(noteLabel.id, uniqueLabelIds)),
        columns: { id: true },
      });
      validLabelIds = validLabels.map((l) => l.id);
    }

    // C. Execution: Delete then Insert
    // Since we validated IDs above, the INSERT is extremely unlikely to fail,
    // reducing the risk of data inconsistency without transactions.

    // Step C1: Clear existing
    await db.delete(note_noteLabel).where(eq(note_noteLabel.noteId, id));

    // Step C2: Insert new (only if we have valid ones)
    if (validLabelIds.length > 0) {
      await db.insert(note_noteLabel).values(
        validLabelIds.map((labelId) => ({
          noteId: id,
          labelId,
        })),
      );
    }
  }

  // 3. Fetch final result
  const noteWithLabels = await db.query.note.findFirst({
    where: eq(note.id, id),
    with: {
      noteLabels: {
        with: {
          label: true,
        },
      },
    },
  });

  if (!noteWithLabels) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to retrieve updated note",
    });
  }

  return {
    ...noteWithLabels,
    labels: noteWithLabels.noteLabels.map((nl) => nl.label),
  };
});
