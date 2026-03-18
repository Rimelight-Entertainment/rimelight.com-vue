import * as v from "valibot"
import { db } from "#server/db"
import { team } from "#server/db/schema"
import { requireAdminOrOwner } from "#server/utils/session"

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  parentId: v.optional(v.nullable(v.pipe(v.string(), v.uuid())))
})

export default defineEventHandler(async (event) => {
  const session = await requireAdminOrOwner(event)

  const body = await readValidatedBody(event, (data) => v.parse(schema, data))
  const orgId = session.session?.activeOrganizationId

  if (!orgId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Active organization ID is required"
    })
  }

  const [newTeam] = await db
    .insert(team)
    .values({
      name: body.name,
      organizationId: orgId,
      parentId: body.parentId ?? null
    })
    .returning()

  return newTeam
})
