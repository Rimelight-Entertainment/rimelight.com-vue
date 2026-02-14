import { desc } from "drizzle-orm";
import { requireAdminOrOwner } from "#server/utils/session";
import { db, organization } from "#server/db";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 50, 100);
  const offset = Number(query.offset) || 0;

  return db
    .select()
    .from(organization)
    .orderBy(desc(organization.createdAt))
    .limit(limit)
    .offset(offset);
});
