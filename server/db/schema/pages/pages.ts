import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core"
import {
  type PageType,
  type Block,
  type Localized,
  type RegisterPageTypes
} from "rimelight-components/types"
import { id, timestamps } from "rimelight-components/db"

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
      blocks: Block[]
      properties: RegisterPageTypes[PageType]
    }>()
    .notNull(),
  posted_at: timestamp("posted_at", { withTimezone: true }),
  ...timestamps
})
