import { db } from "../../db";
import { groceries, type GroceriesData } from "../../db";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const addCategorySchema = z.object({
    action: z.literal("addCategory"),
    name: z.string().min(1),
});

const deleteCategorySchema = z.object({
    action: z.literal("deleteCategory"),
    catId: z.string(),
});

const addStoreSchema = z.object({
    action: z.literal("addStore"),
    name: z.string().min(1),
    color: z.string().optional(),
});

const deleteStoreSchema = z.object({
    action: z.literal("deleteStore"),
    storeId: z.string(),
});

const addItemSchema = z.object({
    action: z.literal("addItem"),
    catId: z.string(),
    item: z.object({
        name: z.string().min(1),
        lastPrice: z.number().optional(),
        amount: z.number(),
        unit: z.string().optional(),
        brand: z.string().optional(),
        storeId: z.string().optional(),
        isBought: z.boolean().default(false),
        stockStatus: z.enum(['in-stock', 'low', 'out-of-stock']).default('out-of-stock'),
    }),
});

const updateItemSchema = z.object({
    action: z.literal("updateItem"),
    catId: z.string(),
    itemId: z.string(),
    item: z.record(z.string(), z.any()),
});

const deleteItemSchema = z.object({
    action: z.literal("deleteItem"),
    catId: z.string(),
    itemId: z.string(),
});

const toggleBoughtSchema = z.object({
    action: z.literal("toggleBought"),
    catId: z.string(),
    itemId: z.string(),
});

const reorderCategoriesSchema = z.object({
    action: z.literal("reorderCategories"),
    categories: z.array(z.custom<any>()),
});

const updateSchema = z.discriminatedUnion("action", [
    addCategorySchema,
    deleteCategorySchema,
    addStoreSchema,
    deleteStoreSchema,
    addItemSchema,
    updateItemSchema,
    deleteItemSchema,
    toggleBoughtSchema,
    reorderCategoriesSchema,
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
        .from(groceries)
        .where(eq(groceries.userId, session.user.id))
        .limit(1);

    let data: GroceriesData = { stores: [], categories: [] };
    let trackerId = "";

    if (existing.length === 0) {
        const [newTracker] = await db.insert(groceries).values({
            userId: session.user.id,
            data: { stores: [], categories: [] }
        }).returning();
        if (!newTracker) {
            throw createError({ statusCode: 500, statusMessage: "Failed to initialize groceries tracker" });
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
        data.categories.push({
            id: uuidv4(),
            name: payload.name,
            items: []
        });
    } else if (action === "deleteCategory") {
        const payload = body.data as z.infer<typeof deleteCategorySchema>;
        data.categories = data.categories.filter(c => c.id !== payload.catId);
    } else if (action === "addStore") {
        const payload = body.data as z.infer<typeof addStoreSchema>;
        data.stores.push({
            id: uuidv4(),
            name: payload.name,
            color: payload.color
        });
    } else if (action === "deleteStore") {
        const payload = body.data as z.infer<typeof deleteStoreSchema>;
        data.stores = data.stores.filter(s => s.id !== payload.storeId);
        // Also clear storeId from items if that store was deleted
        data.categories.forEach(cat => {
            cat.items.forEach(item => {
                if (item.storeId === payload.storeId) delete item.storeId;
            });
        });
    } else if (action === "addItem") {
        const payload = body.data as z.infer<typeof addItemSchema>;
        const cat = data.categories.find(c => c.id === payload.catId);
        if (cat) {
            cat.items.push({
                ...payload.item,
                id: uuidv4()
            } as any);
        }
    } else if (action === "updateItem") {
        const payload = body.data as z.infer<typeof updateItemSchema>;
        const cat = data.categories.find(c => c.id === payload.catId);
        if (cat) {
            const idx = cat.items.findIndex(i => i.id === payload.itemId);
            if (idx > -1) {
                cat.items[idx] = { ...cat.items[idx], ...payload.item } as any;
            }
        }
    } else if (action === "deleteItem") {
        const payload = body.data as z.infer<typeof deleteItemSchema>;
        const cat = data.categories.find(c => c.id === payload.catId);
        if (cat) {
            cat.items = cat.items.filter(i => i.id !== payload.itemId);
        }
    } else if (action === "toggleBought") {
        const payload = body.data as z.infer<typeof toggleBoughtSchema>;
        const cat = data.categories.find(c => c.id === payload.catId);
        if (cat) {
            const item = cat.items.find(i => i.id === payload.itemId);
            if (item) {
                item.isBought = !item.isBought;
                // Optional: update stockStatus if bought? Usually bought means in-stock.
                if (item.isBought) item.stockStatus = 'in-stock';
            }
        }
    } else if (action === "reorderCategories") {
        const payload = body.data as z.infer<typeof reorderCategoriesSchema>;
        data.categories = payload.categories;
    }

    // Save back
    await db
        .update(groceries)
        .set({ data })
        .where(eq(groceries.id, trackerId));

    return data;
});
