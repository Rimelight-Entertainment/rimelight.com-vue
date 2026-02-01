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
      description: "Enforce presence and order of Vue SFC blocks.",
      category: "Style",
      recommended: true
    },
    fixable: "code",
    messages: {
      invalidStructure:
        "Vue SFC must follow the <script>, <template>, <style scoped> order with consistent spacing."
    }
  },

  create(context) {
    if (!context.getFilename().endsWith(".vue")) {
      return {}
    }

    const sourceCode = context.getSourceCode()
    const text = sourceCode.getText()

    return {
      Program(node) {
        // Capture blocks with content
        const scriptMatch = text.match(/<script[\s\S]*?<\/script>/)
        const templateMatch = text.match(/<template[\s\S]*?<\/template>/)
        const styleMatch = text.match(/<style[\s\S]*?<\/style>/)

        const hasScopedStyle = styleMatch && styleMatch[0].includes("scoped")
        const correctOrder =
          scriptMatch &&
          templateMatch &&
          styleMatch &&
          scriptMatch.index < templateMatch.index &&
          templateMatch.index < styleMatch.index &&
          hasScopedStyle

        // Check if the current file content exactly matches our expected output
        // If it doesn't exist or is out of order, we trigger the fix
        if (!correctOrder || !hasScopedStyle) {
          context.report({
            node,
            messageId: "invalidStructure",
            fix(fixer) {
              // Extract parts or provide defaults
              // .trim() ensures we don't carry over existing messy whitespace
              const scriptPart = scriptMatch ? scriptMatch[0].trim() : "<script setup>\n\n</script>"
              const templatePart = templateMatch
                ? templateMatch[0].trim()
                : "<template>\n\n</template>"

              // If style exists but isn't scoped, we force it. If it doesn't exist, we create it.
              let stylePart = "<style scoped>\n\n</style>"
              if (styleMatch) {
                const innerStyle = styleMatch[0]
                if (!innerStyle.includes("scoped")) {
                  stylePart = innerStyle.replace("<style", "<style scoped>").trim()
                } else {
                  stylePart = innerStyle.trim()
                }
              }

              // Build the final string: Block -> Newline -> Newline -> Block
              const finalContent = `${scriptPart}\n\n${templatePart}\n\n${stylePart}\n`

              return fixer.replaceText(node, finalContent)
            }
          })
        }
      }
    }
  }
})
