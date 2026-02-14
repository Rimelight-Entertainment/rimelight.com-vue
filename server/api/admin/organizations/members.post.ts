import { db, member } from "#server/db";
import { requireAdminOrOwner } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const body = await readBody(event);
  const { organizationId, userId, role } = body;

  if (!organizationId || !userId || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: organizationId, userId, role",
    });
  }

  // Basic insert. Assuming constraints will throw if duplicate.
  // We can catch later if needed.
  try {
    await db.insert(member).values({
      organizationId,
      userId,
      role,
    });
  } catch (e: any) {
    // Check for unique constraint violation or similar
    if (e.code === "23505") {
      // Postgres unique violation code
      throw createError({
        statusCode: 409,
        statusMessage: "User is already a member of this organization",
      });
    }
    throw e;
  }

  return { success: true };
});
