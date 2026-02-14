# Nuxt 3 Specifics

## Composition API

- Always use `<script setup lang="ts">`
- Never use Options API

## Auto Imports

- Nuxt auto-imports `ref`, `computed`, `watch`, etc. Use them directly
- If auto-import fails, use `import { ... } from '#imports'` as a workaround
- **Component Imports:** Rely on component auto-imports with the 'ID' prefix. Do not manually import components

## SSR Safety

### State Management

- Avoid global state pollution
- **Use `useState()` instead of `ref()` for shared state in composables or non-component contexts**
- `ref()` is fine for component-local state

**Example:**

```typescript
// Correct - Composable with shared state
export const useCounter = () => {
  const count = useState("counter", () => 0);
  return { count };
};

// Incorrect - Will cause SSR issues
export const useCounter = () => {
  const count = ref(0); // Shared across all requests!
  return { count };
};
```

## Data Fetching

### Critical: Use Custom API Utilities

- **Standardize on `useApi` / `$api`:** Use the custom `useApi` composable for SSR-friendly data fetching and the `$api` utility for client-side requests (e.g., in event handlers)
- Do **not** use default `useFetch` or `$fetch` directly
- The custom wrappers handle essential Tauri deployment proxying and base URL logic

**Example:**

```typescript
// Correct - SSR-friendly
const { data, pending } = await useApi("/api/users");

// Correct - Client-side (event handlers)
const handleClick = async () => {
  const data = await $api("/api/users", { method: "POST" });
};

// Incorrect - Don't use directly
const { data } = await useFetch("/api/users"); // ❌
```

## SEO

- Use `useHead` for meta tags
- Use `useSeoMeta` for SEO-specific meta tags

**Example:**

```typescript
useHead({
  title: "My Page",
});

useSeoMeta({
  title: "My Page",
  description: "Description of my page",
  ogImage: "/og-image.png",
});
```

## Images & Icons

- **Images:** Use `<NuxtImg>` or `<NuxtPicture>` for optimized images
- **Icons:** Use the `lucide:`, `first-party:`, or `third-party:` prefixes

**Example:**

```vue
<template>
  <NuxtImg src="/hero.jpg" alt="Hero image" />
  <UIcon name="lucide:user" />
</template>
```
