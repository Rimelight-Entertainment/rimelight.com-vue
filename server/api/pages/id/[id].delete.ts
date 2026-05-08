import { eq } from "drizzle-orm";
import { db, pages } from "#server/db";
import { getUserSession } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const session = await getUserSession(event);

  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing ID" });

  const isAuthorized = session?.user?.role === "owner";
  if (!isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: "Unauthorized" });
  }

  try {
    const [deletedPage] = await db
      .update(pages)
      .set({ deletedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();

    if (!deletedPage) {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    }

    return { success: true };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete page",
    });
  }
});
