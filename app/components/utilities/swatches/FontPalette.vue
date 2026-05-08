<script setup lang="ts">
import { computed } from "vue";
import chroma from "chroma-js";
import { useRC, useHeaderStack } from "~/composables";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useI18n } from "vue-i18n";

/* region Props */
export interface FontData {
  name: string;
  family: string;
}

export interface ColorData {
  name: string;
  fullVarName: string;
  lightValue: string;
  lightBg: string;
  darkValue: string;
  darkBg: string;
}

export interface FontPaletteProps {
  /**
   * Raw CSS content to parse
   */
  css?: string;
  /**
   * UI custom classes
   */
  rc?: {
    root?: string;
    section?: string;
    title?: string;
    grid?: string;
  };
}

const { css = "", rc: rcProp } = defineProps<FontPaletteProps>();

const { rc } = useRC("FontPalette", rcProp);
/* endregion */

/* region Emits */
export interface FontPaletteEmits {}

const emit = defineEmits<FontPaletteEmits>();
/* endregion */

/* region Slots */
export interface FontPaletteSlots {}

const slots = defineSlots<FontPaletteSlots>();
/* endregion */

/* region Styles */
const fontPaletteStyles = tv({
  slots: {
    root: "w-full",
    section: "flex flex-col gap-12",
    tabsRoot: "flex flex-col md:flex-row gap-12 items-start overflow-visible",
    tabsList:
      "md:w-64 shrink-0 md:sticky md:top-[var(--palette-sticky-top)] self-start z-10 overflow-visible",
    tabsContent: "flex-1 min-w-0",
    contentHeader: "flex flex-col gap-8",
    title: "text-3xl font-bold text-highlighted mb-2",
    familyCode: "text-sm text-muted",
    accordionWrapper: "flex flex-col gap-8",
    specimenGrid: "flex flex-col gap-8 py-4 text-highlighted",
    specimenRow: "flex flex-col md:flex-row md:items-baseline gap-4",
    specimenLabel: "w-32 text-xs text-muted font-mono uppercase shrink-0",
    specimenValue: "text-4xl break-all line-height-none tracking-tight",
    hierarchyGrid: "flex flex-col gap-8 pb-8",
    hierarchyRow: "flex flex-col md:flex-row md:items-baseline gap-4",
    hierarchyLabel: "w-12 text-xs text-muted font-mono uppercase shrink-0",
    paragraphText: "m-0 leading-relaxed max-w-2xl",
    colorGrid: "flex flex-col gap-8 pb-8",
    colorRow: "flex flex-col md:flex-row gap-4",
    colorVarLabel: "w-32 text-xs text-muted font-mono shrink-0 pt-2",
    colorComparisonGrid: "flex-1 grid grid-cols-2 rounded-lg overflow-hidden h-20",
    colorCell: "flex flex-col items-center justify-center p-2 gap-1",
    colorPreviewText: "text-2xl font-bold",
    colorValueLabel: "text-[10px] opacity-50 font-mono hidden md:block",
  },
});

const {
  root,
  section,
  tabsRoot,
  tabsList,
  tabsContent,
  contentHeader,
  title,
  familyCode,
  accordionWrapper,
  specimenGrid,
  specimenRow,
  specimenLabel,
  specimenValue,
  hierarchyGrid,
  hierarchyRow,
  hierarchyLabel,
  paragraphText,
  colorGrid,
  colorRow,
  colorVarLabel,
  colorComparisonGrid,
  colorCell,
  colorPreviewText,
  colorValueLabel,
} = fontPaletteStyles();
type FontPaletteVariants = VariantProps<typeof fontPaletteStyles>;
/* endregion */

/* region State */
const { totalHeight } = useHeaderStack();
const { t } = useI18n();
const stickyTop = computed(() => `${totalHeight.value + 32}px`);

