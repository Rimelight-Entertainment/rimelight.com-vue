import { eq } from "drizzle-orm"
import { db, pages } from "../../../db"
import { getUserSession } from "~~/server/utils/session"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")
    const body = await readBody(event)
    const session = await getUserSession(event)

    // 1. Validation & Security
    if (!id) throw createError({ statusCode: 400, statusMessage: "Missing ID" })

    const isAuthorized = session?.user?.role === "owner" || session?.user?.role === "member"
    if (!isAuthorized) {
        throw createError({ statusCode: 403, statusMessage: "Unauthorized" })
    }

    const updateData = {
        slug: body.slug,
        title: body.title,
        description: body.description,
        image: body.image,
        tags: body.tags,
        authorIds: body.authorIds,
        posted_at: body.posted_at ? new Date(body.posted_at) : null,
        updatedAt: new Date(),
        content: {
            properties: body.properties || {},
            blocks: body.blocks || []
        }
    }

    try {
        const [updatedPage] = await db.update(pages).set(updateData).where(eq(pages.id, id)).returning()

        if (!updatedPage) {
            throw createError({ statusCode: 404, statusMessage: "Page not found" })
        }

        return {
            ...updatedPage,
            blocks: updatedPage.content.blocks,
            properties: updatedPage.content.properties
        }
    } catch (error: any) {
        console.error("Update Error:", error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to update page"
        })
    }
})