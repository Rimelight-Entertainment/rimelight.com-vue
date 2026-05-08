import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { id, timestamps } from "rimelight-components/db";
import {
  type Block,
  type Localized,
  type PageType,
  type RegisterPageTypes,
} from "rimelight-components/types";

export const pages = pgTable("pages", {
  id: id.primaryKey(),
  slug: text("slug").notNull().unique(),
  type: text("type").$type<PageType>().notNull(),
  title: jsonb("title").$type<Localized>().notNull(),
  description: jsonb("description").$type<Localized>(),
  tags: jsonb("tags").$type<Localized<string>[]>().default([]).notNull(),
  authorIds: jsonb("author_ids").$type<string[]>().default([]),
  content: jsonb("content")
    .$type<{
      blocks: Block[];
      properties: RegisterPageTypes[PageType];
    }>()
    .notNull(),
  postedAt: timestamp("posted_at", { withTimezone: true }),
  ...timestamps,
});
