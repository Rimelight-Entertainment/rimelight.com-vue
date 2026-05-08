import { eq, asc } from "drizzle-orm";
import { db, noteLabel } from "#server/db";
import { getUserSession } from "#server/utils/session";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = session?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  return db.query.noteLabel.findMany({
    where: eq(noteLabel.userId, userId),
    orderBy: [asc(noteLabel.name)],
  });
});
