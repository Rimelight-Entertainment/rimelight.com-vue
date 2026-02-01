import { defineRule } from "oxlint"

/**
 * Rule: no-top-level-ref
 *
 * Rationale:
 * In Nuxt SSR, variables declared at the module level (outside of functions) using ref()
 * are shared across all requests. This leads to cross-request state pollution,
 * where one user's state might leak to another.
 *
 * Instead, use useState() which is keyed to the current request, or move the logic
 * into a Pinia store or a composable function where state is created per-instance.
 *
 * Incorrect:
 * const count = ref(0)
 * export const useCounter = () => { return { count } }
 *
 * Correct:
 * const count = useState('count', () => 0)
 * export const useCounter = () => { return { count } }
 */
export const noTopLevelRef = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent cross-request state pollution in Nuxt by using useState instead of ref at module level.",
      category: "Possible Errors",
      recommended: true
    },
    fixable: "code",
    messages: {
      noTopLevelRef:
        "Nuxt SSR can lead to cross-request state pollution. Use useState() instead of ref() at the module level."
    }
  },
  create(context) {
    const filename = context.filename || ""
    if (filename.endsWith(".vue")) {
      return {}
    }

    let scopeStack = 0

    return {
      FunctionDeclaration() {
        scopeStack++
      },
      "FunctionDeclaration:exit"() {
        scopeStack--
      },
      ArrowFunctionExpression() {
        scopeStack++
      },
      "ArrowFunctionExpression:exit"() {
        scopeStack--
      },
      FunctionExpression() {
        scopeStack++
      },
      "FunctionExpression:exit"() {
        scopeStack--
      },
      ClassDeclaration() {
        scopeStack++
      },
      "ClassDeclaration:exit"() {
        scopeStack--
      },

      CallExpression(node) {
        if (scopeStack > 0) return

        const isRefCall =
          node.callee.type === "Identifier" &&
          (node.callee.name === "ref" || node.callee.name === "shallowRef")

        if (isRefCall) {
          context.report({
            node,
            messageId: "noTopLevelRef",
            fix(fixer) {
              let varName = "state_key"
              const parent = node.parent

              if (parent?.type === "VariableDeclarator" && parent.id.type === "Identifier") {
                varName = parent.id.name
              }

              const args = node.arguments
              const argText =
                args.length > 0 ? context.getSourceCode().getText(args[0]) : "undefined"

              return fixer.replaceText(node, `useState('${varName}', () => ${argText})`)
            }
          })
        }
      }
    }
  }
})
