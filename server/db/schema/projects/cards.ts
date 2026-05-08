import { pgTable, text, integer, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { list } from "./lists";
import { id, timestamps } from "rimelight-components/db";
import { relations } from "drizzle-orm";

export const card = pgTable("kanban_card", {
  id: id.primaryKey(),
  listId: uuid("list_id")
    .notNull()
    .references(() => list.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  dueDate: timestamp("due_date"),
  customFields: jsonb("custom_fields").$type<Record<string, any>>().default({}),
  ...timestamps,
});

export type Card = typeof card.$inferSelect;

export const cardRelations = relations(card, ({ one }) => ({
  list: one(list, {
    fields: [card.listId],
    references: [list.id],
  }),
}));
