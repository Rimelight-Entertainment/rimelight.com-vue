import { eq } from "drizzle-orm";
import { db, pageVersions } from "#server/db";
import { getUserSession } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const versionId = getRouterParam(event, "versionId");
  const session = await getUserSession(event);

  if (!versionId) {
    throw createError({ statusCode: 400, statusMessage: "Missing version ID" });
  }

  // Check authorization - users need to be authenticated to view versions
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const [version] = await db
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.id, versionId))
      .limit(1);

    if (!version) {
      throw createError({ statusCode: 404, statusMessage: "Version not found" });
    }

    return {
      ...version,
      blocks: version.content.blocks,
      properties: version.content.properties,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Version Fetch Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch version",
    });
  }
});
