import { desc, eq } from "drizzle-orm";
import { db, pageVersions } from "#server/db";
import { getUserSession } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const session = await getUserSession(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing page ID" });
  }

  // Check authorization - users need to be authenticated to view versions
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const versions = await db
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.pageId, id))
      .orderBy(desc(pageVersions.createdAt));

    return versions.map((version) => ({
      ...version,
      blocks: version.content.blocks,
      properties: version.content.properties,
    }));
  } catch (error: any) {
    console.error("Versions Fetch Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch page versions",
    });
  }
});
