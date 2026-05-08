import { db, teamMember } from "#server/db";
import { requireAdminOrOwner } from "#server/utils/session";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const query = getQuery(event);
  const teamId = query.teamId as string;
  const userId = query.userId as string;

  if (!teamId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: teamId, userId",
    });
  }

  await db
    .delete(teamMember)
    .where(and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)));

  return { success: true };
});
