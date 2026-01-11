import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/auth";
import { id, timestamps } from "rimelight-components/db";

export type GroceryStore = {
    id: string;
    name: string;
    color?: string;
};

export type GroceryItem = {
    id: string;
    name: string;
    lastPrice?: number;
    amount: number;
    unit?: string; // e.g. "kg", "units", "packs"
    brand?: string;
    storeId?: string; // references a store.id
    isBought: boolean;
    stockStatus: 'in-stock' | 'low' | 'out-of-stock';
};

export type GroceryCategory = {
    id: string;
    name: string;
    items: GroceryItem[];
};

export type GroceriesData = {
    stores: GroceryStore[];
    categories: GroceryCategory[];
};

export const groceries = pgTable("groceries", {
    id: id.primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    data: jsonb("data").$type<GroceriesData>().default({
        stores: [],
        categories: []
    }).notNull(),
    ...timestamps
});

export type GroceryEntry = typeof groceries.$inferSelect;
