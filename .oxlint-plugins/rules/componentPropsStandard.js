import {defineRule} from "oxlint"

/**
 * Rule: component-props-standard
 *
 * Rationale:
 * For consistency and to leverage Vue's reactive destructuring, component props
 * should be exported as an interface named 'ComponentProps' and declared
 * using destructuring in defineProps.
 *
 * Incorrect:
 * const props = withDefaults(defineProps<{
 *   name: string
 * }>(), {
 *   name: "Component"
 * })
 *
 * Correct:
 * export interface ComponentProps {
 *   name: string
 * }
 * const { name = "Component" } = defineProps<ComponentProps>()
 */
export const componentPropsStandard = defineRule({
  meta: {
    type: "problem",

    docs: {
      description: "Enforce standard component prop declaration using interface and destructuring.",

      category: "Best Practices",

      recommended: true
    },

    fixable: "code",

    messages: {
      standardizeProps:
        "Component props must be exported as an interface 'ComponentProps' and declared with destructuring."
    }
  },

  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier") return

        const isDefineProps = node.callee.name === "defineProps"

        const isWithDefaults = node.callee.name === "withDefaults"

        if (isDefineProps || isWithDefaults) {
          const parent = node.parent

          // Check 1: Is it assigned to a variable named 'props'?

          let needsDestructuring = false

          if (
            parent &&
            parent.type === "VariableDeclarator" &&
            parent.id.type === "Identifier" &&
            parent.id.name === "props"
          ) {
            needsDestructuring = true
          }

          // Check 2: Does it use an inline type literal or a different interface name?

          let needsInterface = false

          const definePropsNode = isWithDefaults ? node.arguments[0] : node

          if (
            definePropsNode &&
            definePropsNode.type === "CallExpression" &&
            definePropsNode.callee.type === "Identifier" &&
            definePropsNode.callee.name === "defineProps"
          ) {
            const typeParams = definePropsNode.typeParameters || definePropsNode.typeArguments

            if (typeParams && typeParams.params && typeParams.params.length > 0) {
              const typeArg = typeParams.params[0]

              if (typeArg.type === "TSTypeLiteral") {
                needsInterface = true
              } else if (
                typeArg.type === "TSTypeReference" &&
                typeArg.typeName.type === "Identifier" &&
                typeArg.typeName.name !== "ComponentProps"
              ) {
                needsInterface = true
              }
            }
          }

          if (needsDestructuring || needsInterface) {
            context.report({
              node,

              messageId: "standardizeProps",

              fix(fixer) {
                const sourceCode = context.sourceCode

                let interfaceCode = ""

                // 1. Handle Interface Creation

                if (
                  definePropsNode &&
                  definePropsNode.type === "CallExpression" &&
                  definePropsNode.callee.name === "defineProps"
                ) {
                  const typeParams = definePropsNode.typeParameters || definePropsNode.typeArguments

                  if (typeParams && typeParams.params && typeParams.params.length > 0) {
                    const typeArg = typeParams.params[0]

                    if (typeArg.type === "TSTypeLiteral") {
                      const literalText = sourceCode.getText(typeArg)

                      interfaceCode = `export interface ComponentProps ${literalText}\n\n`
                    }
                  }
                }

                // 2. Handle withDefaults and default values extraction

                let defaults = {}

                if (isWithDefaults && node.arguments.length > 1) {
                  const defaultsNode = node.arguments[1]

                  if (defaultsNode.type === "ObjectExpression") {
                    defaultsNode.properties.forEach((prop) => {
                      if (prop.key && prop.key.type === "Identifier" && prop.value) {
                        defaults[prop.key.name] = sourceCode.getText(prop.value)
                      }
                    })
                  }
                }

                // 3. Construct the new defineProps call with destructuring

                if (needsDestructuring) {
                  if (
                    isWithDefaults &&
                    node.arguments[1] &&
                    node.arguments[1].type === "ObjectExpression"
                  ) {
                    const propNames = Object.keys(defaults)

                    if (propNames.length > 0) {
                      const destructuring = propNames

                        .map((name) => `${name} = ${defaults[name]}`)

                        .join(", ")

                      let typeName = "ComponentProps"

                      if (!needsInterface) {
                        try {
                          const typeParams =
                            definePropsNode.typeParameters || definePropsNode.typeArguments

                          typeName = sourceCode.getText(typeParams.params[0])
                        } catch {
                          typeName = "ComponentProps"
                        }
                      }

                      const newCode = `${interfaceCode}const { ${destructuring} } = defineProps<${typeName}>()`

                      if (parent.type === "VariableDeclarator") {
                        const declarationNode = parent.parent // VariableDeclaration

                        return fixer.replaceText(declarationNode, newCode)
                      }
                    }
                  }
                }

                return null
              }
            })
          }
        }
      }
    }
  }
})