const parsedData = computed(() => {
  if (!css) return { fonts: [], colors: [] };

  const fonts: FontData[] = [];
  const rootVars = new Map<string, string>();
  const darkVars = new Map<string, string>();

  const lines = css.split("\n");
  let currentBlock = "root"; // 'root' or 'dark'

  lines.forEach((line) => {
    // Detect block context
    if (line.includes(".dark {")) {
      currentBlock = "dark";
      return;
    }
    if (line.includes("}") && currentBlock === "dark") {
      currentBlock = "root";
      return;
    }

    // Parse Variables
    const varMatch = line.match(/^\s*(--[\w-]+):\s*(.*?);/);
    if (varMatch && !line.trim().startsWith("/*")) {
      const key = varMatch[1] ?? "";
      const value = varMatch[2]?.trim() ?? "";
      if (currentBlock === "root") {
        rootVars.set(key, value);
      } else {
        darkVars.set(key, value);
      }
    }

    // Parse Fonts (Independent of block, usually root/static)
    const fontMatch = line.match(/^\s*--font-([\w-]+):\s*(.*?);/);
    if (fontMatch && !line.trim().startsWith("/*")) {
      fonts.push({
        name: fontMatch[1] ?? "",
        family: fontMatch[2]?.trim() ?? "",
      });
    }
  });

  // Collect Text Colors
  const colors: ColorData[] = [];
  const keys = new Set([...rootVars.keys(), ...darkVars.keys()]);

  keys.forEach((key) => {
    // Filter for --text- or --ui-text-
    if (key.startsWith("--text-") || key.startsWith("--ui-text-")) {
      const name = key.replace(/^--(?:ui-)?text-/, "");

      // Filter out size variables based on resolve check
      // We resolve the LIGHT value to check if it's a color
      const resolvedLight = resolveVariable(key, rootVars);
      const colorCheck = getColor(resolvedLight);

      // Heuristic: If it parses as a color, it's a color variable.
      // Also exclude known size keys if strict check needed, but color check is robust.
      if (colorCheck) {
        // Resolve Dark Value
        // For dark mode: look in darkVars, fallback to rootVars
        // BUT when resolving nested vars, we must prioritize darkVars context
        const resolvedDark = resolveVariable(key, darkVars, rootVars);

        // Calculate Backgrounds
        const lightBg = "bg-white";
        const darkBg = "bg-black";

        // Handle 'inverted' explicitly if needed, but contrast check should cover it
        // ...

        colors.push({
          name,
          fullVarName: key,
          lightValue: resolvedLight, // stored for debugging/info if needed
          lightBg,
          darkValue: resolvedDark,
          darkBg,
        });
      }
    }
  });

  // Deduplicate by name if needed, but keys are unique variable names.
  // Actually, standard Set iteration ensures unique keys.

  return { fonts, colors };
});

const sampleText = "The quick brown fox jumps over the lazy dog";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{};':\",./<>?";

const headingLevels = [
  { tag: "h1", label: t("font_palette.heading_1") },
  { tag: "h2", label: t("font_palette.heading_2") },
  { tag: "h3", label: t("font_palette.heading_3") },
  { tag: "h4", label: t("font_palette.heading_4") },
  { tag: "h5", label: t("font_palette.heading_5") },
  { tag: "h6", label: t("font_palette.heading_6") },
];

const tabItems = computed(() => {
  return parsedData.value.fonts.map((f) => ({
    label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
    font: f,
    slot: "content",
  }));
});
/* endregion */

