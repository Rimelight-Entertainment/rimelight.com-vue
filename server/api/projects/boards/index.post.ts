import { db, board } from "../../../db"
import { getUserSession } from "~~/server/utils/session"
import { z } from "zod"

const createBoardSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
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
  const validation = createBoardSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: validation.error.message
    })
  }

  try {
    const newBoard = await db
      .insert(board)
      .values({
        userId,
        title: validation.data.title,
        description: validation.data.description
      })
      .returning()

    return newBoard[0]
  } catch (error) {
    console.error("Failed to create board:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create board."
    })
  }
})
