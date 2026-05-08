import { desc } from "drizzle-orm";
import { requireAdminOrOwner } from "#server/utils/session";
import { db, session as userSession } from "#server/db";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 50, 100);
  const offset = Number(query.offset) || 0;

  return db
    .select()
    .from(userSession)
    .orderBy(desc(userSession.createdAt))
    .limit(limit)
    .offset(offset);
});
