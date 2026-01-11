import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth/auth"
import { note_noteLabel } from "./note_noteLabel"
import { id, timestamps } from "rimelight-components/db"

export const noteLabel = pgTable("noteLabel", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ...timestamps
});

export type Label = typeof noteLabel.$inferSelect;

export const labelRelations = relations(noteLabel, ({ many }) => ({
  noteLabels: many(note_noteLabel)
}));
