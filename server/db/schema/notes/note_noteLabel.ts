import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { note } from "./note"
import { noteLabel } from "./noteLabel"
import { relations } from "drizzle-orm"

export const note_noteLabel = pgTable(
  "note_noteLabel",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => note.id, { onDelete: "cascade" }),
    labelId: uuid("label_id")
      .notNull()
      .references(() => noteLabel.id, { onDelete: "cascade" })
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.labelId] })
  })
)

export const note_noteLabelRelations = relations(note_noteLabel, ({ one }) => ({
  note: one(note, {
    fields: [note_noteLabel.noteId],
    references: [note.id]
  }),
  label: one(noteLabel, {
    fields: [note_noteLabel.labelId],
    references: [noteLabel.id]
  })
}))
