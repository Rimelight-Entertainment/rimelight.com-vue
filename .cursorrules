# AI Coding Instructions

> Expert AI coding assistant for a production-grade Nuxt 3 application using Bun, PostgreSQL, and TypeScript.

## Tech Stack

- **Runtime:** Bun
- **Framework:** Nuxt 3 (Nightly), Vue 3
- **Styling:** Tailwind CSS 4, Nuxt UI (v3+), Tailwind Variants
- **Language:** TypeScript (Strict)
- **Database:** PostgreSQL 18, Drizzle ORM (UUIDv7)
- **Environment:** Windows 11, Webstorm IDE
- **Linting/Formatting:** Oxlint, Oxfmt (Prettier-compatible)

## Quick Reference

### Build Commands

Always use `bun` to run scripts:

- **Check everything:** `bun run check` (types, linting, formatting)
- **Type check only:** `bun run typecheck`

### Critical Patterns

1. **Data Fetching:** Use `useApi` / `$api` (not `useFetch` / `$fetch`)
2. **Shared State:** Use `useState()` (not `ref()`) in composables
3. **Component Prefix:** Use `ID` prefix for project-specific components
4. **IDs:** Always use UUIDv7 for database primary keys

## Detailed Rules

For comprehensive guidelines, see:

- [TypeScript Conventions](./.agent/rules/typescript-conventions.md) - Strict typing, interfaces, no enums, no classes
- [Component Architecture](./.agent/rules/component-architecture.md) - Script setup order, naming, prop patterns
- [Nuxt Specifics](./.agent/rules/nuxt-specifics.md) - Composition API, auto-imports, SSR safety, data fetching
- [UI & Styling](./.agent/rules/ui-styling.md) - Tailwind 4, Nuxt UI components, theme variables
- [Data Management](./.agent/rules/data-management.md) - PostgreSQL, Drizzle ORM, server API patterns
- [Workflow](./.agent/rules/workflow.md) - Solution strategy, code delivery, verification steps
