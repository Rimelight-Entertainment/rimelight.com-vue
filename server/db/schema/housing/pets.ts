import { pgTable, text, jsonb } from "drizzle-orm/pg-core"
import { user } from "../auth/auth"
import { id, timestamps } from "rimelight-components/db"

export type PetHistoryType = "vet" | "vaccine" | "medication" | "other"

export type PetHistoryEntry = {
  id: string
  date: string
  type: PetHistoryType
  title: string
  notes?: string
}

export type Pet = {
  id: string
  name: string
  species: string
  breed?: string
  dateOfBirth?: string
  adoptionDate?: string
  weight?: number
  weightUnit?: string
  microchipId?: string
  history: PetHistoryEntry[]
}

export type PetsData = {
  pets: Pet[]
}

export const pets = pgTable("pets", {
  id: id.primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  data: jsonb("data")
    .$type<PetsData>()
    .default({
      pets: []
    })
    .notNull(),
  ...timestamps
})

export type PetEntry = typeof pets.$inferSelect
