import { count } from "drizzle-orm"
import { getUserSession } from "#server/utils/session"
import { db, session as userSession } from "#server/db"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || (session.user.role !== "admin" && session.user.role !== "owner")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Admin access required"
    })
  }

  return db
    .select({ count: count() })
    .from(userSession)
    .then((res) => res[0]?.count ?? 0)
})

