<script setup lang="ts">
import { computed } from "vue";
import chroma from "chroma-js";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC, useHeaderStack } from "~/composables";

/* region Props */
export interface SwatchData {
  name: string;
  value: string;
  format: "hex" | "rgb" | "hsl" | "oklch" | "cmyk" | "unknown";
}

export interface PaletteSubSection {
  label: string;
  swatches: SwatchData[];
}

export interface PaletteTab {
  label: string;
  subsections: PaletteSubSection[];
}

export interface ColorPaletteProps {
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
    swatch?: string;
  };
}

const { css = "", rc: rcProp } = defineProps<ColorPaletteProps>();

const { rc } = useRC("ColorPalette", rcProp);
/* endregion */

/* region Emits */
export interface ColorPaletteEmits {}

const emit = defineEmits<ColorPaletteEmits>();
/* endregion */

/* region Slots */
export interface ColorPaletteSlots {}

const slots = defineSlots<ColorPaletteSlots>();
/* endregion */

/* region Styles */
const colorPaletteStyles = tv({
  slots: {
    root: "w-full",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    tabsList:
      "md:w-64 shrink-0 md:sticky md:top-[var(--palette-sticky-top)] self-start z-10 overflow-visible",
    tabsContent: "flex-1 min-w-0",
    tabsRoot: "flex flex-col md:flex-row gap-12 items-start overflow-visible",
    title: "text-3xl font-bold text-highlighted mb-8",
    accordion: "w-full",
  },
});

const { root, grid, tabsList, tabsContent, tabsRoot, title, accordion } = colorPaletteStyles();
type ColorPaletteVariants = VariantProps<typeof colorPaletteStyles>;
/* endregion */

/* region State */
const { totalHeight } = useHeaderStack();
const stickyTop = computed(() => `${totalHeight.value + 32}px`);

const tabItems = computed(() => {
  if (!css) return [];

  const tabs: PaletteTab[] = [];
  const lines = css.split("\n");
  const stack: string[] = [];

  function getFormat(value: string): SwatchData["format"] {
    if (value.startsWith("#")) return "hex";
    if (value.startsWith("oklch")) return "oklch";
    if (value.startsWith("rgb")) return "rgb";
    if (value.startsWith("hsl")) return "hsl";
    if (value.startsWith("cmyk")) return "cmyk";
    return "unknown";
  }

  function getName(fullVarName: string): string {
    const parts = fullVarName.split("-");
    return parts[parts.length - 1] ?? "";
  }

  lines.forEach((line) => {
    // Check for region markers
    const regionStartMatch = line.match(/\/\*\s*region\s+(.*?)\s*\*\//);
    const regionEndMatch = line.match(/\/\*\s*endregion\s*\*\//);

    if (regionStartMatch) {
      stack.push(regionStartMatch[1] ?? "");
    }

    // Capture colors only if NOT a comment line (except for the regions we just identified)
    const colorMatch = line.match(/^\s*--color-([\w-]+):\s*(.*?);/);
    if (colorMatch && !line.trim().startsWith("/*")) {
      const fullVarName = colorMatch[1] ?? "";
      const value = colorMatch[2]?.trim() ?? "";

      // Remove top-level "Colors" if it exists in the breadcrumb
      const activeStack = stack[0] === "Colors" ? stack.slice(1) : stack;

      const topLevelLabel = activeStack[0] || "Other";
      const subLevelLabel =
        activeStack.length > 1 ? activeStack.slice(1).join(" › ") : topLevelLabel;

      let tab = tabs.find((t) => t.label === topLevelLabel);
      if (!tab) {
        tab = {
          label: topLevelLabel,
          subsections: [],
        };
        tabs.push(tab);
      }

      let subSection = tab.subsections.find((s) => s.label === subLevelLabel);
      if (!subSection) {
        subSection = {
          label: subLevelLabel,
          swatches: [],
        };
        tab.subsections.push(subSection);
      }

      subSection.swatches.push({
        name: getName(fullVarName),
        value,
        format: getFormat(value),
      });
    }

    if (regionEndMatch) {
      stack.pop();
    }
  });

  return tabs;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "ColorPalette",
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

function getSwatchProps(swatch: SwatchData) {
  const p: any = { name: swatch.name };

  try {
    let color: chroma.Color;
    if (swatch.format === "oklch") {
      const oklchValues = parseOklch(swatch.value);
      if (oklchValues) {
        color = (chroma as any).oklch(...oklchValues);
      } else {
        color = chroma(swatch.value);
      }
    } else {
      color = chroma(swatch.value);
    }

    p.hex = color.hex();
    p.rgb = color.css();
    p.hsl = color.css("hsl");

    const [l, c, h] = (color as any).oklch();
    p.oklch = `oklch(${Math.round(l * 1000) / 10}% ${Math.round(c * 1000) / 1000} ${Math.round(h * 100) / 100})`;

    const [cy, m, y, k] = color.cmyk();
    p.cmyk = `cmyk(${Math.round(cy * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;

    // Calculate best contrasting text color
    p.textColor = color.luminance() > 0.45 ? "#000000" : "#FFFFFF";
  } catch (e) {
    // Fallback if conversion fails
    if (swatch.format !== "unknown") {
      p[swatch.format] = swatch.value;
    } else {
      p.oklch = swatch.value;
    }
    p.textColor = "#FFFFFF";
  }

  return p;
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
        <h2 :class="title({ class: rc.title })">
          {{ item.label }}
        </h2>
        <UAccordion
          :items="item.subsections"
          type="multiple"
          :class="accordion()"
          :ui="{
            item: 'border-b border-default last:border-b-0',
            trigger: 'text-xl font-bold py-4',
            body: 'py-6 px-4',
          }"
        >
          <template #body="{ item: subSection }">
            <div :class="grid({ class: rc.grid })">
              <RLColorSwatch
                v-for="swatch in (subSection as PaletteSubSection).swatches"
                :key="swatch.name"
                v-bind="getSwatchProps(swatch)"
                :class="rc.swatch"
              />
            </div>
          </template>
        </UAccordion>
      </template>
    </UTabs>
  </div>
</template>

<style scoped></style>
