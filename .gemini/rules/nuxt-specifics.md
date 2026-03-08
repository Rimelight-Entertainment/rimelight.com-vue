# Nuxt Specifics

- **Data Fetching:** Use `useApi` or `$api` instead of `useFetch`/`$fetch`.
- **Auto-Imports:** Rely on Nuxt auto-imports for composables and components.
- **SSR Safety:** Use `onMounted` or `<ClientOnly>` for client-side only logic.
- **Layouts:** Use layers and layouts for shared page structures.
- **Middleware:** Use named middleware for route protection.
