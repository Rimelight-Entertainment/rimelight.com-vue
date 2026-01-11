import { db } from "../../db";
import { habits, type HabitTrackerData } from "../../db";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";
import { z } from "zod";
import { v7 as uuidv7 } from "uuid";

// Define schemas for actions
const addYearSchema = z.object({
    action: z.literal("addYear"),
    year: z.number(),
});

const addCategorySchema = z.object({
    action: z.literal("addCategory"),
    year: z.number(),
    name: z.string().min(1),
});

const deleteCategorySchema = z.object({
    action: z.literal("deleteCategory"),
    year: z.number(),
    catId: z.string(),
});

const reorderCategoriesSchema = z.object({
    action: z.literal("reorderCategories"),
    year: z.number(),
    categories: z.array(z.custom<any>()),
});

const addHabitSchema = z.object({
    action: z.literal("addHabit"),
    year: z.number(),
    catId: z.string(),
    name: z.string().min(1),
});

const toggleDateSchema = z.object({
    action: z.literal("toggleDate"),
    year: z.number(),
    catId: z.string(),
    habitId: z.string(),
    date: z.string(), // ISO Date YYYY-MM-DD
});

const deleteHabitSchema = z.object({
    action: z.literal("deleteHabit"),
    year: z.number(),
    catId: z.string(),
    habitId: z.string(),
});

const reorderHabitsSchema = z.object({
    action: z.literal("reorderHabits"),
    year: z.number(),
    catId: z.string(),
    habits: z.array(z.custom<any>()) // accepting the full array of habits to replace
});

const updateSchema = z.discriminatedUnion("action", [
    addYearSchema,
    addCategorySchema,
    deleteCategorySchema,
    reorderCategoriesSchema,
    addHabitSchema,
    toggleDateSchema,
    deleteHabitSchema,
    reorderHabitsSchema,
]);

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const body = await readValidatedBody(event, (b) => updateSchema.safeParse(b));

    if (!body.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid Request",
            data: body.error,
        });
    }

    const { action } = body.data;

    const existing = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, session.user.id))
        .limit(1);

    let trackerData: HabitTrackerData = { years: [] };
    let trackerId = "";

    if (existing.length === 0) {
        const [newTracker] = await db.insert(habits).values({
            userId: session.user.id,
            data: { years: [] }
        }).returning();
        if (!newTracker) {
            throw createError({ statusCode: 500, statusMessage: "Failed to initialize habit tracker" });
        }
        trackerData = newTracker.data;
        trackerId = newTracker.id;
    } else {
        const trackerRow = existing[0]!;
        trackerData = trackerRow.data;
        trackerId = trackerRow.id;
    }

    // Apply mutations
    if (action === "addYear") {
        const payload = body.data as z.infer<typeof addYearSchema>;
        if (!trackerData.years.find((y: any) => y.year === payload.year)) {
            trackerData.years.push({
                year: payload.year,
                categories: []
            });
            trackerData.years.sort((a: any, b: any) => a.year - b.year);
        }
    } else if (action === "addCategory") {
        const payload = body.data as z.infer<typeof addCategorySchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            yearObj.categories.push({
                id: uuidv7(),
                name: payload.name,
                habits: []
            });
        }
    } else if (action === "deleteCategory") {
        const payload = body.data as z.infer<typeof deleteCategorySchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            yearObj.categories = yearObj.categories.filter(c => c.id !== payload.catId);
        }
    } else if (action === "reorderCategories") {
        const payload = body.data as z.infer<typeof reorderCategoriesSchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            yearObj.categories = payload.categories;
        }
    } else if (action === "addHabit") {
        const payload = body.data as z.infer<typeof addHabitSchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            const cat = yearObj.categories.find(c => c.id === payload.catId);
            if (cat) {
                cat.habits.push({
                    id: uuidv7(),
                    name: payload.name,
                    completedDates: []
                });
            }
        }
    } else if (action === "toggleDate") {
        const payload = body.data as z.infer<typeof toggleDateSchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            const cat = yearObj.categories.find(c => c.id === payload.catId);
            if (cat) {
                const habit = cat.habits.find((h: any) => h.id === payload.habitId);
                if (habit) {
                    const idx = habit.completedDates.indexOf(payload.date);
                    if (idx > -1) {
                        habit.completedDates.splice(idx, 1);
                    } else {
                        habit.completedDates.push(payload.date);
                    }
                }
            }
        }
    } else if (action === "deleteHabit") {
        const payload = body.data as z.infer<typeof deleteHabitSchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            const cat = yearObj.categories.find(c => c.id === payload.catId);
            if (cat) {
                cat.habits = cat.habits.filter((h: any) => h.id !== payload.habitId);
            }
        }
    } else if (action === "reorderHabits") {
        const payload = body.data as z.infer<typeof reorderHabitsSchema>;
        const yearObj = trackerData.years.find((y: any) => y.year === payload.year);
        if (yearObj) {
            const cat = yearObj.categories.find(c => c.id === payload.catId);
            if (cat) {
                cat.habits = payload.habits;
            }
        }
    }

    // Save back
    await db
        .update(habits)
        .set({ data: trackerData })
        .where(eq(habits.id, trackerId));

    return trackerData;
});
