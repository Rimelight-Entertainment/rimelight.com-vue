# UI & Styling

## Tailwind CSS

- **Version:** Tailwind 4
- Use the latest Tailwind 4 features and syntax
- **Mobile-first approach:** Design for mobile breakpoints first, then scale up

## Nuxt UI Components

- Prioritize `U`-prefixed components from Nuxt UI (`UButton`, `UCard`, `UInput`, etc.)
- Follow Nuxt UI v3+ patterns and conventions

## Theme Variables

Use project-specific CSS variables from `main.css`:

### Colors

- `text-highlighted` - Emphasized text
- `text-muted` - Secondary text
- `text-dimmed` - Tertiary/disabled text
- `bg-dimmed` - Subtle background
- `bg-elevated` - Elevated surface background

### Spacing

- `gap-md` - Medium gap
- `padding-lg` - Large padding
- (Use project-defined spacing variables)

**Example:**

```vue
<template>
  <div class="bg-elevated text-highlighted gap-md p-padding-lg">Content</div>
</template>
```

## Component-Specific Notes

### UDashboardPanel

- Uses a `<template #body>` slot to render its content
- **There is no `UDashboardPanelContent` component**

```vue
<template>
  <UDashboardPanel>
    <template #body>
      <!-- Content here -->
    </template>
  </UDashboardPanel>
</template>
```

### UModal

- Follow standard Nuxt UI modal patterns
- Use v-model for open/close state

### USelectMenu

- This is the component used for selection menus
- **Not `USelect`** - use `USelectMenu`

### UIcon

- Utilize the format `lucide:icon` for icon names
- **Not** `i-lucide-icon`

```vue
<template>
  <!-- Correct -->
  <UIcon name="lucide:user" />

  <!-- Incorrect -->
  <UIcon name="i-lucide-user" />
</template>
```
