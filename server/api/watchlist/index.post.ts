import { db } from "../../db";
import { watchlist, type WatchlistData } from "../../db";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const sectionSchema = z.enum(["movies", "series", "books"]);

const addCategorySchema = z.object({
    action: z.literal("addCategory"),
    section: sectionSchema,
    name: z.string().min(1),
});

const deleteCategorySchema = z.object({
    action: z.literal("deleteCategory"),
    section: sectionSchema,
    catId: z.string(),
});

const reorderCategoriesSchema = z.object({
    action: z.literal("reorderCategories"),
    section: sectionSchema,
    categories: z.array(z.custom<any>()),
});

const addItemSchema = z.object({
    action: z.literal("addItem"),
    section: sectionSchema,
    catId: z.string(),
    item: z.object({
        title: z.string().min(1),
        director: z.string().optional(),
        author: z.string().optional(),
        genre: z.string().optional(),
        duration: z.string().optional(),
        year: z.number().optional(),
        rating: z.number().optional(),
        status: z.enum(['planned', 'in-progress', 'completed', 'dropped']),
        notes: z.string().optional(),
        seasons: z.number().optional(),
        episodes: z.number().optional(),
        pages: z.number().optional(),
    }),
});

const updateItemSchema = z.object({
    action: z.literal("updateItem"),
    section: sectionSchema,
    catId: z.string(),
    itemId: z.string(),
    item: z.record(z.string(), z.any()),
});

const deleteItemSchema = z.object({
    action: z.literal("deleteItem"),
    section: sectionSchema,
    catId: z.string(),
    itemId: z.string(),
});

const reorderItemsSchema = z.object({
    action: z.literal("reorderItems"),
    section: sectionSchema,
    catId: z.string(),
    items: z.array(z.custom<any>()),
});

const updateSchema = z.discriminatedUnion("action", [
    addCategorySchema,
    deleteCategorySchema,
    reorderCategoriesSchema,
    addItemSchema,
    updateItemSchema,
    deleteItemSchema,
    reorderItemsSchema,
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

    const { action, section } = body.data;

    const existing = await db
        .select()
        .from(watchlist)
        .where(eq(watchlist.userId, session.user.id))
        .limit(1);

    let data: WatchlistData = { movies: [], series: [], books: [] };
    let trackerId = "";

    if (existing.length === 0) {
        const [newTracker] = await db.insert(watchlist).values({
            userId: session.user.id,
            data: { movies: [], series: [], books: [] }
        }).returning();
        if (!newTracker) {
            throw createError({ statusCode: 500, statusMessage: "Failed to initialize watchlist" });
        }
        data = newTracker.data;
        trackerId = newTracker.id;
    } else {
        const row = existing[0]!;
        data = row.data;
        trackerId = row.id;
    }

    // Apply mutations
    if (action === "addCategory") {
        const payload = body.data as z.infer<typeof addCategorySchema>;
        data[payload.section].push({
            id: uuidv4(),
            name: payload.name,
            items: []
        });
    } else if (action === "deleteCategory") {
        const payload = body.data as z.infer<typeof deleteCategorySchema>;
        data[payload.section] = data[payload.section].filter(c => c.id !== payload.catId);
    } else if (action === "reorderCategories") {
        const payload = body.data as z.infer<typeof reorderCategoriesSchema>;
        data[payload.section] = payload.categories;
    } else if (action === "addItem") {
        const payload = body.data as z.infer<typeof addItemSchema>;
        const cat = data[payload.section].find(c => c.id === payload.catId);
        if (cat) {
            cat.items.push({
                ...payload.item,
                id: uuidv4()
            } as any);
        }
    } else if (action === "updateItem") {
        const payload = body.data as z.infer<typeof updateItemSchema>;
        const cat = data[payload.section].find(c => c.id === payload.catId);
        if (cat) {
            const idx = cat.items.findIndex(i => i.id === payload.itemId);
            if (idx > -1) {
                cat.items[idx] = { ...cat.items[idx], ...payload.item } as any;
            }
        }
    } else if (action === "deleteItem") {
        const payload = body.data as z.infer<typeof deleteItemSchema>;
        const cat = data[payload.section].find(c => c.id === payload.catId);
        if (cat) {
            cat.items = cat.items.filter(i => i.id !== payload.itemId);
        }
    } else if (action === "reorderItems") {
        const payload = body.data as z.infer<typeof reorderItemsSchema>;
        const cat = data[payload.section].find(c => c.id === payload.catId);
        if (cat) {
            cat.items = payload.items;
        }
    }

    // Save back
    await db
        .update(watchlist)
        .set({ data })
        .where(eq(watchlist.id, trackerId));

    return data;
});
