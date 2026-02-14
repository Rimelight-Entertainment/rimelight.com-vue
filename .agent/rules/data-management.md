# Data Management

## Database

- **PostgreSQL:** Version 18
- **ORM:** Drizzle ORM

## ID Strategy

- **Strictly use UUIDv7** for all primary keys
- Do not use auto-incrementing integers or other ID formats

**Example:**

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // UUIDv7
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## Server API

- Handle all sensitive data and database interactions in `server/api/`
- Never expose database queries or credentials to the client
- Use proper error handling and validation

**Example structure:**

```
server/
└── api/
    └── users/
        ├── index.get.ts      # GET /api/users
        ├── index.post.ts     # POST /api/users
        └── [id].get.ts       # GET /api/users/:id
```

## Drizzle Patterns

- Use Drizzle's query builder for type-safe queries
- Leverage relationships and joins where appropriate
- Use transactions for multi-step operations

**Example:**

```typescript
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "id");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return user[0];
});
```
