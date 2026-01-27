import { db, card, list, } from "../../../db"
import { getUserSession } from "~~/server/utils/session"
import { z } from "zod"
import { eq } from "drizzle-orm"

const createCardSchema = z.object({
  listId: z.string().uuid(),
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
  const validation = createCardSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: validation.error.message
    })
  }

  // Verify list belongs to board owned by user
  const listExists = await db.query.list.findFirst({
    where: eq(list.id, validation.data.listId),
    with: {
      board: true
    }
  })

  if (!listExists || listExists.board.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "List not found"
    })
  }

  try {
    const newCard = await db
      .insert(card)
      .values({
        listId: validation.data.listId,
        title: validation.data.title,
        description: validation.data.description,
        order: 1000 // Default to end
      })
      .returning()

    return newCard[0]
  } catch (error) {
    console.error("Failed to create card:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create card."
    })
  }
})
