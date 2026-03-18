import { and, eq } from "drizzle-orm"
import { readValidatedBody } from "h3"
import * as v from "valibot"
import { getUserSession } from "#server/utils/session"
import { db, todo } from "#server/db"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  const id = getRouterParam(event, "id")

  if (!userId || !id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const { title, completed, completedAt, isArchived } = await readValidatedBody(event, (body) =>
    v.parse(
      v.object({
        title: v.optional(v.string()),
        completed: v.optional(v.boolean()),
        completedAt: v.optional(v.nullable(v.string())),
        isArchived: v.optional(v.boolean())
      }),
      body
    )
  )

  try {
    const updatedTodo = await db
      .update(todo)
      .set({
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
        ...(completedAt !== undefined && {
          completedAt: completedAt ? new Date(completedAt) : null
        }),
        ...(isArchived !== undefined && { isArchived })
      })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning()

    if (!updatedTodo.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found"
      })
    }

    return updatedTodo[0]
  } catch (error) {
    console.error("Failed to update todo:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error"
    })
  }
})
