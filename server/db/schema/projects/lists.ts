import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { board } from "./boards";
import { id, timestamps } from "rimelight-components/db";
import { relations } from "drizzle-orm";
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
