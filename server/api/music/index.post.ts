import { db } from "../../db";
import { music } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";
import { z } from "zod";

// --- Schemas ---

const sectionSchema = z.enum(["piano", "dj", "guitar"]);

const updateRoutineSchema = z.object({
    action: z.literal("updateRoutine"),
    section: sectionSchema,
    routine: z.array(z.custom<any>()) // trusting client structure for now, can refine
});

const updateExerciseSchema = z.object({
    action: z.literal("updateExercises"),
    section: sectionSchema,
    exercises: z.array(z.custom<any>())
});

const updateRepertoireSchema = z.object({
    action: z.literal("updateRepertoire"),
    section: sectionSchema.optional(), // Make optional for backward compat if needed, or mandatory
    repertoire: z.array(z.custom<any>())
});

const updateMixesSchema = z.object({
    action: z.literal("updateMixes"),
    mixes: z.array(z.custom<any>())
});

const updateRepertoireStatesSchema = z.object({
    action: z.literal("updateRepertoireStates"),
    section: sectionSchema.optional(),
    states: z.array(z.string())
});

const updateRepertoireComposersSchema = z.object({
    action: z.literal("updateRepertoireComposers"),
    section: sectionSchema.optional(),
    composers: z.array(z.string())
});

const updateDjGenresSchema = z.object({
    action: z.literal("updateDjGenres"),
    genres: z.array(z.string())
});

const musicUpdateSchema = z.discriminatedUnion("action", [
    updateRoutineSchema,
    updateExerciseSchema,
    updateRepertoireSchema,
    updateMixesSchema,
    updateRepertoireStatesSchema,
    updateRepertoireComposersSchema,
    updateDjGenresSchema
]);

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const body = await readValidatedBody(event, (b) => musicUpdateSchema.safeParse(b));

    if (!body.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid Request",
            data: body.error,
        });
    }

    const { action } = body.data;

    // Fetch existing
    const existing = await db
        .select()
        .from(music)
        .where(eq(music.userId, session.user.id))
        .limit(1);

    if (existing.length === 0) {
        throw createError({ statusCode: 404, statusMessage: "Music data not found" });
    }

    const musicRow = existing[0];
    if (!musicRow) {
        throw createError({ statusCode: 404, statusMessage: "Music data not found" });
    }
    const data = musicRow.data;

    // Mutate Data
    if (action === "updateRoutine") {
        const payload = body.data as z.infer<typeof updateRoutineSchema>;
        data[payload.section].routine = payload.routine;
    } else if (action === "updateExercises") {
        const payload = body.data as z.infer<typeof updateExerciseSchema>;
        data[payload.section].exercises = payload.exercises;
    } else if (action === "updateRepertoire") {
        const payload = body.data as z.infer<typeof updateRepertoireSchema>;
        // Default to piano if not specified (though UI should send it)
        const sec = payload.section || "piano";
        if (sec === "piano" || sec === "guitar") {
            data[sec].repertoire = payload.repertoire;
        }
    } else if (action === "updateMixes") {
        const payload = body.data as z.infer<typeof updateMixesSchema>;
        data.dj.mixes = payload.mixes;
    } else if (action === "updateRepertoireStates") {
        const payload = body.data as z.infer<typeof updateRepertoireStatesSchema>;
        const sec = payload.section || "piano";
        if (sec === "piano" || sec === "guitar") {
            data[sec].repertoireStates = payload.states;
        }
    } else if (action === "updateRepertoireComposers") {
        const payload = body.data as z.infer<typeof updateRepertoireComposersSchema>;
        const sec = payload.section || "piano";
        if (sec === "piano" || sec === "guitar") {
            data[sec].repertoireComposers = payload.composers;
        }
    } else if (action === "updateDjGenres") {
        const payload = body.data as z.infer<typeof updateDjGenresSchema>;
        data.dj.djGenres = payload.genres;
    }

    // Save
    await db
        .update(music)
        .set({ data })
        .where(eq(music.id, musicRow.id));

    return data;
});
