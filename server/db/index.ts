import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
export * from "./schema";

export { schema };

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined in environment variables. " + "Please configure your .env file.",
  );
}

export const db = drizzle(neon(connectionString), { schema });
