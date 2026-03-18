import * as v from "valibot"
import { and, eq } from "drizzle-orm"
import { db, member } from "#server/db"
import { requireAdminOrOwner } from "#server/utils/session"

const schema = v.object({
  organizationId: v.pipe(v.string(), v.uuid()),
  userId: v.pipe(v.string(), v.uuid())
})

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event)

  const query = await getValidatedQuery(event, (data) => v.parse(schema, data))
  const { organizationId, userId } = query

  try {
    await db
      .delete(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)))
  } catch (e: any) {
    throw e
  }

  return { success: true }
})
