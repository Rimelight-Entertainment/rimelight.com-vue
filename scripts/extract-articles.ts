import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { db } from "../server/db"
import { eq } from "drizzle-orm"
import { pgTable, uuid, text, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core"

const articleTypeEnum = pgEnum("article_type", ["Default", "Species", "Character", "Tale", "Skill", "Episode", "Series", "Object", "Location", "Item"])

const articles = pgTable("articles", {
    id: uuid("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    blocks: jsonb("blocks"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    title: text("title").notNull(),
    type: articleTypeEnum("type").notNull().default("Default"),
    properties: jsonb("properties"),
});
async function backupArticles() {
    // Windows-friendly timestamp (no colons)
    const timeLabel = new Date().toISOString().replace(/[:.]/g, "-");
    const outputDir = join(process.cwd(), "backups", `articles_${timeLabel}`);

    try {
        console.log("🚀 Connecting to Neon and fetching articles...");

        await mkdir(outputDir, { recursive: true });

        const allArticles = await db.select().from(articles);

        if (allArticles.length === 0) {
            console.warn("⚠️ No articles found. Is the 'articles' table empty?");
            return;
        }

        console.log(`📦 Exporting ${allArticles.length} rows...`);

        const operations = allArticles.map(async (article) => {
            // Use slug as filename, sanitize for Windows filesystem
            const safeSlug = (article.slug || article.id).replace(/[<>:"/\\|?*]/g, "-");
            const filePath = join(outputDir, `${safeSlug}.json`);

            return Bun.write(filePath, JSON.stringify(article, null, 2));
        });

        await Promise.all(operations);

        console.log(`✅ Success! Files saved to: ${outputDir}`);
    } catch (error) {
        console.error("❌ Extraction failed:", error);
        process.exit(1);
    }
}

backupArticles();