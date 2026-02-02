import { defineRule } from "oxlint"

/**
 * Rule: component-props-standard
 *
 * Rationale:
 * For consistency and to leverage Vue's reactive destructuring, component props
 * should be exported as an interface named '[ComponentName]Props' and declared
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
 * export interface MyComponentProps {
 *   name: string
 * }
 * const { name = "Component" } = defineProps<MyComponentProps>()
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
        "Component props must be exported as an interface '{{expectedName}}' and declared with destructuring."
    }
  },

  create(context) {
    const filename = context.filename
    const basename = filename.split(/[\\/]/).pop().replace(/\..*$/, "")

    // Convert kebab-case or snake_case to PascalCase
    const componentName = basename
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => {
        // If the part is fully uppercase (e.g. USER_PROFILE), normalize it to PascalCase
        if (part.toUpperCase() === part && part.length > 1) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        }
        // Otherwise preserve existing casing but ensure first char is upper
        return part.charAt(0).toUpperCase() + part.slice(1)
      })
      .join("")

    const expectedName = `${componentName}Props`

    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier") return
        const isDefineProps = node.callee.name === "defineProps"
        const isWithDefaults = node.callee.name === "withDefaults"

        if (isDefineProps || isWithDefaults) {
          const parent = node.parent
          const definePropsNode = isWithDefaults ? node.arguments[0] : node

          if (
            !definePropsNode ||
            definePropsNode.type !== "CallExpression" ||
            definePropsNode.callee.type !== "Identifier" ||
            definePropsNode.callee.name !== "defineProps"
          )
            return

          let needsDestructuring = false
          if (
            parent &&
            parent.type === "VariableDeclarator" &&
            parent.id.type === "Identifier" &&
            parent.id.name === "props"
          ) {
            needsDestructuring = true
          }

          let needsInterface = false
          let typeArg = null
          const typeParams = definePropsNode.typeParameters || definePropsNode.typeArguments
          if (typeParams && typeParams.params && typeParams.params.length > 0) {
            typeArg = typeParams.params[0]
            if (typeArg.type === "TSTypeLiteral") {
              needsInterface = true
            } else if (
              typeArg.type === "TSTypeReference" &&
              typeArg.typeName.type === "Identifier" &&
              typeArg.typeName.name !== expectedName
            ) {
              needsInterface = true
            }
          } else {
            needsInterface = true
          }

          if (needsDestructuring || needsInterface) {
            context.report({
              node,
              messageId: "standardizeProps",
              data: { expectedName },
              fix(fixer) {
                const sourceCode = context.sourceCode
                let interfaceCode = ""
                let propNames = []
                let defaults = {}

                // 1. Extract Type Info
                if (typeArg) {
                  if (typeArg.type === "TSTypeLiteral") {
                    const literalText = sourceCode.getText(typeArg)
                    interfaceCode = `export interface ${expectedName} ${literalText}\n\n`
                    typeArg.members.forEach((member) => {
                      if (
                        member.type === "TSPropertySignature" &&
                        member.key.type === "Identifier"
                      ) {
                        propNames.push(member.key.name)
                      }
                    })
                  }
                }

                // 2. Extract Defaults from withDefaults
                if (isWithDefaults && node.arguments.length > 1) {
                  const defaultsNode = node.arguments[1]
                  if (defaultsNode.type === "ObjectExpression") {
                    defaultsNode.properties.forEach((prop) => {
                      if (prop.key && prop.key.type === "Identifier" && prop.value) {
                        defaults[prop.key.name] = sourceCode.getText(prop.value)
                        if (!propNames.includes(prop.key.name)) {
                          propNames.push(prop.key.name)
                        }
                      }
                    })
                  }
                }

                // 3. Construct Fix
                let newDeclaration = ""
                const assignmentId =
                  parent.type === "VariableDeclarator" ? sourceCode.getText(parent.id) : ""
                // If we have an assignment and we are destructuring, we lose the object reference
                const willDestructure = propNames.length > 0

                if (willDestructure) {
                  const destructuring = propNames
                    .map((name) => (defaults[name] ? `${name} = ${defaults[name]}` : name))
                    .join(", ")
                  newDeclaration = `const { ${destructuring} } = defineProps<${expectedName}>()`
                } else {
                  // If not destructuring (no props found?), preserve variable if it exists
                  if (assignmentId) {
                    newDeclaration = `const ${assignmentId} = defineProps<${expectedName}>()`
                  } else {
                    newDeclaration = `const { /* TODO: extract props from ${expectedName} */ } = defineProps<${expectedName}>()`
                  }
                }

                if (!newDeclaration) return null
                const finalCode = `${interfaceCode}${newDeclaration}`

                const fixes = []

                if (parent.type === "VariableDeclarator") {
                  fixes.push(fixer.replaceText(parent.parent, finalCode))
                } else if (parent.type === "ExpressionStatement") {
                  fixes.push(fixer.replaceText(node, finalCode))
                }

                // 4. Cleanup object references 'props.x' -> 'x'
                // Only do this if we are destructuring and had a variable assignment
                if (assignmentId && willDestructure) {
                  const root = sourceCode.ast

                  const traverse = (n) => {
                    if (!n) return

                    // Check for MemberExpression: assignmentId.propertyName
                    if (
                      n.type === "MemberExpression" &&
                      n.object.type === "Identifier" &&
                      n.object.name === assignmentId &&
                      !n.computed &&
                      n.property.type === "Identifier"
                    ) {
                      // Only replace if the property is one of the destructured props
                      // This prevents replacing props.someMethod() if it existed, though unlikely on props object
                      if (propNames.includes(n.property.name)) {
                        fixes.push(fixer.replaceText(n, n.property.name))
                      }
                    }

                    for (const key of Object.keys(n)) {
                      if (key === "parent") continue
                      const child = n[key]
                      if (Array.isArray(child)) child.forEach(traverse)
                      else if (child && typeof child === "object" && child.type) traverse(child)
                    }
                  }
                  traverse(root)
                }

                return fixes
              }
            })
          }
        }
      }
    }
  }
})
