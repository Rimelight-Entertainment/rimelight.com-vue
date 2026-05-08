import { defineRule } from "oxlint";

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
      recommended: true,
    },
    fixable: "code",
    messages: {
      standardizeProps:
        "Component props must be exported as an interface '{{expectedName}}' and declared with destructuring.",
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

    const expectedName = `${componentName}Props`;

    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier") return;
        const isDefineProps = node.callee.name === "defineProps";
        const isWithDefaults = node.callee.name === "withDefaults";

        if (isDefineProps || isWithDefaults) {
          const parent = node.parent;
          const definePropsNode = isWithDefaults ? node.arguments[0] : node;

          if (
            !definePropsNode ||
            definePropsNode.type !== "CallExpression" ||
            definePropsNode.callee.type !== "Identifier" ||
            definePropsNode.callee.name !== "defineProps"
          )
            return;

          let needsDestructuring = false;
          let assignmentId = "";
          if (
            parent &&
            parent.type === "VariableDeclarator" &&
            parent.id.type === "Identifier" &&
            parent.id.name === "props"
          ) {
            needsDestructuring = true;
            assignmentId = "props";
          }

          let needsInterfaceRename = false;
          let needsInterfaceCreation = false;
          let existingInterfaceNode = null;
          let typeArg = null;

          const typeParams = definePropsNode.typeParameters || definePropsNode.typeArguments;

          if (typeParams && typeParams.params && typeParams.params.length > 0) {
            typeArg = typeParams.params[0];
            if (typeArg.type === "TSTypeLiteral") {
              needsInterfaceCreation = true;
            } else if (
              typeArg.type === "TSTypeReference" &&
              typeArg.typeName.type === "Identifier"
            ) {
              const currentName = typeArg.typeName.name;
              if (currentName !== expectedName) {
                needsInterfaceRename = true;
                // Find the interface declaration in the program
                const program = context.sourceCode.ast;
                existingInterfaceNode = program.body.find((stmt) => {
                  const decl = stmt.type === "ExportNamedDeclaration" ? stmt.declaration : stmt;
                  return decl?.type === "TSInterfaceDeclaration" && decl.id.name === currentName;
                });
              }
            }
          } else {
            needsInterfaceCreation = true;
          }

          if (needsDestructuring || needsInterfaceCreation || needsInterfaceRename) {
            context.report({
              node,
              messageId: "standardizeProps",
              data: { expectedName },
              fix(fixer) {
                const sourceCode = context.sourceCode;
                const fixes = [];
                let propNames = [];
                let defaults = {};

                // 1. Handle the Interface
                if (needsInterfaceCreation && typeArg?.type === "TSTypeLiteral") {
                  const literalText = sourceCode.getText(typeArg);
                  const interfaceCode = `export interface ${expectedName} ${literalText}\n\n`;
                  fixes.push(fixer.insertTextBefore(parent.parent, interfaceCode));

                  typeArg.members.forEach((member) => {
                    if (member.type === "TSPropertySignature" && member.key.type === "Identifier") {
                      propNames.push(member.key.name);
                    }
                  });
                } else if (needsInterfaceRename && existingInterfaceNode) {
                  // Rename the existing interface identifier
                  const decl =
                    existingInterfaceNode.type === "ExportNamedDeclaration"
                      ? existingInterfaceNode.declaration
                      : existingInterfaceNode;

                  fixes.push(fixer.replaceText(decl.id, expectedName));

                  // Ensure it is exported
                  if (existingInterfaceNode.type !== "ExportNamedDeclaration") {
                    fixes.push(fixer.insertTextBefore(existingInterfaceNode, "export "));
                  }

                  decl.body.body.forEach((member) => {
                    if (member.type === "TSPropertySignature" && member.key.type === "Identifier") {
                      propNames.push(member.key.name);
                    }
                  });
                }

                // 2. Extract Defaults
                if (isWithDefaults && node.arguments.length > 1) {
                  const defaultsNode = node.arguments[1];
                  if (defaultsNode.type === "ObjectExpression") {
                    defaultsNode.properties.forEach((prop) => {
                      if (prop.key && prop.key.type === "Identifier" && prop.value) {
                        defaults[prop.key.name] = sourceCode.getText(prop.value);
                        if (!propNames.includes(prop.key.name)) propNames.push(prop.key.name);
                      }
                    });
                  }
                }

                // 3. Replace defineProps call
                const destructuring = propNames
                  .map((name) => (defaults[name] ? `${name} = ${defaults[name]}` : name))
                  .join(", ");

                const newCall = `const { ${destructuring} } = defineProps<${expectedName}>()`;
                fixes.push(fixer.replaceText(parent.parent, newCall));

                // 4. Global reference replacement (props.x -> x)
                if (assignmentId && propNames.length > 0) {
                  const root = sourceCode.ast;
                  const traverse = (n) => {
                    if (!n) return;
                    if (
                      n.type === "MemberExpression" &&
                      n.object.type === "Identifier" &&
                      n.object.name === assignmentId &&
                      !n.computed &&
                      n.property.type === "Identifier" &&
                      propNames.includes(n.property.name)
                    ) {
                      fixes.push(fixer.replaceText(n, n.property.name));
                    }
                    for (const key of Object.keys(n)) {
                      if (key === "parent") continue;
                      const child = n[key];
                      if (Array.isArray(child)) child.forEach(traverse);
                      else if (child && typeof child === "object" && child.type) traverse(child);
                    }
                  };
                  traverse(root);
                }

                return fixes;
              },
            });
          }
        }
      },
    };
  },
});
