import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  const cloudflare = (event.context as any).cloudflare;
  if (!cloudflare) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cloudflare context not found",
    });
  }

  const { env } = cloudflare;
  const BLOB = env.BLOB as any;

  if (!BLOB) {
    throw createError({
      statusCode: 500,
      statusMessage: "R2 bucket (BLOB) not bound",
    });
  }

  // Force no-cache on the API response itself
  event.node.res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  event.node.res.setHeader("Pragma", "no-cache");
  event.node.res.setHeader("Expires", "0");

  let allObjects: any[] = [];
  let truncated = true;
  let cursor: string | undefined;

  while (truncated) {
    const list: any = await BLOB.list({ cursor });
    allObjects.push(...list.objects);
    truncated = list.truncated;
    cursor = list.cursor;
  }

  // Deduplicate by key just in case R2 pagination overlaps
  const uniqueObjectsMap = new Map();
  allObjects.forEach((obj) => {
    uniqueObjectsMap.set(obj.key, obj);
  });

  return Array.from(uniqueObjectsMap.values()).map((obj: any) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
    contentType: obj.httpMetadata?.contentType,
    etag: obj.httpEtag,
  }));
});
