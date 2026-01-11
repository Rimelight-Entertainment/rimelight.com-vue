import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/auth"
import { id, timestamps } from "rimelight-components/db"

export type Habit = {
  id: string; // uuid
  name: string;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
};

export type HabitCategory = {
  id: string;
  name: string;
  habits: Habit[];
};

export type HabitTrackerData = {
  years: {
    year: number;
    categories: HabitCategory[];
  }[];
};



export const habits = pgTable("habits", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  data: jsonb("data").$type<HabitTrackerData>().default({ years: [] }).notNull(),
  ...timestamps
});

export type HabitTracker = typeof habits.$inferSelect;
