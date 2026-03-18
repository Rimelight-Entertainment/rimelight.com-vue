import * as v from "valibot"
import { db, teamMember } from "#server/db"
import { requireAdminOrOwner } from "#server/utils/session"

const schema = v.object({
  teamId: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid()),
  role: v.picklist(["admin", "member", "owner"] as const)
})

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event)

  const body = await readValidatedBody(event, (data) => v.parse(schema, data))
  const { teamId, userId, role } = body

  try {
    await db.insert(teamMember).values({
      teamId,
      userId,
      role
    })
  } catch (e: any) {
    if (e.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "User is already a member of this team"
      })
    }
    throw e
  }

  return { success: true }
})
