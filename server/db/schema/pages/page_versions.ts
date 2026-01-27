import { pgTable, text, jsonb, timestamp, uuid } from "drizzle-orm/pg-core"
import {
    type PageType,
    type Block,
    type Localized,
    type RegisterPageTypes
} from "rimelight-components/types"
import { id, timestamps } from "rimelight-components/db"
import { pages } from "./pages"
import { relations } from "drizzle-orm"

export type PageVersionStatus = "pending" | "approved" | "rejected"

export const pageVersions = pgTable("page_versions", {
    id: id.primaryKey(),
    pageId: uuid("page_id")
        .notNull()
        .references(() => pages.id, { onDelete: "cascade" }),
    status: text("status").$type<PageVersionStatus>().default("pending").notNull(),
    slug: text("slug").notNull(),
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
    createdBy: text("created_by").notNull(),
    approvedBy: text("approved_by"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    ...timestamps
})

export const pageVersionsRelations = relations(pageVersions, ({ one }) => ({
    page: one(pages, {
        fields: [pageVersions.pageId],
        references: [pages.id]
    })
}))
