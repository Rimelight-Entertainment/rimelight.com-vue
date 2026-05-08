import { and, count, ilike, isNull } from "drizzle-orm";
import { db, pages } from "#server/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slugPrefix = query.slugPrefix as string;

  let where = and(isNull(pages.deletedAt));

  if (slugPrefix) {
    const sanitizedPrefix = slugPrefix.startsWith("/") ? slugPrefix.slice(1) : slugPrefix;
    where = and(where, ilike(pages.slug, `${sanitizedPrefix}%`));
  }

  return await db
    .select({ count: count() })
    .from(pages)
    .where(where)
    .then((res) => res[0]?.count ?? 0);
});
