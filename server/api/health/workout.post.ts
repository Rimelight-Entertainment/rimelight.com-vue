import { db } from "../../db";
import { workout, type WorkoutData } from "../../db";
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

    const body = await readBody<WorkoutData>(event);

    const existing = await db
        .select()
        .from(workout)
        .where(eq(workout.userId, session.user.id))
        .limit(1);

    if (existing.length === 0) {
        await db.insert(workout).values({
            userId: session.user.id,
            data: body
        });
    } else {
        await db
            .update(workout)
            .set({ data: body })
            .where(eq(workout.userId, session.user.id));
    }

    return { success: true };
});
