import { and, desc, eq, isNotNull, isNull } from "drizzle-orm"
import { getValidatedQuery } from "h3"
import type { PageType } from "rimelight-components/types"
import { z } from "zod"
import { getUserSession } from "#server/utils/session"
import { db, pages } from "#server/db"

export default defineEventHandler(async (event) => {
  const queryData = await getValidatedQuery(
    event,
    z.object({
      limit: z.string().optional(),
      offset: z.string().optional(),
      type: z.string().optional(),
      status: z.enum(["published", "draft"]).optional()
    }).parse
  )
  const session = await getUserSession(event)

  // 1. Extract and Validate Params
  const limit = Math.max(1, parseInt(queryData.limit || "") || 10)
  const offset = Math.max(0, parseInt(queryData.offset || "") || 0)
  const type = (queryData.type as PageType) || "Default"
  const status = queryData.status as "published" | "draft"

  // 2. Security Check: Only 'owner' or 'employee' can view drafts
  const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "member"
  if (status === "draft" && !isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: "Unauthorized to view drafts" })
  }

  // 3. Build Dynamic Filter
  const filters = [eq(pages.type, type)]

  if (status === "published") {
    // If we want published posts, we look for rows where postedAt HAS a date
    filters.push(isNotNull(pages.postedAt))
  } else if (status === "draft") {
    // If we want drafts, we look for rows where postedAt is EMPTY
    filters.push(isNull(pages.postedAt))
  }

  try {
    const results = await db.query.pages.findMany({
      where: and(...filters),
      orderBy: [desc(pages.postedAt), desc(pages.createdAt)],
      limit,
      offset
    })

    return results.map((row) => ({
      ...row,
      blocks: row.content.blocks,
      properties: row.content.properties
    }))
  } catch (error) {
    console.error("Pages API Error:", error)
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch pages" })
  }
})

