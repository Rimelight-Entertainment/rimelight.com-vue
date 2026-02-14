import { eq } from "drizzle-orm";
import { readValidatedBody } from "h3";
import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, note, note_noteLabel } from "#server/db";

const createNoteSchema = z.object({
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

  const validatedBody = await readValidatedBody(event, createNoteSchema.parse);
  const { labels, ...noteData } = validatedBody;

  const [newNote] = await db
    .insert(note)
    .values({
      userId,
      ...noteData,
    })
    .returning();

  if (!newNote) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create note record.",
    });
  }

  if (labels && labels.length > 0) {
    try {
      await db.insert(note_noteLabel).values(
        labels.map((labelId) => ({
          noteId: newNote.id,
          labelId,
        })),
      );
    } catch (error) {
      await db.delete(note).where(eq(note.id, newNote.id));

      throw createError({
        statusCode: 500,
        statusMessage: "Failed to assign labels. Note creation rolled back.",
        cause: error,
      });
    }
  }

  const noteWithLabels = await db.query.note.findFirst({
    where: eq(note.id, newNote.id),
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
      statusMessage: "Failed to retrieve created note.",
    });
  }

  return {
    ...noteWithLabels,
    labels: noteWithLabels.noteLabels.map((nl) => nl.label) || [],
  };
});
