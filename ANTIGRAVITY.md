# AI Coding Instructions

> Expert AI coding assistant for a production-grade Nuxt 3 application using Bun, PostgreSQL, and TypeScript.

## Tech Stack

- **Package Manager:** Bun
- **Build Tool:** Bun
- **Runtime:** Node (Development) / Wrangler (Production)
- **Framework:** Nuxt, Vue
- **Styling:** Tailwind CSS, Tailwind Variants, Nuxt UI
- **Language:** TypeScript (Strict)
- **Database:** PostgreSQL 18, Drizzle ORM (UUIDv7)
- **Environment:** Windows 11, Powershell, Webstorm IDE
- **Linting/Formatting:** Oxlint, Oxfmt (ESlint & Prettier-compatible)

## Quick Reference

### Build Commands

Always use `bun` to run scripts:

- **Check everything:** `bun run check` (types, linting, formatting)
- **Type check only:** `bun run typecheck`

## Environment & Shell

- **OS:** Always assume Windows 11 PowerShell.
- **Chain Commands:** Always use `;` to chain commands instead of `&&`.
  - **Correct:** `bun install; bun run dev`
  - **Incorrect:** `bun install && bun run dev`

### Critical Patterns

1. **Data Fetching:** Use `useApi` / `$api` (not `useFetch` / `$fetch`)
2. **Shared State:** Use `useState()` (not `ref()`) in composables
3. **Component Prefix:** Use `ID` prefix for project-specific components
4. **IDs:** Always use UUIDv7 for database primary keys

## Detailed Rules

For comprehensive guidelines, see:

- [Workspace Overview](./.antigravity/rules/WORKSPACE.md) - Project-specific guidelines and general rules
- [TypeScript Conventions](./.antigravity/rules/typescript-conventions.md) - Strict typing, interfaces, no enums, no classes
- [Component Architecture](./.antigravity/rules/component-architecture.md) - Script setup order, naming, prop patterns
- [Nuxt Specifics](./.antigravity/rules/nuxt-specifics.md) - Composition API, auto-imports, SSR safety, data fetching
- [UI & Styling](./.antigravity/rules/ui-styling.md) - Tailwind 4, Nuxt UI components, theme variables
- [Data Management](./.antigravity/rules/data-management.md) - PostgreSQL, Drizzle ORM, server API patterns
- [Workflow](./.antigravity/rules/workflow.md) - Solution strategy, code delivery, verification steps
