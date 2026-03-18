import * as v from "valibot"
import { desc } from "drizzle-orm"
import { requireAdminOrOwner } from "#server/utils/session"
import { db, organization } from "#server/db"

const schema = v.object({
  limit: v.optional(
    v.pipe(v.unknown(), v.toNumber(), v.integer(), v.minValue(1), v.maxValue(100)),
    50
  ),
  offset: v.optional(v.pipe(v.unknown(), v.toNumber(), v.integer(), v.minValue(0)), 0)
})

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event)

  const query = await getValidatedQuery(event, (data) => v.parse(schema, data))
  const { limit, offset } = query

  return db
    .select()
    .from(organization)
    .orderBy(desc(organization.createdAt))
    .limit(limit)
    .offset(offset)
})
