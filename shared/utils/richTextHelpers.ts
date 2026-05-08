import { v7 as uuidv7 } from "uuid";
import type { RichTextContent, InlineText } from "./types";

/**
 * Helper: Converts RichTextContent array into a plain string for a simple contenteditable area.
 * For complex editors, this would generate full HTML/DOM nodes, preserving links/mentions.
 * For now, we only extract the text content.
 */
export function richTextToHtml(content: RichTextContent): string {
  return content
    .map((item) => {
      if (item.type === "text" || item.type === "link") {
        return item.props.content;
      }
      if (item.type === "mention") {
        // For mentions, we return an empty string or a placeholder
        // since the "content" is fetched by the ID
        return "";
      }
      return "";
    })
    .join("");
}

/**
 * Helper: Converts a plain string from a contenteditable area back into RichTextContent.
 *
 * NOTE: For full rich text support, this function must parse complex HTML (<a>, <b>, <span>)
 * and generate the correct InlineLink, InlineMention, and InlineText objects.
 * Since we are only simulating the text content change, we convert the entire string
 * into a single InlineText element.
 */
export function parseHtmlToRichText(html: string): RichTextContent {
  if (html.trim().length === 0) {
    return [];
  }

  // Generate a new InlineText object with a fresh ID
  const newTextNode: InlineText = {
    id: uuidv7(),
    type: "text",
    props: {
      content: html.trim(),
    },
  };

  // In a more complex scenario, this would use a DOMParser to reconstruct links/mentions.
  return [newTextNode];
}
