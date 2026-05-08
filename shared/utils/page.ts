import { type MaybeRefOrGetter, toValue } from "vue";
import {
  type Localized,
  type Page,
  type PageDefinition,
  type PageVersion,
  type Property,
  type BasePageProperties,
} from "./types";

export const getLocalizedContent = <T = string>(
  field: Localized<T> | T | undefined,
  currentLocale: MaybeRefOrGetter<string>,
): T | string => {
  if (field === undefined || field === null) return "";

  // If it's already a string or not an object, return it as is
  if (typeof field !== "object") return String(field);

  const locale = toValue(currentLocale);

  if (typeof field === "object" && field !== null) {
    if (Object.keys(field).length === 0) return "";

    // 1. Try standard localization lookup
    const val = (field as any)[locale] ?? (field as any)["en"];
    if (val !== undefined && val !== null) {
      // If we found a string, return it
      if (typeof val === "string") return val;

      // If we found another object (nested localization or specialized object)
      // try to resolve it recursively or return its first string property
      if (typeof val === "object") {
        const innerVal = (val as any)[locale] ?? (val as any)["en"];
        if (typeof innerVal === "string") return innerVal;

        const firstString = Object.values(val as object).find((v) => typeof v === "string");
        if (firstString !== undefined) return String(firstString);
      }
    }

    // 2. Fallback: use first available value that is a string from the top-level object
    const firstVal = Object.values(field as object).find(
      (v) => typeof v === "string" && v.trim() !== "",
    );
    if (firstVal !== undefined) return String(firstVal);

    return "";
  }

  const strVal = String(field);
  return strVal === "[object Object]" ? "" : strVal;
};

/**
 * Ensures a page strictly adheres to its PageDefinition.
 * Syncs properties and templated blocks.
 */
export function syncPageWithDefinition(page: Page, definition?: PageDefinition): Page {
  if (!definition) return page;

  // 1. Sync Properties
  const updatedProperties: BasePageProperties = {};
  const definitionGroups = definition.properties;

  const existingProperties = (page.properties || {}) as any;

  for (const [groupId, definitionGroup] of Object.entries(definitionGroups)) {
    let existingGroup = existingProperties[groupId];

    // Case-insensitive group lookup fallback
    if (!existingGroup) {
      const lowerGroupId = groupId.toLowerCase();
      const foundGroupKey = Object.keys(existingProperties).find(
        (k) => k.toLowerCase() === lowerGroupId,
      );
      if (foundGroupKey) {
        existingGroup = existingProperties[foundGroupKey];
      }
    }

    const updatedGroupFields: Record<string, Property> = {};

    const definitionFields = definitionGroup.fields || {};

    for (const [fieldId, definitionField] of Object.entries(definitionFields)) {
      let value = definitionField.defaultValue;

      if (existingGroup) {
        // 1. Check if it's already hydrated: group.fields[fieldId].defaultValue
        if (existingGroup.fields?.[fieldId]?.defaultValue !== undefined) {
          value = existingGroup.fields[fieldId].defaultValue;
        }
        // 2. Check if it's flat in a group: group[fieldId]
        else if (existingGroup[fieldId] !== undefined) {
          value = existingGroup[fieldId];
        }
        // 2.5 Case-insensitive fallback for flat props
        else {
          const lowerFieldId = fieldId.toLowerCase();
          const foundKey = Object.keys(existingGroup).find((k) => k.toLowerCase() === lowerFieldId);
          if (foundKey && existingGroup[foundKey] !== undefined) {
            value = existingGroup[foundKey];
          }
        }
      }

      updatedGroupFields[fieldId] = {
        ...(JSON.parse(JSON.stringify(definitionField)) as Property),
        defaultValue: value,
      };
    }

    updatedProperties[groupId] = {
      ...definitionGroup,
      fields: updatedGroupFields,
    };
  }

  page.properties = updatedProperties as any;

  // 2. Sync Blocks
  if (definition.initialBlocks) {
    const templateBlocks = definition.initialBlocks();
    const currentBlocks = page.blocks || [];

    const isSameBlock = (a: any, b: any) => {
      if (a.id === b.id) return true;
      if (a.type !== b.type) return false;
      // Heuristic for SectionBlocks: match by title
      if (a.type === "SectionBlock" && b.type === "SectionBlock") {
        return a.props.title === b.props.title;
      }
      return false;
    };

    const definitionTemplatedBlocks = templateBlocks.filter((b) => b.isTemplated);

    // Filter existing blocks: keep user blocks and valid templated blocks
    let updatedBlocks = currentBlocks.filter((b) => {
      if (!b.isTemplated) return true;
      return definitionTemplatedBlocks.some((db) => isSameBlock(b, db));
    });

    // Add missing templated blocks or update existing ones
    for (const db of definitionTemplatedBlocks) {
      const existingIdx = updatedBlocks.findIndex((b) => isSameBlock(b, db));
      const dbIndexAtStart = templateBlocks.findIndex((b) => b.id === db.id);

      if (existingIdx === -1) {
        // Missing templated block, add it at its prescribed position
        updatedBlocks.splice(dbIndexAtStart, 0, { ...db });
      } else {
        // Update existing templated block (sync properties if needed)
        const existing = updatedBlocks[existingIdx]!;
        const updated = {
          ...existing,
          ...db,
          props: {
            ...db.props,
          },
        } as any;

        // Preserve children if it's a section
        if (existing.type === "SectionBlock" && db.type === "SectionBlock") {
          updated.props.children = existing.props.children || db.props.children || [];
        }

        updatedBlocks[existingIdx] = updated;
      }
    }

    page.blocks = updatedBlocks;
  }

  return page;
}

