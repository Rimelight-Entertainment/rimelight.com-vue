# Data Management

- **Database:** PostgreSQL 18.
- **ORM:** Drizzle ORM.
- **IDs:** Always use UUIDv7 for primary keys.
- **Schema:** Defined in `server/database/schema.ts`.
- **Migrations:** Managed via `drizzle-kit`.
- **Server API:** Typed responses using `zod` or TypeScript interfaces.
