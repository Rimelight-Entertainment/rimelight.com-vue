import type { InjectionKey, ComputedRef } from "vue";

export const SECTION_LEVEL_KEY: InjectionKey<ComputedRef<number>> = Symbol("SECTION_LEVEL");
