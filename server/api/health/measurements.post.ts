import { db } from "../../db"
import { measurements, type MeasurementsData } from "../../db"
import { eq } from "drizzle-orm"
import { getUserSession } from "~~/server/utils/session"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const body = await readBody<MeasurementsData>(event)

  const existing = await db
    .select()
    .from(measurements)
    .where(eq(measurements.userId, session.user.id))
    .limit(1)

  if (existing.length === 0) {
    await db.insert(measurements).values({
      userId: session.user.id,
      data: body
    })
  } else {
    await db
      .update(measurements)
      .set({ data: body })
      .where(eq(measurements.userId, session.user.id))
  }

  return { success: true }
})
