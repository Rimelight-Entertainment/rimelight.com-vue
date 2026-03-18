import { db, board } from "#server/db"
import { getUserSession } from "#server/utils/session"
import * as v from "valibot"

const createBoardSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1)),
  description: v.optional(v.string())
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

  const data = await readValidatedBody(event, (body) => v.parse(createBoardSchema, body))

  try {
    const newBoard = await db
      .insert(board)
      .values({
        userId,
        title: data.title,
        description: data.description
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
