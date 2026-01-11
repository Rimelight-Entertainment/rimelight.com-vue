import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/auth";
import { id, timestamps } from "rimelight-components/db";

// Types for the JSON structure
export type RoutineItem = {
    id: string;
    name: string;
};

export type RoutineCategory = {
    id: string;
    name: string;
    items: RoutineItem[];
};

export type Exercise = {
    id: string;
    name: string;
    bpm: number | null;
    targetBpm?: number | null;
};

export type Attachment = {
    id: string;
    name: string;
    url: string;
    size?: number;
    type?: string;
};

export type RepertoireItem = {
    id: string;
    title: string;
    composer?: string; // or artist
    status: string; // e.g., "New", "Learning", "Polishing", "Completed"
    difficulty: number; // 1-5
    attachments?: Attachment[];
};

export type DjMix = {
    id: string;
    name: string;
    duration: string; // e.g. "1:00:00"
    genre: string;
    description?: string;
};

export type MusicData = {
    piano: {
        routine: RoutineCategory[];
        exercises: Exercise[];
        repertoire: RepertoireItem[];
        // We can store global custom states here if we want them to be user-editable
        repertoireStates: string[];
        repertoireComposers: string[];
    };
    guitar: {
        routine: RoutineCategory[];
        exercises: Exercise[];
        repertoire: RepertoireItem[];
        repertoireStates: string[];
        repertoireComposers: string[];
    };
    dj: {
        routine: RoutineCategory[];
        exercises: Exercise[];
        mixes: DjMix[];
        djGenres: string[];
    };
};

export const music = pgTable("music", {
    id: id.primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    // specific music data structure
    data: jsonb("data").$type<MusicData>().default({
        piano: { routine: [], exercises: [], repertoire: [], repertoireStates: [], repertoireComposers: [] },
        guitar: { routine: [], exercises: [], repertoire: [], repertoireStates: [], repertoireComposers: [] },
        dj: { routine: [], exercises: [], mixes: [], djGenres: [] }
    }).notNull(),
    ...timestamps
});

export type MusicEntry = typeof music.$inferSelect;
