export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const key = query.key as string;

    if (!key) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing file key',
        });
    }

    const { BLOB } = event.context.cloudflare?.env || {};

    if (!BLOB) {
        throw createError({
            statusCode: 500,
            statusMessage: 'R2 binding (BLOB) not found',
        });
    }

    try {
        await BLOB.delete(key);
        return { success: true };
    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Deletion failed: ${e.message}`,
        });
    }
});
