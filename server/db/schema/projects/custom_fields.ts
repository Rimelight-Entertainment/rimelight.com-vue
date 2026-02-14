import { pgTable, text, jsonb, uuid } from "drizzle-orm/pg-core";
import { board } from "./boards";
import { id, timestamps } from "rimelight-components/db";
import { relations } from "drizzle-orm";

export const customFieldDefinition = pgTable("kanban_custom_field", {
  id: id.primaryKey(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["TEXT", "NUMBER", "DATE", "SELECT", "CHECKBOX", "URL"] }).notNull(),
  options: jsonb("options").$type<{ label: string; value: string; color?: string }[]>().default([]),
  ...timestamps,
});

export type CustomFieldDefinition = typeof customFieldDefinition.$inferSelect;

export const customFieldDefinitionRelations = relations(customFieldDefinition, ({ one }) => ({
  board: one(board, {
    fields: [customFieldDefinition.boardId],
    references: [board.id],
  }),
}));
