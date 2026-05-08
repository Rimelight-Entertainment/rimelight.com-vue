import { type Block } from "./blocks";
import { type Image, type Link } from "./schemas";

export type Localized<T = string> = Record<string, T>;

declare global {
  interface RimelightRegisterPageTypes {}
}

export interface RegisterPageTypes extends RimelightRegisterPageTypes {
  Default: BasePageProperties;
}

export type PageType = keyof RegisterPageTypes;

export interface Property<T = any> {
  // The initial/default data value
  defaultValue: T | string | string[] | number | Localized | Localized[];
  // The human-readable label to display
  label: Localized<string>;
  // Type of data/renderer
  type: "number" | "text" | "text-array" | "enum" | "page" | "page-array";
  // Optional: For union type, defines the available options
  options?: string[] | Localized[];
  // Required for types "page" and "page-array", specifies the PageType to link to
  allowedPageTypes?: PageType[];
  // Optional display order for properties within a category
  order?: number;
  // A function that returns true/false based on current page data
  visibleIf?: (properties: any) => boolean;
}

export interface PropertyGroup {
  label: Localized<string>;
  order?: number;
  fields: Record<string, Property>;
  defaultOpen: boolean;
}

/**
 * A PageTemplate is the single definition for a page's properties and initial blocks.
 */
export interface PageDefinition {
  typeLabelKey: string;
  properties: Record<string, PropertyGroup>;
  initialBlocks?: () => Block[];
}

export interface BasePageProperties {
  [key: string]: PropertyGroup | undefined;
}

/**
 * Common fields shared by every page regardless of type.
 */
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

/**
 * Discriminated Union for Page Data structure
 */
export type Page = {
  [K in PageType]: { type: K; properties: RegisterPageTypes[K] } & BasePage;
}[PageType];

export type SurroundItem = Pick<BasePage, "id" | "slug" | "title" | "description">;

export interface PageSurround {
  previous: SurroundItem | null;
  next: SurroundItem | null;
}

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
