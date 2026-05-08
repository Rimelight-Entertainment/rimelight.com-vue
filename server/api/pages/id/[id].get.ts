import { eq } from "drizzle-orm";
import { db, pages } from "#server/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing ID" });
  }

  // Fetch page (basic details only by default, or robust select)
  const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  return page;
});
