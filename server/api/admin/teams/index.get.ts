import {desc} from "drizzle-orm"
import {getUserSession} from "~~/server/utils/session"
import {db, team} from "../../../db"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || session.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Admin access required"
    })
  }

  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 50, 100)
  const offset = Number(query.offset) || 0

  return db.select().from(team).orderBy(desc(team.createdAt)).limit(limit).offset(offset)
})
