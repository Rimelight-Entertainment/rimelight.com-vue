import { PAGE_MAP } from "#types";
import { eq } from "drizzle-orm";
import { type Page } from "rimelight-components/types";
import { syncPageWithDefinition } from "rimelight-components/utils";
import { db, pages } from "#server/db";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  console.log("[find/slug] Request received for slug:", slug);

  if (!slug) {
    console.log("[find/slug] No slug provided");
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }

  console.log("[find/slug] Querying database for slug:", slug);

  let pageRecord;
  try {
    [pageRecord] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    console.log("[find/slug] Query completed. Found:", !!pageRecord);
  } catch (error) {
    console.error("[find/slug] Database error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Database query failed",
      data: { error: String(error) },
    });
  }

  if (!pageRecord) {
    console.log("[find/slug] Page not found for slug:", slug);
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  const type = pageRecord.type;
  console.log("[find/slug] Page type:", type);

  const definition = PAGE_MAP[type as keyof typeof PAGE_MAP];

  if (!definition) {
    console.error("[find/slug] No definition for type:", type);
    throw createError({
      statusCode: 500,
      statusMessage: `No definition found for type: ${type}`,
    });
  }

  const mappedPage = {
    ...pageRecord,
    type,
    blocks: pageRecord.content?.blocks || [],
    properties: pageRecord.content?.properties || {},
  } as Page;

  console.log("[find/slug] Syncing page with definition");
  const result = syncPageWithDefinition(mappedPage, definition);
  console.log("[find/slug] Returning page");

  return result;
});
