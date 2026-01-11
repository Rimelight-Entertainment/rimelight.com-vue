import { db } from "../../db";
import { habits } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const result = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, session.user.id))
        .limit(1);

    if (result.length === 0) {
        // initialize if not exists
        const [newTracker] = await db
            .insert(habits)
            .values({
                userId: session.user.id,
                data: { years: [] },
            })
            .returning();

        if (!newTracker) {
            throw createError({ statusCode: 500, statusMessage: "Failed to initialize habit tracker" });
        }
        return newTracker.data;
    }

    return result[0]!.data;
});
