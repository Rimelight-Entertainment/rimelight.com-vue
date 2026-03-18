import { db, customFieldDefinition, board } from "#server/db"
import { getUserSession } from "#server/utils/session"
import * as v from "valibot"
import { eq } from "drizzle-orm"

const createFieldSchema = v.object({
  boardId: v.pipe(v.string(), v.uuid()),
  name: v.pipe(v.string(), v.minLength(1)),
  type: v.picklist(["TEXT", "NUMBER", "DATE", "SELECT", "CHECKBOX", "URL"]),
  options: v.optional(
    v.array(
      v.object({
        label: v.string(),
        value: v.string(),
        color: v.optional(v.string())
      })
    )
  )
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

  const data = await readValidatedBody(event, (body) => v.parse(createFieldSchema, body))

  // Verify board ownership
  const boardExists = await db.query.board.findFirst({
    where: eq(board.id, data.boardId)
  })

  if (!boardExists || boardExists.userId !== userId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Board not found"
    })
  }

  try {
    const newField = await db
      .insert(customFieldDefinition)
      .values({
        boardId: data.boardId,
        name: data.name,
        type: data.type,
        options: data.options || []
      })
      .returning()

    return newField[0]
  } catch (error) {
    console.error("Failed to create custom field:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not create custom field."
    })
  }
})
