import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);
    if (!formData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No file uploaded',
        });
    }

    const file = formData.find((item) => item.name === 'file');
    if (!file || !file.data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No file found in form data',
        });
    }

    const filename = file.filename || 'unnamed.pdf';
    const contentType = file.type || 'application/octet-stream';
    const extension = filename.split('.').pop();
    const id = uuidv4();
    const key = `music/repertoire/${id}.${extension}`;

    // Access R2 bucket via the binding name 'BLOB'
    const runtimeConfig = useRuntimeConfig();
    const { BLOB } = event.context.cloudflare?.env || {};

    if (!BLOB) {
        throw createError({
            statusCode: 500,
            statusMessage: 'R2 binding (BLOB) not found',
        });
    }

    try {
        await BLOB.put(key, file.data, {
            httpMetadata: { contentType },
            customMetadata: {
                originalName: filename,
                id: id
            }
        });

        // The public URL depends on your R2 bucket setup (custom domain or cloudflare access)
        // For now, we'll return the key and assume a public URL structure or proxy
        // Usually it's https://bucket-name.account-id.r2.cloudflarestorage.com/key
        // Or if you have a custom domain/worker proxy:
        const url = `/api/music/file/${key}`; // We'll create a proxy route for this

        return {
            id,
            name: filename,
            url,
            key,
            size: file.data.length,
            type: contentType
        };
    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Upload failed: ${e.message}`,
        });
    }
});
