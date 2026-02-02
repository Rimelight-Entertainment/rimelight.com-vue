import {defineRule} from "oxlint"

/**
 * Rule: vue-sfc-unified-structure
 *
 * Rationale:
 * Enforces a strict, predictable structure for Vue Single File Components to ensure
 * consistency across production-scale applications.
 *
 * Incorrect:
 * <template>
 * ...
 * </template>
 * <script setup>
 * ...
 * </script>
 *
 * Correct:
 * <script setup>
 * ...
 * </script>
 *
 * <template>
 * ...
 * </template>
 *
 * <style scoped>
 * ...
 * </style>
 */
export const vueSfcStructure = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Force clean Vue SFC structure and fix nested/duplicate tags.",
      category: "Style",
      recommended: true
    },
    fixable: "code",
    messages: {
      invalidStructure: "Severe SFC structure error detected. Rebuilding file..."
    }
  },

  create(context) {
    if (!context.getFilename().endsWith(".vue")) return {}

    const sourceCode = context.getSourceCode()
    const text = sourceCode.getText()

    return {
      Program(node) {
        // 1. Helper to extract content from the MOST OUTER tags of a specific type
        const extractOuterBlock = (tagName) => {
          const startRegex = new RegExp(`<${tagName}[^>]*>`, "i")
          const endRegex = new RegExp(`</${tagName}>`, "gi")

          const startMatch = text.match(startRegex)
          if (!startMatch) return null

          // Find all end tags and pick the absolute last one
          const endMatches = [...text.matchAll(endRegex)]
          if (endMatches.length === 0) return null

          const lastEndMatch = endMatches[endMatches.length - 1]
          const fullBlock = text.slice(
            startMatch.index,
            lastEndMatch.index + lastEndMatch[0].length
          )

          // CRITICAL: Strip any internal duplicate tags from the captured content
          // This removes the "<script setup>" that was injected inside your script
          let content = fullBlock
            .replace(new RegExp(`<${tagName}[^>]*>`, "gi"), "")
            .replace(new RegExp(`</${tagName}>`, "gi"), "")
            .trim()

          // Return the cleaned content wrapped in a fresh single pair of tags
          // We preserve attributes from the ORIGINAL first tag found
          const attributes = startMatch[0].includes("setup") ? " setup" : ""
          const lang = startMatch[0].includes('lang="ts"') ? ' lang="ts"' : ""

          return `<${tagName}${lang}${attributes}>\n${content}\n</${tagName}>`
        }

        const finalScript = extractOuterBlock("script") || '<script setup lang="ts">\n\n</script>'
        const finalTemplate =
          extractOuterBlock("template") || "<template>\n  <div></div>\n</template>"

        // Ensure style is scoped
        let finalStyle = extractOuterBlock("style") || "<style scoped>\n\n</style>"
        if (!finalStyle.includes("scoped")) {
          finalStyle = finalStyle.replace("<style", "<style scoped>")
        }

        // Define what the perfect file SHOULD look like
        const expectedContent = `${finalScript}\n\n${finalTemplate}\n\n${finalStyle}\n`

        // If the current text doesn't match our perfectly rebuilt version, fix it
        if (text !== expectedContent) {
          context.report({
            node,
            messageId: "invalidStructure",
            fix(fixer) {
              return fixer.replaceText(node, expectedContent)
            }
          })
        }
      }
    }
  }
})
