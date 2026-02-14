import { count, eq } from "drizzle-orm";
import { requireAdminOrOwner } from "#server/utils/session";
import { db, user } from "#server/db";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  return db
    .select({ count: count() })
    .from(user)
    .then((res) => res[0]?.count ?? 0);
});
