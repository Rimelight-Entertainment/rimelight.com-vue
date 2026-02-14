import { and, eq, gt } from "drizzle-orm";
import { getUserSession } from "#server/utils/session";
import { db, pages, pageVersions } from "#server/db";

export default defineEventHandler(async (event) => {
  const versionId = getRouterParam(event, "versionId");
  const session = await getUserSession(event);

  if (!versionId) {
    throw createError({ statusCode: 400, statusMessage: "Missing version ID" });
  }

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // Only admin or owner can revert versions
  const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "admin";
  if (!isAuthorized) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only admins and owners can revert versions",
    });
  }

  try {
    // Get the version to revert to
    const [version] = await db
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.id, versionId))
      .limit(1);

    if (!version) {
      throw createError({ statusCode: 404, statusMessage: "Version not found" });
    }

    // Verify the page exists
    const [page] = await db.select().from(pages).where(eq(pages.id, version.pageId)).limit(1);

    if (!page) {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    }

    // Update the actual page with the version's data
    const updateData = {
      slug: version.slug,
      title: version.title,
      description: version.description,
      tags: version.tags,
      authorIds: version.authorIds,
      postedAt: version.postedAt,
      updatedAt: new Date(),
      content: version.content,
    };

    const [updatedPage] = await db
      .update(pages)
      .set(updateData)
      .where(eq(pages.id, version.pageId))
      .returning();

    if (!updatedPage) {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    }

    // Mark the reverted version as approved
    await db
      .update(pageVersions)
      .set({
        status: "approved",
        approvedBy: session.user.id,
        approvedAt: new Date(),
      })
      .where(eq(pageVersions.id, versionId));

    // Mark all versions created AFTER this version as rejected
    // (versions with createdAt greater than this version's createdAt)
    await db
      .update(pageVersions)
      .set({
        status: "rejected",
      })
      .where(
        and(eq(pageVersions.pageId, version.pageId), gt(pageVersions.createdAt, version.createdAt)),
      );

    return {
      ...updatedPage,
      blocks: updatedPage.content.blocks,
      properties: updatedPage.content.properties,
      message: "Page reverted to selected version successfully",
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Revert Version Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to revert version",
    });
  }
});
