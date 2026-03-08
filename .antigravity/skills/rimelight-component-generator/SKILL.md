---
name: rimelight-component-generator
description: Generates standardized rimelight components following project conventions.
---

# Rimelight Component Generator Skill

This skill helps generate standardized components that follow rimelight project conventions.

## When to use this skill

- When creating new Vue components
- When you need to follow standardized component patterns
- When implementing new UI elements that match the design system
- When creating reusable component templates

## How to use it

1. Determine the component type (atomic, organism, template, page)
2. Follow the standardized interface patterns for props, emits, and slots
3. Use the `useRC` composable for responsive classes
4. Implement proper TypeScript interfaces
5. Follow the SFC structure with proper region comments

## Component Structure

All components should follow this structure:

```vue
<script setup lang="ts">
import { tv } from "~/internal/tv";
import { useRC } from "~/composables";

// Define interfaces for props, emits, and slots
export interface ComponentNameProps {
  // Define props with proper typing
  rc?: {
    root?: string;
    // Add other class props as needed
  };
}

const { rc: rcProp } = defineProps<ComponentNameProps>();

export interface ComponentNameEmits {
  // Define emits with proper typing
}

const emit = defineEmits<ComponentNameEmits>();

export interface ComponentNameSlots {
  // Define slots with proper typing
  default: (props: {}) => any;
}

const slots = defineSlots<ComponentNameSlots>();

// Use responsive classes composable
const { rc } = useRC("ComponentName", rcProp);

// Define styles using tv (tailwind-variants)
const componentStyles = tv({
  slots: {
    root: "default-classes",
  },
});

const { root } = componentStyles();
</script>

<template>
  <!-- Component template -->
  <div :class="root">
    <slot />
  </div>
</template>
```

## Best Practices

- Always use TypeScript interfaces for props, emits, and slots
- Implement the `rc` prop pattern for responsive styling
- Use the `tv` utility for consistent styling
- Follow the established SFC structure
- Include proper JSDoc comments for public interfaces
