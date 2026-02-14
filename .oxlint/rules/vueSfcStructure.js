import { defineRule } from "oxlint";

export const vueSfcStructure = defineRule({
  meta: {
    type: "layout",
    docs: {
      description:
        "Smart SFC structure rule that prevents nested tags and enforces internal padding.",
      category: "Style",
      recommended: true,
    },
    fixable: "code",
    messages: {
      invalidStructure: "SFC structure is incorrect. Correcting regions and padding.",
    },
  },

  create(context) {
    if (!context.filename.endsWith(".vue")) return {};

    return {
      Program(node) {
        const sourceCode = context.sourceCode;
        const fullText = sourceCode.getText();

        // 1. Detect if the linter gave us the WHOLE file or just the guts
        // If it starts with <script, we are looking at the whole file.
        const isFullFile = fullText.trim().startsWith("<script");

        let scriptGuts = "";
        let templateGuts = "";
        let styleGuts = "";

        if (isFullFile) {
          scriptGuts = fullText.match(/<script\b[^>]* setup[^>]*>([\s\S]*?)<\/script>/)?.[1] || "";
          templateGuts = fullText.match(/<template>([\s\S]*?)<\/template>/)?.[1] || "";
          styleGuts = fullText.match(/<style\b[^>]*>([\s\S]*?)<\/style>/)?.[1] || "";
        } else {
          // We are trapped inside the <script> tag. The text IS the script guts.
          scriptGuts = fullText;
        }

        // 2. Extract and Isolate
        const importRegex = /^import\s+[\s\S]*?from\s+['"].*?['"];?/gm;
        const imports = scriptGuts.match(importRegex) || [];
        const body = scriptGuts.replace(importRegex, "").trim();

        const patterns = {
          meta: /(\/\* region Page Meta \*\/[\s\S]*?\/\* endregion \*\/)|(?:(?:\/\/ )?definePageMeta[\s\S]*?\)\n?)/,
          props:
            /(\/\* region Props \*\/[\s\S]*?\/\* endregion \*\/)|(?:(?:(?:\/\/ )?(?:export )?interface \w+Props[\s\S]*?})[\s\S]*?(?:(?:\/\/ )?const \w+ = defineProps[\s\S]*?\)\n?))|(?:(?:\/\/ )?const \w+ = defineProps[\s\S]*?\)\n?)/,
          emits:
            /(\/\* region Emits \*\/[\s\S]*?\/\* endregion \*\/)|(?:(?:(?:\/\/ )?(?:export )?interface \w+Emits[\s\S]*?})[\s\S]*?(?:(?:\/\/ )?const \w+ = defineEmits[\s\S]*?\)\n?))|(?:(?:\/\/ )?const \w+ = defineEmits[\s\S]*?\)\n?)/,
        };

        const extMeta = body.match(patterns.meta)?.[0] || null;
        const extProps = body.match(patterns.props)?.[0] || null;
        const extEmits = body.match(patterns.emits)?.[0] || null;

        let cleanLogic = body
          .replace(/\/\* region [\s\S]*?endregion \*\//g, "")
          .replace(extMeta || "", "")
          .replace(extProps || "", "")
          .replace(extEmits || "", "")
          .trim();

        const format = (content, name, boilerplate) => {
          const isBlank =
            !content ||
            (content.includes("/* region") &&
              content.replace(/\/\* region .*? \*\/|\/\* endregion \*\//g, "").trim() === "");
          if (isBlank) return `/* region ${name} */\n${boilerplate}\n/* endregion */`;
          const raw = content.replace(/\/\* region .*? \*\/|\/\* endregion \*\//g, "").trim();
          return `/* region ${name} */\n${raw}\n/* endregion */`;
        };

        // 3. Rebuild the Script Body
        const scriptInner = [
          imports.join("\n"),
          format(extMeta, "Page Meta", '// definePageMeta({\n//   layout: "default"\n// })'),
          format(
            extProps,
            "Props",
            "// export interface MyComponentProps {\n//   sample: string\n// }\n// const props = defineProps<MyComponentProps>()",
          ),
          format(
            extEmits,
            "Emits",
            "// export interface MyEmits {\n//   (e: 'change', id: number): void\n// }\n// const emit = defineEmits<MyEmits>()",
          ),
          `/* region Logic & State */\n${cleanLogic || "// Logic"}\n/* endregion */`,
        ]
          .filter((v) => v.trim() !== "")
          .join("\n\n");

        // 4. THE FIX: Conditional Output
        let finalOutput = "";
        if (isFullFile) {
          // Rebuild whole file because we have access to it
          finalOutput = `<script lang="ts" setup>\n${scriptInner.trim()}\n</script>\n\n<template>\n${templateGuts.trim() || "  <div></div>"}\n</template>\n\n<style scoped>\n${styleGuts.trim()}\n</style>\n`;
        } else {
          // We are inside the tag. ONLY return the guts with surrounding newlines.
          finalOutput = `\n${scriptInner.trim()}\n`;
        }

        // 5. Compare and Report
        if (fullText !== finalOutput) {
          context.report({
            node,
            messageId: "invalidStructure",
            fix(fixer) {
              return fixer.replaceTextRange([0, fullText.length], finalOutput);
            },
          });
        }
      },
    };
  },
});
