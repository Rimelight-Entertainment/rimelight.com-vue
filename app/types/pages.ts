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
