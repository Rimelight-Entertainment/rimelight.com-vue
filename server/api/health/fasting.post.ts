import { db } from "../../db"
import { fasting } from "../../db"
import { eq, and } from "drizzle-orm"
import { requireAuth } from "~~/server/utils/session"
import { z } from "zod"

const startFastingSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime()
})

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = session.user.id
  const body = await readBody(event)

  const { startTime, endTime } = startFastingSchema.parse(body)

  // Ensure no other active fasts exist
  await db
    .update(fasting)
    .set({ isActive: false })
    .where(and(eq(fasting.userId, userId), eq(fasting.isActive, true)))

  const [newFast] = await db
    .insert(fasting)
    .values({
      userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      originalEndTime: new Date(endTime),
      isActive: true
    })
    .returning()

  return newFast
})
