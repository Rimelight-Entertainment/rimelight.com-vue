import { defineRule } from "oxlint";

/**
 * Rule: component-emits-standard
 *
 * Rationale:
 * For consistency and type safety, component emits should be exported as
 * an interface named '[ComponentName]Emits' and declared using defineEmits.
 *
 * Incorrect:
 * const emit = defineEmits<{ (e: 'change', id: number): void }>()
 *
 * Correct:
 * export interface MyComponentEmits {
 * change: [id: number]
 * update: [value: string]
 * }
 * const emit = defineEmits<MyComponentEmits>()
 */
export const componentEmitsStandard = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "Enforce standard component emit declaration using interface and tuple syntax.",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    messages: {
      standardizeEmits:
        "Component emits must be exported as an interface '{{expectedName}}' using property-tuple syntax.",
    },
  },

  create(context) {
    const filename = context.filename;
    const basename = filename.split(/[\\/]/).pop().replace(/\..*$/, "");

    const componentName = basename
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => {
        if (part.toUpperCase() === part && part.length > 1) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join("");

    const expectedName = `${componentName}Emits`;

    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier" || node.callee.name !== "defineEmits") return;

        const typeParams = node.typeParameters || node.typeArguments;
        let needsFix = false;
        let typeArg = null;

        if (typeParams && typeParams.params && typeParams.params.length > 0) {
          typeArg = typeParams.params[0];

          if (typeArg.type === "TSTypeLiteral") {
            needsFix = true;
          } else if (
            typeArg.type === "TSTypeReference" &&
            (typeArg.typeName.type !== "Identifier" || typeArg.typeName.name !== expectedName)
          ) {
            needsFix = true;
          }
        } else {
          needsFix = true;
        }

        if (needsFix) {
          context.report({
            node,
            messageId: "standardizeEmits",
            data: { expectedName },
            fix(fixer) {
              const sourceCode = context.sourceCode;
              let interfaceBody = "{\n";

              if (typeArg && typeArg.type === "TSTypeLiteral") {
                typeArg.members.forEach((member) => {
                  // Handle Case: (e: 'change', id: number): void
                  if (member.type === "TSCallSignatureDeclaration") {
                    const eventParam = member.params[0];
                    const remainingParams = member.params.slice(1);

                    if (
                      (eventParam && eventParam.type === "TSParameterProperty") ||
                      eventParam.type === "Identifier"
                    ) {
                      // Logic to extract literal type from first param
                    }

                    // Simplify: if we can't easily parse complex signatures, we comment it
                    interfaceBody += `  /* TODO: Manual conversion required for complex signature */\n`;
                  }
                  // Handle Case: change: [id: number] (Already correct, just transferring)
                  else if (
                    member.type === "TSPropertySignature" &&
                    member.key.type === "Identifier"
                  ) {
                    const key = member.key.name;
                    const type = member.typeAnnotation
                      ? sourceCode.getText(member.typeAnnotation.typeAnnotation)
                      : "[]";
                    interfaceBody += `  ${key}: ${type}\n`;
                  }
                });
                interfaceBody += "}";
              } else {
                interfaceBody = "{\n  // TODO: Define emits here\n}";
              }

              const interfaceCode = `export interface ${expectedName} ${interfaceBody}\n\n`;
              const newDeclaration = `const emit = defineEmits<${expectedName}>()`;

              const parent = node.parent;
              const targetNode = parent.type === "VariableDeclarator" ? parent.parent : node;

              return fixer.replaceText(targetNode, `${interfaceCode}${newDeclaration}`);
            },
          });
        }
      },
    };
  },
});
