import { count } from "drizzle-orm";
import { requireAdminOrOwner } from "#server/utils/session";
import { db, session as userSession } from "#server/db";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  return db
    .select({ count: count() })
    .from(userSession)
    .then((res) => res[0]?.count ?? 0);
});
