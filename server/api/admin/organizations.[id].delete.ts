import {eq} from "drizzle-orm"
import {db, organization} from "../../db"
import {getUserSession} from "../../utils/session"

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || !["admin", "owner"].includes(session.user.role || "")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })
  }

  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing organization ID"
    })
  }

  await db.delete(organization).where(eq(organization.id, id))

  return { success: true }
})