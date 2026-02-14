import { and, isNotNull, lt } from "drizzle-orm";
import { db, note } from "../db";

export default defineTask({
  meta: {
    name: "cleanup-notes-trash",
    description: "Wipe notes in the trash older than 30 days",
  },
  async run() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const deletedNotes = await db
        .delete(note)
        .where(and(isNotNull(note.deletedAt), lt(note.deletedAt, thirtyDaysAgo)))
        .returning();

      return {
        result: {
          success: true,
          deletedCount: deletedNotes.length,
          timestamp: new Date().toISOString(),
          error: null as string | null,
        },
      };
    } catch (error) {
      console.error("Failed to cleanup trash notes:", error);
      return {
        result: {
          success: false,
          deletedCount: 0,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
});
