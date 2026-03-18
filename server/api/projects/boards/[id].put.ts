import { db, board } from "#server/db"
import { getUserSession } from "#server/utils/session"
import * as v from "valibot"
import { eq, and } from "drizzle-orm"

const updateBoardSchema = v.object({
  title: v.optional(v.pipe(v.string(), v.minLength(1))),
  description: v.optional(v.string()),
  isArchived: v.optional(v.boolean())
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  const boardId = getRouterParam(event, "id")

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required."
    })
  }

  if (!boardId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Board ID is required"
    })
  }

  const data = await readValidatedBody(event, (body) => v.parse(updateBoardSchema, body))

  // Verify ownership
  const boardExists = await db.query.board.findFirst({
    where: and(eq(board.id, boardId), eq(board.userId, userId))
  })

  if (!boardExists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Board not found"
    })
  }

  try {
    const updatedBoard = await db
      .update(board)
      .set({ ...data })
      .where(eq(board.id, boardId))
      .returning()

    return updatedBoard[0]
  } catch (error) {
    console.error("Failed to update board:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not update board."
    })
  }
})
