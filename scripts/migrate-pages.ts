import fs from "node:fs/promises";
import path from "node:path";
import { db } from "../server/db";
import { pages } from "../server/db/schema/pages/pages";
import { v4 as uuidv4 } from "uuid";

// Adjust this path if necessary
const BACKUP_DIR = path.resolve(process.cwd(), "backups/articles_2026-01-28T17-08-20-013Z");

// --- Helper Functions for Blocks ---

function convertRichText(tiptapNodes: any[]) {
  if (!Array.isArray(tiptapNodes)) return [];

  return tiptapNodes
    .map((node) => {
      if (node.type === "text") {
        return {
          type: "text",
          id: uuidv4(),
          props: { content: node.text || "" },
        };
      }
      // Support for other inline types can be added here
      return null;
    })
    .filter(Boolean);
}

function convertBlock(oldBlock: any): any {
  // Generate new IDs for blocks to ensure they follow current format logic if needed,
  // though valid UUIDs from old data would work too.
  const newId = uuidv4();

  if (oldBlock.type === "section") {
    return {
      id: newId,
      type: "SectionBlock",
      props: {
        level: 2, // Default heading level
        title: oldBlock.attrs?.title || "Untitled",
        children: oldBlock.slots?.default?.map(convertBlock).filter(Boolean) || [],
      },
    };
  }

  if (oldBlock.type === "paragraph") {
    return {
      id: newId,
      type: "ParagraphBlock",
      props: {
        text: convertRichText(oldBlock.attrs?.text),
      },
    };
  }

  if (oldBlock.type === "callout") {
    // Old callout has text content in attrs.text
    const textContent = convertRichText(oldBlock.attrs?.text);
    // Create a paragraph block to hold the content
    const pBlock = {
      id: uuidv4(),
      type: "ParagraphBlock",
      props: { text: textContent },
    };

    // Map 'note' -> 'info', fallback to 'info'
    const variantMap: Record<string, string> = {
      note: "info",
      warning: "warning",
      tip: "success",
      danger: "error",
    };
    const variant = variantMap[oldBlock.attrs?.variant] || "info";

    return {
      id: newId,
      type: "CalloutBlock",
      props: {
        variant,
        children: [pBlock],
      },
    };
  }

  if (oldBlock.type === "image") {
    return {
      id: newId,
      type: "ImageBlock",
      props: {
        src: oldBlock.attrs?.src || "",
        alt: oldBlock.attrs?.alt || "",
        caption: oldBlock.attrs?.title || undefined,
      },
    };
  }

  if (oldBlock.type === "bullet_list" || oldBlock.type === "ordered_list") {
    // Tiptap lists have list_item children
    const listItems =
      oldBlock.slots?.default
        ?.map((li: any) => {
          // li.slots.default contains blocks (usually paragraph)
          // We flatten because UnorderedListBlock expects simple Block[] items usually
          // depending on implementation, but defined type says items: Block[]
          // Usually UnorderedListBlock renders items as <li> containing the block.
          return li.slots?.default?.map(convertBlock).filter(Boolean);
        })
        .flat() || [];

    return {
      id: newId,
      type: "UnorderedListBlock",
      props: {
        items: listItems,
      },
    };
  }

  // Return null for unknown blocks to skip them
  return null;
}

async function main() {
  console.log(`Reading backups from: ${BACKUP_DIR}`);
  let files: string[] = [];
  try {
    files = await fs.readdir(BACKUP_DIR);
  } catch (e) {
    console.error(`Error reading directory: ${e}`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    try {
      const filePath = path.join(BACKUP_DIR, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const oldPage = JSON.parse(fileContent);

      // --- Transform Data ---

      const newBlocks = oldPage.blocks?.map(convertBlock).filter(Boolean) || [];

      // Map Title: ensure localized format
      const title =
        typeof oldPage.title === "string"
          ? { en: oldPage.title }
          : oldPage.title || { en: "Untitled" };

      // Map Type
      const pageType = oldPage.type || "Default";

      // Dates
      const createdAt = oldPage.created_at ? new Date(oldPage.created_at) : new Date();
      const updatedAt = oldPage.updated_at ? new Date(oldPage.updated_at) : new Date();
      const postedAt = oldPage.created_at ? new Date(oldPage.created_at) : null;

      const newPage = {
        id: oldPage.id, // Preserve ID
        slug: oldPage.slug,
        type: pageType,
        title: title,
        description: {},
        tags: [],
        authorIds: [],
        content: {
          blocks: newBlocks,
          properties: oldPage.properties || {},
        },
        createdAt,
        updatedAt,
        postedAt,
      };

      // --- Insert into DB ---
      console.log(`Migrating: ${oldPage.slug}`);

      await db
        .insert(pages)
        .values(newPage as any)
        .onConflictDoUpdate({
          target: pages.id,
          set: newPage as any,
        });

      successCount++;
    } catch (e) {
      console.error(`Failed to migrate file ${file}:`, e);
      errorCount++;
    }
  }

  console.log(`\nMigration Summary:`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors:  ${errorCount}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
