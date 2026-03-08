export const componentEmitsStandard = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce standard component emit declaration using interface and tuple syntax.",
      category: "Best Practices",
      recommended: true
    },
    fixable: "code",
    messages: {
      standardizeEmits:
        "Component emits must be exported as an interface '{{expectedName}}' using property-tuple syntax."
    }
  },

  create(context) {
    const filename = context.filename
    const basename = filename.split(/[\\/]/).pop().replace(/\..*$/, "")

    const componentName = basename
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => {
        if (part.toUpperCase() === part && part.length > 1) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        }
        return part.charAt(0).toUpperCase() + part.slice(1)
      })
      .join("")

    const expectedName = `${componentName}Emits`

    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier" || node.callee.name !== "defineEmits") return

        // Skip if this line already has a TODO comment referencing this rule
        const sourceCode = context.sourceCode
        const nodeRange = node.range
        const textBeforeNode = sourceCode.getText().slice(Math.max(0, nodeRange[0] - 200), nodeRange[0])
        if (textBeforeNode.includes("TODO") && textBeforeNode.includes("component-emits-standard")) {
          return
        }

        const typeParams = node.typeParameters || node.typeArguments
        let needsFix = false
        let typeArg = null

        if (typeParams && typeParams.params && typeParams.params.length > 0) {
          typeArg = typeParams.params[0]

          if (typeArg.type === "TSTypeLiteral") {
            needsFix = true
          } else if (
            typeArg.type === "TSTypeReference" &&
            (typeArg.typeName.type !== "Identifier" || typeArg.typeName.name !== expectedName)
          ) {
            needsFix = true
          }
        } else {
          needsFix = true
        }

        if (needsFix) {
          context.report({
            node,
            messageId: "standardizeEmits",
            data: { expectedName },
            fix(fixer) {
              let interfaceBody = "{\n"
              let hasComplexSignature = false
              let convertedMembers = []

              if (typeArg && typeArg.type === "TSTypeLiteral") {
                typeArg.members.forEach((member) => {
                  // Handle Case: (e: 'change', data: RoutineCategory[]): void
                  if (member.type === "TSCallSignatureDeclaration") {
                    const eventParam = member.params[0]
                    const additionalParams = member.params.slice(1)

                    // Try to extract event name from first param if it's a literal string
                    let eventName = null
                    if (
                      eventParam &&
                      eventParam.type === "TSParameterProperty" &&
                      eventParam.parameter?.type === "Identifier" &&
                      eventParam.parameter.typeAnnotation?.typeAnnotation?.type === "TSLiteralType"
                    ) {
                      const literal = eventParam.parameter.typeAnnotation.typeAnnotation.literal
                      if (literal && literal.type === "Literal") {
                        eventName = literal.value
                      }
                    }

                    if (eventName) {
                      // Successfully extracted event name, convert to tuple syntax
                      const payloadTypes = additionalParams.map((param) => {
                        if (param.type === "TSParameterProperty" && param.parameter.typeAnnotation) {
                          return sourceCode.getText(param.parameter.typeAnnotation.typeAnnotation)
                        }
                        return sourceCode.getText(param)
                      })
                      const tupleType = payloadTypes.length > 0 ? `[${payloadTypes.join(", ")}]` : "[]"
                      convertedMembers.push(`  ${eventName}: ${tupleType}`)
                    } else {
                      // Can't extract event name, mark as complex
                      hasComplexSignature = true
                      interfaceBody += `  /* TODO: Manual conversion required for complex signature */\n`
                    }
                  }
                  // Handle Case: change: [id: number] (Already correct, just transferring)
                  else if (
                    member.type === "TSPropertySignature" &&
                    member.key.type === "Identifier"
                  ) {
                    const key = member.key.name
                    const type = member.typeAnnotation
                      ? sourceCode.getText(member.typeAnnotation.typeAnnotation)
                      : "[]"
                    convertedMembers.push(`  ${key}: ${type}`)
                  }
                })

                // Add converted members to interface body
                if (convertedMembers.length > 0) {
                  interfaceBody = "{\n" + convertedMembers.join("\n") + "\n"
                  if (hasComplexSignature) {
                    interfaceBody += "}"
                  } else {
                    interfaceBody += "}"
                  }
                } else if (!hasComplexSignature) {
                  interfaceBody += "}"
                } else {
                  interfaceBody += "}"
                }
              } else {
                interfaceBody = "{\n  // TODO: Define emits here\n}"
              }

              const interfaceCode = `export interface ${expectedName} ${interfaceBody}\n\n`
              const newDeclaration = `const emit = defineEmits<${expectedName}>()`

              const parent = node.parent
              const targetNode = parent.type === "VariableDeclarator" ? parent.parent : node

              // If there's a complex signature we couldn't fully convert, keep the original defineEmits
              // functional and add a comment explaining what needs to be done manually
              if (hasComplexSignature) {
                // Keep original functional, just add interface + TODO comment referencing the rule
                return fixer.insertTextBefore(
                  targetNode,
                  `${interfaceCode}// TODO: See custom linting rule 'component-emits-standard' for manual conversion\n`
                )
              }

              return fixer.replaceText(targetNode, `${interfaceCode}${newDeclaration}`)
            }
          })
        }
      }
    }
  }
}
