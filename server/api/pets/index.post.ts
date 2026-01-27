import { db } from "../../db"
import { pets, type PetsData } from "../../db"
import { eq } from "drizzle-orm"
import { getUserSession } from "~~/server/utils/session"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

const addPetSchema = z.object({
  action: z.literal("addPet"),
  pet: z.object({
    name: z.string().min(1),
    species: z.string().min(1),
    breed: z.string().optional(),
    dateOfBirth: z.string().optional(),
    adoptionDate: z.string().optional(),
    weight: z.number().optional(),
    weightUnit: z.string().optional(),
    microchipId: z.string().optional()
  })
})

const updatePetSchema = z.object({
  action: z.literal("updatePet"),
  petId: z.string(),
  pet: z.record(z.string(), z.any())
})

const deletePetSchema = z.object({
  action: z.literal("deletePet"),
  petId: z.string()
})

const addHistoryEntrySchema = z.object({
  action: z.literal("addHistoryEntry"),
  petId: z.string(),
  entry: z.object({
    date: z.string(),
    type: z.enum(["vet", "vaccine", "medication", "other"]),
    title: z.string().min(1),
    notes: z.string().optional()
  })
})

const deleteHistoryEntrySchema = z.object({
  action: z.literal("deleteHistoryEntry"),
  petId: z.string(),
  entryId: z.string()
})

const updateSchema = z.discriminatedUnion("action", [
  addPetSchema,
  updatePetSchema,
  deletePetSchema,
  addHistoryEntrySchema,
  deleteHistoryEntrySchema
])

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const body = await readValidatedBody(event, (b) => updateSchema.safeParse(b))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Request",
      data: body.error
    })
  }

  const { action } = body.data

  const existing = await db.select().from(pets).where(eq(pets.userId, session.user.id)).limit(1)

  let data: PetsData = { pets: [] }
  let trackerId = ""

  if (existing.length === 0) {
    const [newTracker] = await db
      .insert(pets)
      .values({
        userId: session.user.id,
        data: { pets: [] }
      })
      .returning()
    if (!newTracker) {
      throw createError({ statusCode: 500, statusMessage: "Failed to initialize pets tracker" })
    }
    data = newTracker.data
    trackerId = newTracker.id
  } else {
    const row = existing[0]!
    data = row.data
    trackerId = row.id
  }

  // Apply mutations
  if (action === "addPet") {
    const payload = body.data as z.infer<typeof addPetSchema>
    data.pets.push({
      ...payload.pet,
      id: uuidv4(),
      history: []
    })
  } else if (action === "updatePet") {
    const payload = body.data as z.infer<typeof updatePetSchema>
    const petIdx = data.pets.findIndex((p) => p.id === payload.petId)
    if (petIdx > -1) {
      const currentPet = data.pets[petIdx]!
      data.pets[petIdx] = {
        ...currentPet,
        ...payload.pet,
        id: currentPet.id,
        name: (payload.pet.name as string) || currentPet.name,
        species: (payload.pet.species as string) || currentPet.species,
        history: currentPet.history
      }
    }
  } else if (action === "deletePet") {
    const payload = body.data as z.infer<typeof deletePetSchema>
    data.pets = data.pets.filter((p) => p.id !== payload.petId)
  } else if (action === "addHistoryEntry") {
    const payload = body.data as z.infer<typeof addHistoryEntrySchema>
    const pet = data.pets.find((p) => p.id === payload.petId)
    if (pet) {
      pet.history.push({
        ...payload.entry,
        id: uuidv4()
      })
      // Sort history by date descending
      pet.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  } else if (action === "deleteHistoryEntry") {
    const payload = body.data as z.infer<typeof deleteHistoryEntrySchema>
    const pet = data.pets.find((p) => p.id === payload.petId)
    if (pet) {
      pet.history = pet.history.filter((h) => h.id !== payload.entryId)
    }
  }

  // Save back
  await db.update(pets).set({ data }).where(eq(pets.id, trackerId))

  return data
})
