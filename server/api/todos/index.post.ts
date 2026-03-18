import * as v from "valibot"
import { getUserSession } from "#server/utils/session"
import { db, todo } from "#server/db"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const { title, description } = await readValidatedBody(event, (body) =>
    v.parse(
      v.object({
        title: v.pipe(v.string(), v.minLength(1)),
        description: v.optional(v.string())
      }),
      body
    )
  )

  try {
    const newTodo = await db
      .insert(todo)
      .values({
        userId,
        title,
        description,
        completed: false,
        isArchived: false
      })
      .returning()

    return newTodo[0]
  } catch (error) {
    console.error("Failed to create todo:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error"
    })
  }
})
