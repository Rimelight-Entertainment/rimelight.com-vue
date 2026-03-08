import { PAGE_MAP } from "#types";
import { eq, or, and, isNull } from "drizzle-orm";
import { type Page } from "rimelight-components/types";
import { syncPageWithDefinition } from "rimelight-components/utils";
import { db, pages } from "#server/db";
import { getUserSession } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const slugParam = getRouterParam(event, "slug");
  const slug = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;

  console.log("[find/...slug] Request received for slug:", slug);

  if (!slug) {
    console.log("[find/...slug] No slug provided");
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }

  // Robust slug normalization: remove leading slashes and ensure comparison is consistent
  const normalizedSlug = slug.replace(/^\//, "");

  console.log("[find/...slug] Querying database for slug:", normalizedSlug);

  let session = null;
  try {
    session = await getUserSession(event);
  } catch (error) {
    // Session optional for public pages
  }

  const isAuthorized =
    session?.user?.role === "owner" ||
    session?.user?.role === "member" ||
    session?.user?.role === "admin";

  let pageRecord;
  try {
    // Try exact match, then try with leading slash if not found
    [pageRecord] = await db
      .select()
      .from(pages)
      .where(
        and(
          or(eq(pages.slug, normalizedSlug), eq(pages.slug, `/${normalizedSlug}`)),
          isNull(pages.deletedAt),
        ),
      )
      .limit(1);

    console.log("[find/...slug] Query completed. Found:", !!pageRecord);
  } catch (error) {
    console.error("[find/...slug] Database error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Database query failed",
      data: { error: String(error) },
    });
  }

  if (!pageRecord) {
    console.log("[find/...slug] Page not found for slug:", normalizedSlug);
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  // Security check: Only authors or staff can view unpublished pages
  if (!pageRecord.postedAt && !isAuthorized) {
    console.log("[find/...slug] Unauthorized access attempt to unpublished page:", normalizedSlug);
    throw createError({ statusCode: 403, statusMessage: "This page is not yet published." });
  }

  const type = pageRecord.type;
  console.log("[find/...slug] Page type:", type);

  const definition = PAGE_MAP[type as keyof typeof PAGE_MAP];

  if (!definition) {
    console.error("[find/...slug] No definition for type:", type);
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

  console.log("[find/...slug] Syncing page with definition");
  const result = syncPageWithDefinition(mappedPage, definition);
  console.log("[find/...slug] Returning page");

  return result;
});
