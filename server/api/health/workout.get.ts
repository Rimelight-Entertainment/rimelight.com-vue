import { db } from "../../db";
import { workout, type WorkoutData } from "../../db";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";

const defaultData: WorkoutData = {
    exercises: [],
    stretches: []
};

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const existing = await db
        .select()
        .from(workout)
        .where(eq(workout.userId, session.user.id))
        .limit(1);

    if (existing.length === 0) {
        const [newEntry] = await db.insert(workout).values({
            userId: session.user.id,
            data: defaultData
        }).returning();

        if (!newEntry) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create workout data"
            });
        }

        return newEntry.data;
    }

    const row = existing[0];

    if (!row) {
        throw createError({
            statusCode: 404,
            statusMessage: "Workout record not found",
        });
    }

    const data = row.data as WorkoutData;

    return {
        ...defaultData,
        ...data,
        exercises: data.exercises ?? [],
        stretches: data.stretches ?? []
    };
});