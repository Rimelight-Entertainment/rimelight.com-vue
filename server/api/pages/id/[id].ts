import { eq } from "drizzle-orm";

import { z } from "zod";
import { getUserSession } from "#server/utils/session";
import { db, pages, pageVersions } from "#server/db";

const updatePageVersionSchema = z.object({
  slug: z.string().optional(),
  title: z.string().optional(),
  description: z.string().or(z.record(z.string(), z.any())).optional(),
  tags: z.array(z.string()).optional(),
  authorIds: z.array(z.string()).optional(),
  properties: z.record(z.string(), z.any()).optional(),
  blocks: z.array(z.any()).optional(),
  postedAt: z.string().or(z.date()).optional(),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readValidatedBody(event, updatePageVersionSchema.parse);
  const session = await getUserSession(event);

  // 1. Validation & Security
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing ID" });

  const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "member";
  if (!isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: "Unauthorized" });
  }

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "User not authenticated" });
  }

  // 2. Verify page exists
  const [existingPage] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);

  if (!existingPage) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  // 3. Create a new version instead of directly updating
  const versionData = {
    pageId: id,
    status: "pending" as const,
    slug: body.slug || existingPage.slug, // Ensure slug is present
    type: existingPage.type, // Keep the original type
    title: (body.title || existingPage.title) as any,
    description: (body.description || existingPage.description) as any,
    tags: (body.tags || []) as any,
    authorIds: body.authorIds || [],
    content: {
      properties: body.properties || {},
      blocks: body.blocks || [],
    },
    postedAt: body.postedAt ? new Date(body.postedAt) : null,
    createdBy: session.user.id,
  };

  try {
    const [newVersion] = await db.insert(pageVersions).values(versionData).returning();

    if (!newVersion) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create page version",
      });
    }

    // Return the version with a message indicating it's pending approval
    return {
      ...newVersion,
      blocks: newVersion.content.blocks,
      properties: newVersion.content.properties,
      message: "Page changes saved as a new version pending approval",
    };
  } catch (error: any) {
    console.error("Version Creation Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create page version",
    });
  }
});
