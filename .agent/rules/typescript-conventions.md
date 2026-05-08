# TypeScript Conventions

## Strict Typing

- Use TypeScript throughout the codebase
- Strict mode is enabled
- Prefer **interfaces** over types for better extendability
- Export all major interfaces (Props, Emits, Models)

## No Enums

- **Do not use enums**
- Use maps or literal types instead for improved type safety and flexibility

**Example:**

```typescript
// Avoid
enum Status {
  Active = "active",
  Inactive = "inactive",
}

// Prefer
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

## No Classes

- **Avoid using classes**
- Prioritize functional programming patterns
- Use composables and utility functions instead

## Interface Exports

All major interfaces should be exported for reusability:

```typescript
// Export prop interfaces
export interface UserCardProps {
  userId: string;
  showAvatar?: boolean;
}

// Export emit interfaces
export interface UserCardEmits {
  (e: "update", userId: string): void;
  (e: "delete"): void;
}

// Export data models
export interface User {
  id: string;
  email: string;
  name: string;
}
```
