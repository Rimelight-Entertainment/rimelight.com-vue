import * as v from "valibot"
import { db, member } from "#server/db"
import { requireAdminOrOwner } from "#server/utils/session"

const schema = v.object({
  organizationId: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid()),
  role: v.picklist(["admin", "member", "owner"] as const)
})

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event)

  const body = await readValidatedBody(event, (data) => v.parse(schema, data))
  const { organizationId, userId, role } = body

  // Basic insert. Assuming constraints will throw if duplicate.
  // We can catch later if needed.
  try {
    await db.insert(member).values({
      organizationId,
      userId,
      role
    })
  } catch (e: any) {
    // Check for unique constraint violation or similar
    if (e.code === "23505") {
      // Postgres unique violation code
      throw createError({
        statusCode: 409,
        statusMessage: "User is already a member of this organization"
      })
    }
    throw e
  }

  return { success: true }
})
