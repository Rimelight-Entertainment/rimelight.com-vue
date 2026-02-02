import { db } from "~~/server/db"
import { team } from "~~/server/db/schema"
import { getUserSession } from "~~/server/utils/session"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || (session.user.role !== "admin" && session.user.role !== "owner")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Admin access required"
    })
  }

  const body = await readBody(event)
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
