// server/api/pages/find/[slug].get.ts
import { eq } from "drizzle-orm"
import { db, pages } from "../../../db" // Verify this path is correct relative to this file
import { type Page } from "rimelight-components/types"
import { syncPageWithDefinition } from "rimelight-components/utils"
import { PAGE_MAP } from "#types"

export default defineEventHandler(async (event) => {
  // Use getRouterParam for [slug] in the filename
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
