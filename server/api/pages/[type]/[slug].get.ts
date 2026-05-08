import { eq, and } from "drizzle-orm";
import { db, pages } from "#server/db";
import { type PageType, type Page } from "rimelight-components/types";
import { syncPageWithDefinition } from "rimelight-components/utils";
import { PAGE_MAP } from "#types";

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type") as PageType;
  const slug = getRouterParam(event, "slug");

  if (!slug || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required parameters: type and slug",
    });
  }

  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.type, type), eq(pages.slug, slug)))
    .limit(1);

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  const mappedPage = {
    ...page,
    type: type,
    blocks: page.content.blocks || [],
    properties: page.content.properties,
  } as Page;

  const definition = PAGE_MAP[type as keyof typeof PAGE_MAP];

  if (!definition) {
    throw createError({
      statusCode: 500,
      statusMessage: `No definition found for page type: ${type}`,
    });
  }

  return syncPageWithDefinition(mappedPage, definition);
});
