export * from "./richTextHelpers";
export * from "./page";
export * from "./blocks";
export * from "./cms";
export * from "./ssr";

/**
 * Gets a value from an object by path
 * @param obj The object to get the value from
 * @param path The path to the value (e.g., "messages.common.cancel")
 * @param defaultValue The default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue as T;
    }
    result = result[key];
  }

  return result ?? (defaultValue as T);
}

/**
 * Converts a string into a URL-friendly slug.
 * - Converts to lowercase.
 * - Replaces non-alphanumeric characters (except hyphens and spaces) with nothing.
 * - Replaces spaces and multiple hyphens with a single hyphen.
 * - Trims leading/trailing hyphens.
 *
 * @param text The string to convert (e.g., "My Awesome Section Title!").
 * @returns The resulting slug (e.g., "my-awesome-section-title").
 */
export function slugify(text: string): string {
  if (!text) {
    return "";
  }

  return text
    .toString() // Ensure the input is a string
    .normalize("NFD") // Normalizes Unicode to decomposed form (for accent removal)
    .replace(/[\u0300-\u036f]/g, "") // Removes diacritics (accents)
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove all non-word characters (except hyphens)
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
}
