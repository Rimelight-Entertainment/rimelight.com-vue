import { eq, and } from "drizzle-orm"
import { db, note } from "../../db"
import { getValidatedQuery } from "h3"
import { z } from "zod"
import { getUserSession } from "~~/server/utils/session"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing note ID" })
  }

  const { permanent } = await getValidatedQuery(
    event,
    z.object({
      permanent: z.string().optional()
    }).parse
  )
  const isPermanent = permanent === "true"

  if (isPermanent) {
    const [hardDeletedNote] = await db
      .delete(note)
      .where(and(eq(note.id, id), eq(note.userId, userId)))
      .returning()

    if (!hardDeletedNote) {
      throw createError({ statusCode: 404, statusMessage: "Note not found" })
    }
    return hardDeletedNote
  }

  const [softDeletedNote] = await db
    .update(note)
    .set({
      deleted_at: new Date(),
      isPinned: false
    })
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning()

  if (!softDeletedNote) {
    throw createError({ statusCode: 404, statusMessage: "Note not found" })
  }

  return softDeletedNote
})
