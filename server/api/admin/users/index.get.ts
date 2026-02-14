import { desc, ilike, or, count, eq, inArray } from "drizzle-orm";
import { requireAdminOrOwner } from "#server/utils/session";
import { db, user, member, organization, teamMember, team } from "#server/db";

export default defineEventHandler(async (event) => {
  await requireAdminOrOwner(event);

  const queryParams = getQuery(event);
  const limit = Math.min(Number(queryParams.limit) || 50, 100);
  const offset = Number(queryParams.offset) || 0;
  const search = queryParams.search as string;

  const filters = search
    ? or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
    : undefined;

  // 1. Fetch users and total count
  const [users, totalRes] = await Promise.all([
    db.select().from(user).where(filters).orderBy(desc(user.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(user).where(filters),
  ]);

  if (users.length === 0) {
    return { users: [], total: 0 };
  }

  const userIds = users.map((u) => u.id);

  // 2. Fetch memberships and teams manually to stay safe from relational metadata issues
  const [allMemberships, allTeamMemberships] = await Promise.all([
    db
      .select({
        userId: member.userId,
        memberId: member.id,
        role: member.role,
        org: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
        },
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(inArray(member.userId, userIds)),

    db
      .select({
        userId: teamMember.userId,
        tm: {
          id: team.id,
          name: team.name,
          organizationId: team.organizationId,
        },
      })
      .from(teamMember)
      .innerJoin(team, eq(teamMember.teamId, team.id))
      .where(inArray(teamMember.userId, userIds)),
  ]);

  // 3. Map everything back to users
  return {
    users: users.map((u) => ({
      ...u,
      organizations: allMemberships
        .filter((m) => m.userId === u.id)
        .map((m) => ({
          ...m.org,
          memberId: m.memberId,
          role: m.role,
        })),
      teams: allTeamMemberships.filter((m) => m.userId === u.id).map((m) => m.tm),
    })),
    total: Number(totalRes[0]?.count ?? 0),
  };
});
