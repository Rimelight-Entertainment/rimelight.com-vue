import { db, noteLabel } from "#server/db"
import * as v from "valibot"
import { getUserSession } from "#server/utils/session"

const createLabelSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1))
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const { name } = await readValidatedBody(event, (body) => v.parse(createLabelSchema, body))

  const [newLabel] = await db
    .insert(noteLabel)
    .values({
      userId,
      name
    })
    .returning()

  return newLabel
})
