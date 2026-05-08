import { db, noteLabel } from "#server/db";

import { z } from "zod";
import { getUserSession } from "#server/utils/session";

const createLabelSchema = z.object({
  name: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const { name } = await readValidatedBody(event, createLabelSchema.parse);

  const [newLabel] = await db
    .insert(noteLabel)
    .values({
      userId,
      name,
    })
    .returning();

  return newLabel;
});
