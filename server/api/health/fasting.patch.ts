import { db } from "../../db"
import { fasting } from "../../db"
import { eq, and } from "drizzle-orm"
import { requireAuth } from "~~/server/utils/session"
import { z } from "zod"

const updateFastingSchema = z.object({
  id: z.string(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  isActive: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userId = session.user.id
  const body = await readBody(event)

  const { id, startTime, endTime, isActive } = updateFastingSchema.parse(body)

  const updateData: any = {}
  if (startTime) updateData.startTime = new Date(startTime)
  if (endTime) {
    updateData.endTime = new Date(endTime)
    // If updating the end time while active, also update the original planned end time
    if (isActive === undefined || isActive === true) {
      updateData.originalEndTime = new Date(endTime)
    }
  }
  if (isActive !== undefined) {
    updateData.isActive = isActive
    // If stopping a fast, set the end time to now to record actual completion
    if (isActive === false) {
      updateData.endTime = new Date()
      updateData.updatedAt = new Date() // Explicitly update updatedAt as well
    }
  }

  const [updatedFast] = await db
    .update(fasting)
    .set(updateData)
    .where(and(eq(fasting.id, id), eq(fasting.userId, userId)))
    .returning()

  if (!updatedFast) {
    throw createError({
      statusCode: 404,
      statusMessage: "Fasting record not found"
    })
  }

  return updatedFast
})
