import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/auth";
import { id, timestamps } from "rimelight-components/db";

export type WatchlistItem = {
    id: string;
    title: string;
    description?: string;
    director?: string; // For movies/series
    author?: string; // For books
    genre?: string;
    duration?: string; // e.g. "2h 15m"
    year?: number;
    rating?: number; // 1-10
    status: 'planned' | 'in-progress' | 'completed' | 'dropped';
    notes?: string;
    // For series
    seasons?: number;
    episodes?: number;
    // For books
    pages?: number;
};

export type WatchlistCategory = {
    id: string;
    name: string;
    items: WatchlistItem[];
};

export type WatchlistData = {
    movies: WatchlistCategory[];
    series: WatchlistCategory[];
    books: WatchlistCategory[];
};

export const watchlist = pgTable("watchlist", {
    id: id.primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    data: jsonb("data").$type<WatchlistData>().default({
        movies: [],
        series: [],
        books: []
    }).notNull(),
    ...timestamps
});

export type WatchlistEntry = typeof watchlist.$inferSelect;
