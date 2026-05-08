import { and, eq, inArray } from "drizzle-orm";
import { createError } from "h3";
import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, note } from "#server/db";

const batchActionSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["delete", "archive", "unarchive", "pin", "unpin", "restore", "hard-delete"]),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const { ids, action } = await readValidatedBody(event, batchActionSchema.parse);

  if (action === "delete") {
    return await db
      .update(note)
      .set({
        deletedAt: new Date(),
        isPinned: false,
      })
      .where(and(inArray(note.id, ids), eq(note.userId, userId)))
      .returning();
  }

  if (action === "hard-delete") {
    return await db
      .delete(note)
      .where(and(inArray(note.id, ids), eq(note.userId, userId)))
      .returning();
  }

  let updateData = {};
  switch (action) {
    case "archive":
      updateData = { isArchived: true, isPinned: false };
      break;
    case "unarchive":
      updateData = { isArchived: false };
      break;
    case "pin":
      updateData = { isPinned: true, isArchived: false };
      break;
    case "unpin":
      updateData = { isPinned: false };
      break;
    case "restore":
      updateData = { deletedAt: null, isArchived: false, isPinned: false };
      break;
  }

  return await db
    .update(note)
    .set(updateData)
    .where(and(inArray(note.id, ids), eq(note.userId, userId)))
    .returning();
});
