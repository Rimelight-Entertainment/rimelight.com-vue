import { db } from "../../db"
import { measurements, type MeasurementsData } from "../../db"
import { eq } from "drizzle-orm"
import { getUserSession } from "~~/server/utils/session"

const defaultData: MeasurementsData = {
  measurements: []
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const existing = await db
    .select()
    .from(measurements)
    .where(eq(measurements.userId, session.user.id))
    .limit(1)

  if (existing.length === 0) {
    const [newEntry] = await db
      .insert(measurements)
      .values({
        userId: session.user.id,
        data: defaultData
      })
      .returning()

    if (!newEntry) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create measurements data"
      })
    }

    return newEntry.data
  }

  const row = existing[0]

  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: "Measurements record not found"
    })
  }

  const data = row.data as MeasurementsData

  return {
    ...defaultData,
    ...data,
    measurements: data.measurements ?? []
  }
})
