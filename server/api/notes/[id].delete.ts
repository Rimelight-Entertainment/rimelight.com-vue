import * as v from "valibot"
import { getUserSession } from "#server/utils/session"
import { db, note } from "#server/db"

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

  const { permanent } = await getValidatedQuery(event, (query) =>
    v.parse(
      v.object({
        permanent: v.optional(v.string())
      }),
      query
    )
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
      deletedAt: new Date(),
      isPinned: false
    })
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning()

  if (!softDeletedNote) {
    throw createError({ statusCode: 404, statusMessage: "Note not found" })
  }

  return softDeletedNote
})
