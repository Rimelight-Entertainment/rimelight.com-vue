import { eq } from "drizzle-orm";
import { db, pageVersions } from "#server/db";
import { requireAdminOrOwner } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const versionId = getRouterParam(event, "versionId");
  const _session = await requireAdminOrOwner(event);

  if (!versionId) {
    throw createError({ statusCode: 400, statusMessage: "Missing version ID" });
  }

  try {
    // Get the version
    const [version] = await db
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.id, versionId))
      .limit(1);

    if (!version) {
      throw createError({ statusCode: 404, statusMessage: "Version not found" });
    }

    if (version.status !== "pending") {
      throw createError({
        statusCode: 400,
        statusMessage: "Only pending versions can be rejected",
      });
    }

    // Mark the version as rejected
    await db
      .update(pageVersions)
      .set({
        status: "rejected",
      })
      .where(eq(pageVersions.id, versionId));

    return {
      message: "Version rejected successfully",
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Reject Version Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to reject version",
    });
  }
});
