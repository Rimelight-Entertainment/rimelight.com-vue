import {relations} from "drizzle-orm"
import {pgTable, text, uuid} from "drizzle-orm/pg-core"
import {id, timestamps} from "rimelight-components/db"
import {user} from "../auth/auth"
import {note_noteLabel} from "./note_noteLabel"

export const noteLabel = pgTable("noteLabel", {
  id: id.primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ...timestamps
})

export type Label = typeof noteLabel.$inferSelect

export const labelRelations = relations(noteLabel, ({ many }) => ({
  noteLabels: many(note_noteLabel)
}))
