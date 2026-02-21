import { asc, inArray, like, and } from "drizzle-orm";
import { db, pages } from "#server/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const typesParam = query.types as string | undefined;
  const prefix = query.prefix as string | undefined;

  let q = db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      type: pages.type,
    })
    .from(pages)
    .$dynamic();

  const conditions = [];

  if (prefix) {
    conditions.push(like(pages.slug, `${prefix}%`));
  }

  if (typesParam) {
    const types = typesParam.split(",") as any[];
    conditions.push(inArray(pages.type, types));
  }

  if (conditions.length > 0) {
    q = q.where(and(...conditions));
  }

  return await q.orderBy(asc(pages.slug));
});
