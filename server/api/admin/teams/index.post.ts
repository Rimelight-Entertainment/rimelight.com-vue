import { db } from "#server/db";
import { team } from "#server/db/schema";
import { requireAdminOrOwner } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const session = await requireAdminOrOwner(event);

  const body = await readBody(event);
  const orgId = session.session?.activeOrganizationId;

  if (!orgId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Active organization ID is required",
    });
  }

  const [newTeam] = await db
    .insert(team)
    .values({
      name: body.name,
      organizationId: orgId,
      parentId: body.parentId ?? null,
    })
    .returning();

  return newTeam;
});
