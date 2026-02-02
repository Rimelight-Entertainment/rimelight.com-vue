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
      description: "Enforces Script -> Template -> Style order for Vue SFCs.",
      category: "Style",
      recommended: true
    },
    fixable: "code",
    messages: {
      invalidStructure: "SFC blocks must be ordered: Script, Template, Style."
    }
  },

  create(context) {
    if (!context.getFilename().endsWith(".vue")) return {}

    return {
      Program(node) {
        const sourceCode = context.getSourceCode()
        const text = sourceCode.getText()

        // Regex to capture the entirety of each block (including tags and attributes)
        // [^] is used to match any character including newlines
        const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/i
        const templateRegex = /<template[^>]*>[\s\S]*?<\/template>/i
        const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/i

        const scriptMatch = text.match(scriptRegex)
        const templateMatch = text.match(templateRegex)
        const styleMatch = text.match(styleRegex)

        const blocks = [
          scriptMatch ? scriptMatch[0] : null,
          templateMatch ? templateMatch[0] : null,
          styleMatch ? styleMatch[0] : null
        ].filter(Boolean)

        // Construct the expected string by joining existing blocks with double newlines
        const expectedBody = blocks.join("\n\n")

        // Normalize the current text for comparison (remove trailing/leading whitespace)
        const normalizedActual = text.trim().replace(/\r\n/g, "\n")
        const normalizedExpected = expectedBody.trim().replace(/\r\n/g, "\n")

        if (normalizedActual !== normalizedExpected && blocks.length > 0) {
          context.report({
            node,
            messageId: "invalidStructure",
            fix(fixer) {
              // We append a final newline for POSIX compliance
              return fixer.replaceTextRange([0, text.length], `${expectedBody}\n`)
            }
          })
        }
      }
    }
  }
})
