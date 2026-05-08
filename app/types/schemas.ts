import * as v from "valibot";
import { type Localized } from "./index";

/**
 * Helper to create a Valibot schema for the Localized<T> type
 */
export const LocalizedSchema = <T extends v.GenericSchema>(schema: T) =>
  v.record(v.string(), schema) as v.GenericSchema<Localized<v.InferOutput<T>>>;

export const linkVariantEnum = v.picklist(["solid", "outline", "subtle", "soft", "ghost", "link"]);

export const linkColorEnum = v.picklist([
  "primary",
  "secondary",
  "neutral",
  "error",
  "warning",
  "success",
  "info",
]);

export const ImageSchema = v.object({
  src: v.pipe(v.string(), v.minLength(1, "Image source must be provided.")),
  alt: v.pipe(v.string(), v.minLength(1, "Image alt text must be provided.")),
  width: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  height: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  name: v.optional(LocalizedSchema(v.string())),
});
export type Image = v.InferOutput<typeof ImageSchema>;

export const LinkSchema = v.object({
  label: v.pipe(v.string(), v.minLength(1, "Link label must be provided.")),
  to: v.pipe(
    v.string(),
    v.url("Link destination must be a valid URL."),
    v.minLength(1, "Link destination must be provided."),
  ),
  icon: v.optional(v.string()),
  trailing: v.optional(v.boolean()),
  color: v.optional(linkColorEnum),
  variant: v.optional(linkVariantEnum),
});
export type Link = v.InferOutput<typeof LinkSchema>;

export type UserAvailability = "available" | "busy" | "invisible";
