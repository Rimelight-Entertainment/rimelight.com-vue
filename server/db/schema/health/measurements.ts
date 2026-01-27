import { pgTable, text, jsonb } from "drizzle-orm/pg-core"
import { user } from "../auth/auth"
import { id, timestamps } from "rimelight-components/db"

export type MeasurementValue = {
  month: number // 0-11
  value: number | string
}

export type Measurement = {
  id: string
  name: string
  unit: string
  values: {
    [year: number]: MeasurementValue[]
  }
}

export type MeasurementsData = {
  measurements: Measurement[]
}

export const measurements = pgTable("measurements", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  data: jsonb("data").$type<MeasurementsData>().default({ measurements: [] }).notNull(),
  ...timestamps
})

export type MeasurementsEntry = typeof measurements.$inferSelect
