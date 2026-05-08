/**
 * Defines the allowed heading levels (h2 through h6) for the Table of Contents.
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * All valid block types the application can render.
 * This union type is the single source of truth for component names.
 */
export type BlockType = "SectionBlock" | "ParagraphBlock" | "CalloutBlock" | "ImageBlock";

/**
 * Defines the common structure for any content block object.
 * The 'type' must be one of the registered BlockType values.
 */
export interface BaseBlock {
  id: string;
  type: BlockType;
  isTemplated?: boolean;
  props: Record<string, any>;
}

export interface SectionBlockProps {
  level: HeadingLevel;
  title: string;
  description?: string;
  children: Block[];
}

export interface ParagraphBlockProps {
  text: RichTextContent;
}

export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "commentary"
  | "ideation"
  | "source";

export interface CalloutBlockProps {
  variant: CalloutVariant;
  children: Block[];
  to?: string;
  target?: string;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
}

export interface SectionBlock extends BaseBlock {
  type: "SectionBlock";
  props: SectionBlockProps;
}

export interface ParagraphContentBlock extends BaseBlock {
  type: "ParagraphBlock";
  props: ParagraphBlockProps;
}

export interface CalloutContentBlock extends BaseBlock {
  type: "CalloutBlock";
  props: CalloutBlockProps;
}

export interface ImageContentBlock extends BaseBlock {
  type: "ImageBlock";
  props: ImageBlockProps;
}

/**
 * The full union type for a single block. This allows for type-checking the
 * payload based on the block 'type'.
 */
export type Block = SectionBlock | ParagraphContentBlock | CalloutContentBlock | ImageContentBlock;

/**
 * Text Rendering Components
 */

export type InlineContentType = "text" | "link" | "mention";

/**
 * Defines the common structure for any inline content object.
 */
export interface BaseInlineContent {
  type: InlineContentType;
  id: string;
  props: Record<string, any>;
}

/**
 * Represents a segment of plain text.
 */
export interface InlineText extends BaseInlineContent {
  type: "text";
  props: {
    content: string;
  };
}

/**
 * Represents a hyperlink.
 */
export interface InlineLink extends BaseInlineContent {
  type: "link";
  props: {
    href: string;
    target?: "_blank" | "_self";
    content: string;
  };
}

/**
 * Represents a mention of an internal page or user.
 */
export interface InlineMention extends BaseInlineContent {
  type: "mention";
  props: {
    pageId: string;
  };
}

/**
 * The full union type for a single inline content element.
 */
export type InlineContent = InlineText | InlineLink | InlineMention;

/**
 * The top-level type for a block's rich text field.
 */
export type RichTextContent = InlineContent[];
