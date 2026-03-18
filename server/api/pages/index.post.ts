import { db, pages } from "#server/db"
import { getUserSession } from "#server/utils/session"
import { v7 as uuidv7 } from "uuid"
import * as v from "valibot"

const localizedSchema = v.record(v.string(), v.any())

const createPageSchema = v.object({
  type: v.string(),
  slug: v.string(),
  title: v.union([v.string(), localizedSchema]),
  description: v.optional(v.union([v.string(), localizedSchema])),
  tags: v.optional(v.array(v.union([v.string(), localizedSchema]))),
  properties: v.optional(v.record(v.string(), v.any())),
  blocks: v.optional(v.array(v.any()))
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => v.parse(createPageSchema, body))
  const session = await getUserSession(event)

  const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "member"
  if (!isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
  }

  const newPage = {
    id: uuidv7(),
    type: body.type as any,
    slug: body.slug,
    title: body.title as any,
    description: (body.description || {}) as any,
    tags: (body.tags || []) as any,
    authorIds: [session.user.id],
    content: {
      properties: body.properties || {},
      blocks: body.blocks || []
    }
  }

  try {
    const result = await db.insert(pages).values(newPage).returning()
    const inserted = result[0]

    // Defensive check to satisfy TypeScript and handle potential DB edge cases
    if (!inserted) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database failed to return the created record."
      })
    }

    return {
      ...inserted,
      blocks: inserted.content.blocks,
      properties: inserted.content.properties
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create page"
    })
  }
})
