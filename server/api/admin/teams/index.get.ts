import { desc, eq } from "drizzle-orm"
import { getUserSession } from "~~/server/utils/session"
import { db, team } from "../../../db"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || (session.user.role !== "admin" && session.user.role !== "owner")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Admin access required"
    })
  }

  const orgId = session.session?.activeOrganizationId

  if (!orgId) {
    throw createError({
      statusCode: 400,
      statusMessage: "No active organization selected"
    })
  }

  const allTeams = await db
    .select()
    .from(team)
    .where(eq(team.organizationId, orgId))
    .orderBy(desc(team.createdAt))

  const teamMap = new Map()
  const rootTeams: any[] = []

  allTeams.forEach((t) => {
    teamMap.set(t.id, { ...t, subteams: [] })
  })

  allTeams.forEach((t) => {
    const node = teamMap.get(t.id)
    if (t.parentId && teamMap.has(t.parentId)) {
      teamMap.get(t.parentId).subteams.push(node)
    } else {
      rootTeams.push(node)
    }
  })

  return rootTeams
})
