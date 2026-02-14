import { desc, eq } from "drizzle-orm";
import { requireAdminOrOwner } from "#server/utils/session";
import { db, team, user } from "#server/db";

export default defineEventHandler(async (event) => {
  const session = await requireAdminOrOwner(event);

  const query = getQuery(event);
  const orgId = query.all === "true" ? undefined : session.session?.activeOrganizationId;

  if (!orgId && query.all !== "true") {
    throw createError({
      statusCode: 400,
      statusMessage: "No active organization selected",
    });
  }

  const allTeams = await db
    .select()
    .from(team)
    .where(orgId ? eq(team.organizationId, orgId) : undefined)
    .orderBy(desc(team.createdAt));

  const teamMap = new Map();
  const rootTeams: any[] = [];

  allTeams.forEach((t) => {
    teamMap.set(t.id, { ...t, subteams: [] });
  });

  allTeams.forEach((t) => {
    const node = teamMap.get(t.id);
    if (t.parentId && teamMap.has(t.parentId)) {
      teamMap.get(t.parentId).subteams.push(node);
    } else {
      rootTeams.push(node);
    }
  });

  return rootTeams;
});
