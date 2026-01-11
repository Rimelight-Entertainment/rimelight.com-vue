import { db } from "../../db";
import { watchlist } from "../../db";
import { eq } from "drizzle-orm";
import { getUserSession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const existing = await db
        .select()
        .from(watchlist)
        .where(eq(watchlist.userId, session.user.id))
        .limit(1);

    if (existing.length === 0) {
        return {
            movies: [],
            series: [],
            books: []
        };
    }

    return existing[0]!.data;
});
