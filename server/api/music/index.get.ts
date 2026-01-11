import { db } from "../../db";
import { music, type MusicData } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";

const defaultData: MusicData = {
    piano: {
        routine: [],
        exercises: [],
        repertoire: [],
        repertoireStates: [],
        repertoireComposers: []
    },
    guitar: {
        routine: [],
        exercises: [],
        repertoire: [],
        repertoireStates: [],
        repertoireComposers: []
    },
    dj: {
        routine: [],
        exercises: [],
        mixes: [],
        djGenres: []
    }
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
        .from(music)
        .where(eq(music.userId, session.user.id))
        .limit(1);

    if (existing.length === 0) {
        // Create initial record
        const [newEntry] = await db.insert(music).values({
            userId: session.user.id,
            data: defaultData
        }).returning();
        if (!newEntry) {
            throw createError({ statusCode: 500, statusMessage: "Failed to create music data" });
        }
        return newEntry.data;
    }

    // Ensure defaults are present if schema evolved (lightweight migration)
    const musicRow = existing[0];
    if (!musicRow) {
        return defaultData; // Fallback
    }
    const data = musicRow.data;
    if (!data.piano) data.piano = defaultData.piano;
    if (!data.guitar) data.guitar = defaultData.guitar;
    if (!data.dj) data.dj = defaultData.dj;
    // deep merge defaults could be better but this is simple enough for now
    if (!data.piano.repertoireStates) data.piano.repertoireStates = [];
    if (!data.guitar.repertoireStates) data.guitar.repertoireStates = [];
    if (!data.piano.repertoireComposers) data.piano.repertoireComposers = [];
    if (!data.guitar.repertoireComposers) data.guitar.repertoireComposers = [];
    if (!data.dj) data.dj = { routine: [], exercises: [], mixes: [], djGenres: [] };
    if (!data.dj.djGenres) data.dj.djGenres = [];

    return data;
});
