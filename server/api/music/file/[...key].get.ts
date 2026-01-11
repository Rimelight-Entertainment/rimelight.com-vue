export default defineEventHandler(async (event) => {
    const key = event.context.params?.key;

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

    const object = await BLOB.get(key);

    if (object === null) {
        throw createError({
            statusCode: 404,
            statusMessage: 'File not found',
        });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new Response(object.body, {
        headers,
    });
});
