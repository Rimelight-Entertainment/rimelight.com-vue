import { eq } from "drizzle-orm"
import { db, pages, pageVersions } from "../../../db"
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

    if (!session?.user?.id) {
        throw createError({ statusCode: 401, statusMessage: "User not authenticated" })
    }

    // 2. Verify page exists
    const [existingPage] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id))
        .limit(1)

    if (!existingPage) {
        throw createError({ statusCode: 404, statusMessage: "Page not found" })
    }

    // 3. Create a new version instead of directly updating
    const versionData = {
        pageId: id,
        status: "pending" as const,
        slug: body.slug,
        type: existingPage.type, // Keep the original type
        title: body.title,
        description: body.description,
        tags: body.tags || [],
        authorIds: body.authorIds || [],
        content: {
            properties: body.properties || {},
            blocks: body.blocks || []
        },
        posted_at: body.posted_at ? new Date(body.posted_at) : null,
        createdBy: session.user.id
    }

    try {
        const [newVersion] = await db
            .insert(pageVersions)
            .values(versionData)
            .returning()

        if (!newVersion) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create page version"
            })
        }

        // Return the version with a message indicating it's pending approval
        return {
            ...newVersion,
            blocks: newVersion.content.blocks,
            properties: newVersion.content.properties,
            message: "Page changes saved as a new version pending approval"
        }
    } catch (error: any) {
        console.error("Version Creation Error:", error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Failed to create page version"
        })
    }
})