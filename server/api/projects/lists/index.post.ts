import { db, list, board } from "../../../db"
import { getUserSession } from "~~/server/utils/session"
import { z } from "zod"
import { eq, and } from "drizzle-orm"

const createListSchema = z.object({
  boardId: z.string().uuid(),
  title: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required."
    })
  }

  const body = await readBody(event)
  const validation = createListSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: validation.error.message
    })
  }

  // Verify board belongs to user
  const boardExists = await db.query.board.findFirst({
    where: and(eq(board.id, validation.data.boardId), eq(board.userId, userId))
  })

  if (!boardExists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Board not found"
    })
  }

  try {
    const newList = await db
      .insert(list)
      .values({
        boardId: validation.data.boardId,
        title: validation.data.title,
        order: 1000 // Default to end, can be adjusted or better calculation logic added later
      })
      .returning()

    return newList[0]
  } catch (error) {
    console.error("Failed to create list:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create list."
    })
  }
})
