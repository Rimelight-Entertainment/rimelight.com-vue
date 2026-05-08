import { createTV } from "tailwind-variants";

// Use a truly static/safe default for the library's TV instance.
// Overrides can be passed via the components' local tv() calls if needed.
export const tv = createTV({
  twMerge: true,
});
