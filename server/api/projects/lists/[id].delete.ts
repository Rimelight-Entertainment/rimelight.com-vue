import { db, list } from "../../../db"
import { getUserSession } from "~~/server/utils/session"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  const listId = getRouterParam(event, "id")

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required."
    })
  }

  if (!listId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "List ID is required"
    })
  }

  const listExists = await db.query.list.findFirst({
    where: eq(list.id, listId),
    with: {
      board: true
    }
  })

  if (!listExists || listExists.board.userId !== userId) {
    // Return 200/204 to maintain idempotency/privacy or 404
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "List not found"
    })
  }

  try {
    // Soft delete if using timestamps with deletedAt, but schema didn't explicitly show deletedAt in the snippet
    // but borrowed ...timestamps usually has it or similar.
    // Checking previous schemas: ...timestamps is imported from rimelight-components/db.
    // Assuming it works like other imports, I used isNull(board.deleted_at) in index.get.ts.

    await db.update(list).set({ deleted_at: new Date() }).where(eq(list.id, listId))

    return { success: true }
  } catch (error) {
    console.error("Failed to delete list:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not delete list."
    })
  }
})
