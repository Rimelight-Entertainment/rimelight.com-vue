import { db, pages } from "#server/db";
import { getUserSession } from "#server/utils/session";
import { v7 as uuidv7 } from "uuid";

import { z } from "zod";

const createPageSchema = z.object({
  type: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().or(z.record(z.string(), z.any())).optional(),
  properties: z.record(z.string(), z.any()).optional(),
  blocks: z.array(z.any()).optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createPageSchema.parse);
  const session = await getUserSession(event);

  const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "member";
  if (!isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: "Unauthorized" });
  }

  const newPage = {
    id: uuidv7(),
    type: body.type as any,
    slug: body.slug,
    title: body.title as any,
    description: (body.description || {}) as any,
    authorIds: [session.user.id],
    content: {
      properties: body.properties || {},
      blocks: body.blocks || [],
    },
  };

  try {
    const result = await db.insert(pages).values(newPage).returning();
    const inserted = result[0];

    // Defensive check to satisfy TypeScript and handle potential DB edge cases
    if (!inserted) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database failed to return the created record.",
      });
    }

    return {
      ...inserted,
      blocks: inserted.content.blocks,
      properties: inserted.content.properties,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create page",
    });
  }
});
