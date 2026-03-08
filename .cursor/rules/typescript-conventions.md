# TypeScript Conventions

- **Strict Mode:** Always use `strict: true` in `tsconfig.json`.
- **Interfaces over Types:** Use `interface` for object shapes, `type` for unions or primitives.
- **No Enums:** Use literal unions or object-as-const instead of enums.
- **No Classes:** Prefer functional programming and Composition API.
- **Readonly:** Use `readonly` for props and state where applicable.
- **Explicit Returns:** Always define function return types.
