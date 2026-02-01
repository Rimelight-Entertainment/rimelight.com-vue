import {desc} from "drizzle-orm"
import {db, organization} from "../../db"
import {getUserSession} from "../../utils/session"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || !["admin", "owner"].includes(session.user.role || "")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })
  }

  const orgs = await db.query.organization.findMany({
    orderBy: [desc(organization.createdAt)],
    with: {
      members: true
    }
  })

  // Also fetch teams grouped by org
  const teams = await db.query.team.findMany()

  return orgs.map((org) => ({
    ...org,
    teams: teams.filter((t) => t.organizationId === org.id),
    memberCount: org.members.length
  }))
})
