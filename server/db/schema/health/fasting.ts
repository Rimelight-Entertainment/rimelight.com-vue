import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { user } from "../auth/auth"
import { id, timestamps } from "rimelight-components/db"

export const fasting = pgTable("fasting", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  originalEndTime: timestamp("original_end_time"),
  isActive: boolean("is_active").default(true).notNull(),
  ...timestamps
})

export type FastingEntry = typeof fasting.$inferSelect
export type NewFastingEntry = typeof fasting.$inferInsert
