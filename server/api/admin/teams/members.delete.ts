import * as v from "valibot"
import { and, eq } from "drizzle-orm"
import { db, teamMember } from "#server/db"
import { requireAdminOrOwner } from "#server/utils/session"

const schema = v.object({
  teamId: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid())
})

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event)

  const query = await getValidatedQuery(event, (data) => v.parse(schema, data))
  const { teamId, userId } = query

  try {
    await db
      .delete(teamMember)
      .where(and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)))
  } catch (e: any) {
    throw e
  }

  return { success: true }
})
