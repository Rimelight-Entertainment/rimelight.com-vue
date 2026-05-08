export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type BlockType = "SectionBlock" | "ParagraphBlock" | "CalloutBlock" | "ImageBlock";

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

export type Block = SectionBlock | ParagraphContentBlock | CalloutContentBlock | ImageContentBlock;

export type InlineContentType = "text" | "link" | "mention";

export interface BaseInlineContent {
  type: InlineContentType;
  id: string;
  props: Record<string, any>;
}

export interface InlineText extends BaseInlineContent {
  type: "text";
  props: {
    content: string;
  };
}

export interface InlineLink extends BaseInlineContent {
  type: "link";
  props: {
    href: string;
    target?: "_blank" | "_self";
    content: string;
  };
}

export interface InlineMention extends BaseInlineContent {
  type: "mention";
  props: {
    pageId: string;
  };
}

export type InlineContent = InlineText | InlineLink | InlineMention;

export type RichTextContent = InlineContent[];
