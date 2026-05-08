// Block types
export type BlockType = "SectionBlock" | "ParagraphBlock" | "CalloutBlock" | "ImageBlock";

export interface BaseBlock {
  id: string;
  type: BlockType;
  isTemplated?: boolean;
  props: Record<string, any>;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

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
  props: { content: string };
}
export interface InlineLink extends BaseInlineContent {
  type: "link";
  props: { href: string; target?: "_blank" | "_self"; content: string };
}
export interface InlineMention extends BaseInlineContent {
  type: "mention";
  props: { pageId: string };
}

export type InlineContent = InlineText | InlineLink | InlineMention;
export type RichTextContent = InlineContent[];

// Schema types
export type Image = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  name?: Record<string, string>;
};

export type Link = {
  label: string;
  to: string;
  icon?: string;
  trailing?: boolean;
  color?: "primary" | "secondary" | "neutral" | "error" | "warning" | "success" | "info";
  variant?: "solid" | "outline" | "subtle" | "soft" | "ghost" | "link";
};

// Page types
export type Localized<T = string> = Record<string, T>;

export interface RegisterPageTypes {
  Default: BasePageProperties;
}
export type PageType = keyof RegisterPageTypes;

export interface Property<T = any> {
  defaultValue: T | string | string[] | number | Localized | Localized[];
  label: Localized<string>;
  type: "number" | "text" | "text-array" | "enum" | "page" | "page-array";
  options?: string[] | Localized[];
  allowedPageTypes?: PageType[];
  order?: number;
  visibleIf?: (properties: any) => boolean;
}

export interface PropertyGroup {
  label: Localized<string>;
  order?: number;
  fields: Record<string, Property>;
  defaultOpen: boolean;
}

export interface PageDefinition {
  typeLabelKey: string;
  properties: Record<string, PropertyGroup>;
  initialBlocks?: () => Block[];
}

export interface BasePageProperties {
  [key: string]: PropertyGroup | undefined;
}

export interface BasePage {
  id: string;
  slug: string;
  icon?: Image;
  banner?: Image;
  images?: Image[];
  title: Localized<string>;
  description?: Localized<string>;
  tags?: Localized<string>[];
  links?: Link[];
  authorsIds?: string[];
  blocks: Block[];
  postedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status?: "published" | "draft" | "archived" | (string & {});
}

export type Page = {
  [K in PageType]: { type: K; properties: RegisterPageTypes[K] } & BasePage;
}[PageType];

export interface PageVersion extends BasePage {
  pageId: string;
  status: "pending" | "approved" | "rejected";
  type: PageType;
  content: {
    blocks: Block[];
    properties: RegisterPageTypes[PageType];
  };
  createdBy: string;
  approvedBy?: string | null;
  approvedAt?: Date | null;
}
