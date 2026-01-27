import { db } from "../../db"
import { fasting } from "../../db"
import { eq, desc, and } from "drizzle-orm"
import { requireAuth } from "~~/server/utils/session"

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = session.user.id

  // Get the active fast if it exists
  const activeFast = await db
    .select()
    .from(fasting)
    .where(and(eq(fasting.userId, userId), eq(fasting.isActive, true)))
    .limit(1)

  // Get the 5 latest completed fasts
  const history = await db
    .select()
    .from(fasting)
    .where(and(eq(fasting.userId, userId), eq(fasting.isActive, false)))
    .orderBy(desc(fasting.startTime))
    .limit(5)

  return {
    activeFast: activeFast[0] || null,
    history
  }
})
