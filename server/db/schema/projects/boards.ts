import { relations, sql } from "drizzle-orm";
import { boolean, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

const id = uuid("id")
  .default(sql`uuidv7()`)
  .notNull();

const timestamps = {
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

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
