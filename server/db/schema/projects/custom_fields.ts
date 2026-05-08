import { relations, sql } from "drizzle-orm";
import { pgTable, text, jsonb, uuid, timestamp } from "drizzle-orm/pg-core";
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
