import { db, teamMember } from "#server/db";
import { requireAdminOrOwner } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const body = await readBody(event);
  const { teamId, userId, role } = body;

  if (!teamId || !userId || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: teamId, userId, role",
    });
  }

  try {
    await db.insert(teamMember).values({
      teamId,
      userId,
      role,
    });
  } catch (e: any) {
    if (e.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "User is already a member of this team",
      });
    }
    throw e;
  }

  return { success: true };
});