export function dehydratePageProperties(properties: BasePageProperties): any {
  const dehydrated: any = {};
  for (const [groupKey, group] of Object.entries(properties)) {
    if (!group?.fields) continue;
    dehydrated[groupKey] = {};
    for (const [fieldKey, field] of Object.entries(group.fields)) {
      dehydrated[groupKey][fieldKey] = field.defaultValue;
    }
  }
  return dehydrated;
}

export function convertVersionToPage(version: PageVersion): Page {
  const blocks = version.content?.blocks || version.blocks || [];
  const properties = version.content?.properties || (version as any).properties;

  return {
    ...version,
    id: version.pageId || version.id,
    type: version.type,
    blocks: JSON.parse(JSON.stringify(blocks)),
    properties: properties ? JSON.parse(JSON.stringify(properties)) : {},
    authorsIds: (version as any).authorsIds || (version as any).authorIds || [],
    createdAt: version.createdAt ? new Date(version.createdAt) : new Date(),
    updatedAt: version.updatedAt ? new Date(version.updatedAt) : new Date(),
    postedAt: version.postedAt ? new Date(version.postedAt) : null,
    banner: version.banner,
    icon: version.icon,
    images: version.images || [],
    title: version.title || { en: "" },
    slug: version.slug || "",
    description: version.description || { en: "" },
    tags: version.tags || [],
    links: version.links || [],
  } as Page;
}

/**
 * Robustly converts an ID, Slug, or full API path into a valid /api/pages resolution path.
 * Handles cases where the input might be a full URL or already contain the API prefix.
 */
export function getPageResolutionPath(idOrSlug: string): string {
  if (
    !idOrSlug ||
    idOrSlug === "undefined" ||
    idOrSlug === "null" ||
    idOrSlug === "[object Object]"
  )
    return "";

  // 1. Remove possible full URL or API prefix
  let clean = String(idOrSlug).replace(/^(?:.*\/)?api\/pages\/(?:id|find)\//, "");

  // 2. Remove leading/trailing slashes
  clean = clean.replace(/^\/|\/$/g, "");

  // 3. Robust doubling check: if the first part of the slug is exactly repeated
  // e.g. "franchises/grand-tale/wiki/franchises/grand-tale/wiki/..."
  const parts = clean.split("/");
  if (parts.length >= 4) {
    // Check for common 3-part prefixes like franchises/grand-tale/wiki
    const threePart = parts.slice(0, 3).join("/");
    const nextThreePart = parts.slice(3, 6).join("/");
    if (threePart === nextThreePart) {
      clean = parts.slice(3).join("/");
    }
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  return isUuid ? `/api/pages/id/${clean}` : `/api/pages/find/${clean}`;
}
