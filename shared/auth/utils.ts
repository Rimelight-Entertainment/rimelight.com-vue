import { eq, count, and } from "drizzle-orm";
import type { user as userTable } from "../../server/db/schema/auth";

/**
 * Generate a random number between 0000 (inclusive) and 9999 (inclusive)
 */
const generateRandomTag = (): string => {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
};

/**
 * Creates a generateUniqueTag function bound to your database and user table.
 * @param db Your drizzle database instance
 * @param user The user table from your schema
 * @returns A function that generates unique user tags
 */
export const createGenerateUniqueTag = (db: { select: any }, user: typeof userTable) => {
  /**
   * Generates a unique user tag by querying the database to ensure
   * the combination of the provided name and the new tag is unique.
   * @param userName The name of the user currently being created.
   * @returns A unique four-digit string tag for this name.
   */
  return async (userName: string): Promise<string> => {
    const MAX_RETRIES = 50;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const newTag = generateRandomTag();

      const result = await db
        .select({ count: count() })
        .from(user)
        .where(and(eq(user.name, userName), eq(user.tag, newTag)));

      const tagCount = result[0]?.count ?? 0;

      if (tagCount === 0) {
        return newTag;
      }
    }

    throw new Error(
      `Failed to generate a unique tag for user "${userName}" after ${MAX_RETRIES} attempts. Please retry the operation.`,
    );
  };
};
