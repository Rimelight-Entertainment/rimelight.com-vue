import { asc } from "drizzle-orm";
import { db, pages } from "#server/db";

export default defineEventHandler(async () => {
  return await db
    .select({
      title: pages.title,
      slug: pages.slug,
      type: pages.type,
    })
    .from(pages)
    .orderBy(asc(pages.slug));
});
