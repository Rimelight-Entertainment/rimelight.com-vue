import { db, member } from "#server/db";
import { requireAdminOrOwner } from "#server/utils/session";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const query = getQuery(event);
  const organizationId = query.organizationId as string;
  const userId = query.userId as string;

  if (!organizationId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: organizationId, userId",
    });
  }

  try {
    await db
      .delete(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)));
  } catch (e: any) {
    throw e;
  }

  return { success: true };
});
