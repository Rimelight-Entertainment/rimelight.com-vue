import { relations, sql } from "drizzle-orm";
import { pgTable, text, integer, uuid, timestamp } from "drizzle-orm/pg-core";
import { board } from "./boards";

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

import { card } from "./cards";

export const list = pgTable("kanban_list", {
  id: id.primaryKey(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
  ...timestamps,
});

export type List = typeof list.$inferSelect;

export const listRelations = relations(list, ({ one, many }) => ({
  board: one(board, {
    fields: [list.boardId],
    references: [board.id],
  }),
  cards: many(card),
}));
