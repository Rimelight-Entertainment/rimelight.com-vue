import { relations } from "drizzle-orm"
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { id, timestamps } from "rimelight-components/db"
import { user } from "../auth/auth"
import { note_noteLabel } from "./note_noteLabel"
import { noteLabel } from "./noteLabel"

export const note = pgTable("note", {
  id: id.primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content"),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  ...timestamps
})

export type Note = typeof note.$inferSelect & {
  labels: Array<
    typeof note_noteLabel.$inferSelect & {
      label: typeof noteLabel.$inferSelect
    }
  >
}

export const noteRelations = relations(note, ({ many }) => ({
  noteLabels: many(note_noteLabel)
}))
