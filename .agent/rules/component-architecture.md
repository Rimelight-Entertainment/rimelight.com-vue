# Component Architecture

## Script Setup Order

Always follow this order in `<script setup lang="ts">`:

1. **Props Interface** (Exported)
2. **`defineProps`** (Destructured)
3. **Emits Interface** (Exported)
4. **`defineEmits`**
5. **Styles** (Tailwind Variants / `tv`)
6. **Logic & Hooks** (Composables, Refs, Computed, Watch, Methods)

**Example:**

```vue
<script setup lang="ts">
// 1. Props Interface
export interface MyComponentProps {
  title: string;
  isAdmin?: boolean;
}

// 2. defineProps (Destructured)
const { title, isAdmin = false } = defineProps<MyComponentProps>();

// 3. Emits Interface
export interface MyComponentEmits {
  (e: "save", data: string): void;
}

// 4. defineEmits
const emit = defineEmits<MyComponentEmits>();

// 5. Styles (tv)
const buttonStyles = tv({
  base: "px-4 py-2",
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
  },
});

// 6. Logic & Hooks
const data = ref("");
const handleSave = () => emit("save", data.value);
</script>
```

## Naming Conventions

- **Components:** `PascalCase` (e.g., `components/MyComponent.vue`)
- **Composables:** `use<MyComposable>` (e.g., `composables/useAuth.ts`)
- **Component Prefix:** Use the `ID` prefix for project-specific components when defined in `nuxt.config.ts`

## Prop Interface & Destructuring

**MUST** export prop interfaces and use destructuring:

```typescript
// Correct
export interface MyComponentProps {
  title: string;
  isAdmin?: boolean;
}

const { title, isAdmin = false } = defineProps<MyComponentProps>();
```

```typescript
// Incorrect - Don't do this
const props = defineProps<{
  title: string;
  isAdmin?: boolean;
}>();
```
