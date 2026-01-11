import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { user } from "../auth/auth"
import { noteLabel } from "./noteLabel"
import { note_noteLabel } from "./note_noteLabel"
import { relations } from "drizzle-orm";
import { id, timestamps } from "rimelight-components/db"

export const note = pgTable("note", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content"),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  ...timestamps
});

export type Note = typeof note.$inferSelect & {
  labels: Array<
    typeof note_noteLabel.$inferSelect & {
      label: typeof noteLabel.$inferSelect;
    }
  >;
};

export const noteRelations = relations(note, ({ many }) => ({
  noteLabels: many(note_noteLabel)
}));
