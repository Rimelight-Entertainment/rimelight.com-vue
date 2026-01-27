import { pgTable, text, boolean } from "drizzle-orm/pg-core"
import { user } from "../auth/auth"
import { id, timestamps } from "rimelight-components/db"
import { relations } from "drizzle-orm"
import { list } from "./lists"
import { customFieldDefinition } from "./custom_fields"

export const board = pgTable("kanban_board", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isArchived: boolean("is_archived").default(false).notNull(),
  ...timestamps
})

export type Board = typeof board.$inferSelect

export const boardRelations = relations(board, ({ many }) => ({
  lists: many(list),
  customFields: many(customFieldDefinition)
}))
