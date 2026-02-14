import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, timestamps, user } from "rimelight-components/db";
import { customFieldDefinition } from "./custom_fields";
import { list } from "./lists";

export const board = pgTable("kanban_board", {
  id: id.primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isArchived: boolean("is_archived").default(false).notNull(),
  ...timestamps,
});

export type Board = typeof board.$inferSelect;

export const boardRelations = relations(board, ({ many }) => ({
  lists: many(list),
  customFields: many(customFieldDefinition),
}));
