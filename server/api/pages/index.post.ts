import { db, pages } from "~~/server/db"
import { getUserSession } from "~~/server/utils/session"
import { v7 as uuidv7 } from "uuid"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const session = await getUserSession(event)

    const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "member"
    if (!isAuthorized) {
        throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
    }

    const newPage = {
        id: uuidv7(),
        type: body.type,
        slug: body.slug,
        title: body.title,
        description: body.description || {},
        authorIds: [session.user.id],
        content: {
            properties: body.properties || {},
            blocks: body.blocks || []
        }
    }

    try {
        const result = await db.insert(pages).values(newPage).returning()
        const inserted = result[0]

        // Defensive check to satisfy TypeScript and handle potential DB edge cases
        if (!inserted) {
            throw createError({
                statusCode: 500,
                statusMessage: "Database failed to return the created record."
            })
        }

        return {
            ...inserted,
            blocks: inserted.content.blocks,
            properties: inserted.content.properties
        }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to create page"
        })
    }
})