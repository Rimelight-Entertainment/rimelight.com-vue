import { PAGE_MAP } from "#types"
import { eq } from "drizzle-orm"
import { type Page } from "rimelight-components/types"
import { syncPageWithDefinition } from "rimelight-components/utils"
import { db, pages } from "#server/db"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required"
    })
  }

  const [pageRecord] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1)

  if (!pageRecord) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" })
  }

  const type = pageRecord.type
  const definition = PAGE_MAP[type as keyof typeof PAGE_MAP]

  if (!definition) {
    throw createError({
      statusCode: 500,
      statusMessage: `No definition found for type: ${type}`
    })
  }

  const mappedPage = {
    ...pageRecord,
    type,
    blocks: pageRecord.content?.blocks || [],
    properties: pageRecord.content?.properties || {}
  } as Page

  return syncPageWithDefinition(mappedPage, definition)
})