/* region Meta */
defineOptions({
  name: "FontPalette",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
function parseOklch(str: string): [number, number, number] | null {
  const match = str.match(/oklch\(([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+%?)?\)/);
  if (match) {
    let l = parseFloat(match[1] ?? "0");
    if (match[1]?.endsWith("%")) l /= 100;
    const c = parseFloat(match[2] ?? "0");
    const h = parseFloat(match[3] ?? "0");
    return [l, c, h];
  }
  return null;
}

function getColor(value: string): chroma.Color | null {
  try {
    if (value.startsWith("oklch")) {
      const oklchValues = parseOklch(value);
      if (oklchValues) {
        return (chroma as any).oklch(...oklchValues);
      }
    } else if (value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl")) {
      return chroma(value);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function resolveVariable(
  varName: string,
  map: Map<string, string>,
  fallbackMap?: Map<string, string>,
): string {
  let value = map.get(varName);
  if (!value && fallbackMap) {
    value = fallbackMap.get(varName);
  }
  if (!value) return varName; // Return original if not found (might be a raw color)

  const varMatch = value.match(/^var\(([\w-]+)\)$/);
  if (varMatch && varMatch[1]) {
    return resolveVariable(varMatch[1], map, fallbackMap);
  }
  return value;
}

function getFontStyles(family: string) {
  return { fontFamily: family };
}
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <UTabs
      :items="tabItems"
      orientation="vertical"
      variant="link"
      :style="{ '--palette-sticky-top': stickyTop }"
      :ui="{
        root: tabsRoot(),
        list: tabsList(),
        content: tabsContent(),
      }"
    >
      <template #content="{ item }">
        <div :class="contentHeader()">
          <header>
            <h2 :class="title({ class: rc.title })">
              {{ item.label }}
            </h2>
            <code :class="familyCode()">{{ (item as any).font.family }}</code>
          </header>

          <UAccordion
            multiple
            :items="[
              { label: t('font_palette.specimen'), slot: 'specimen' },
              { label: t('font_palette.hierarchy'), slot: 'hierarchy' },
              { label: t('font_palette.color'), slot: 'colors' },
            ]"
            :ui="{
              item: 'border-b border-default last:border-b-0',
              trigger: 'text-xl font-bold py-4',
              body: 'py-6 px-4',
            }"
          >
            <template #specimen>
              <div :class="specimenGrid()" :style="getFontStyles((item as any).font.family)">
                <div :class="specimenRow()">
                  <span :class="specimenLabel()">{{ t("font_palette.uppercase") }}</span>
                  <div :class="specimenValue()">
                    {{ alphabet }}
                  </div>
                </div>
                <div :class="specimenRow()">
                  <span :class="specimenLabel()">{{ t("font_palette.lowercase") }}</span>
                  <div :class="specimenValue()">
                    {{ alphabetLower }}
                  </div>
                </div>
                <div :class="specimenRow()">
                  <span :class="specimenLabel()">{{ t("font_palette.numbers") }}</span>
                  <div class="text-4xl">
                    {{ numbers }}
                  </div>
                </div>
                <div :class="specimenRow()">
                  <span :class="specimenLabel()">{{ t("font_palette.symbols") }}</span>
                  <div class="text-4xl">
                    {{ symbols }}
                  </div>
                </div>
              </div>
            </template>

            <template #hierarchy>
              <div :class="hierarchyGrid()" :style="getFontStyles((item as any).font.family)">
                <div v-for="h in headingLevels" :key="h.tag" :class="hierarchyRow()">
                  <span :class="hierarchyLabel()">{{ h.tag }}</span>
                  <component :is="h.tag" class="m-0">
                    {{ h.label }}
                  </component>
                </div>
                <div :class="hierarchyRow()">
                  <span :class="hierarchyLabel()">p</span>
                  <p :class="paragraphText()">
                    {{ sampleText }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                  </p>
                </div>
              </div>
            </template>

            <template #colors>
              <div :class="colorGrid()" :style="getFontStyles((item as any).font.family)">
                <div v-for="c in parsedData.colors" :key="c.name" :class="colorRow()">
                  <span :class="colorVarLabel()">{{ c.fullVarName }}</span>
                  <div :class="colorComparisonGrid()">
                    <!-- Light Mode -->
                    <div :class="[colorCell(), c.lightBg]" :style="{ color: c.lightValue }">
                      <p :class="colorPreviewText()">Aa</p>
                      <span :class="colorValueLabel()">{{ c.lightValue.slice(0, 15) }}...</span>
                    </div>

                    <!-- Dark Mode -->
                    <div :class="[colorCell(), c.darkBg]" :style="{ color: c.darkValue }">
                      <p :class="colorPreviewText()">Aa</p>
                      <span :class="colorValueLabel()">{{ c.darkValue.slice(0, 15) }}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style scoped></style>
