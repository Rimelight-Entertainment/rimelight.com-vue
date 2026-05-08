import { defineRule } from "oxlint";

/**
 * Rule: iconify-standard-format
 *
 * Rationale:
 * Enforces the use of 'prefix:name' format for Iconify icons instead of the 'i-prefix-name' shorthand.
 * This ensures compatibility with standard Iconify resolvers and improves searchability.
 *
 * Incorrect:
 * <Icon name="i-lucide-users" />
 * { icon: "i-mdi-account" }
 *
 * Correct:
 * <Icon name="lucide:users" />
 * { icon: "mdi:account" }
 */
export const iconifyStandardFormat = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce standard 'prefix:name' format for Iconify icons.",
      category: "Style",
      recommended: true,
    },
    fixable: "code",
    messages: {
      useStandardFormat: "Icon '{{plugin}}' should use the 'prefix:name' format.",
    },
  },

  create(context) {
    const iconRegex = /^i-([a-z0-9]+)-(.+)$/;

    function checkAndFix(node, value) {
      if (typeof value !== "string") return;

      const match = value.match(iconRegex);
      if (match) {
        const [full, prefix, name] = match;
        const newValue = `${prefix}:${name}`;

        context.report({
          node,
          messageId: "useStandardFormat",
          data: { plugin: full },
          fix(fixer) {
            // Determine the original quoting style to preserve it
            const raw = context.getSourceCode().getText(node);
            const quote = raw.startsWith("'") ? "'" : raw.startsWith("`") ? "`" : '"';
            return fixer.replaceText(node, `${quote}${newValue}${quote}`);
          },
        });
      }
    }

    return {
      // Targets Vue/JSX attributes: <Icon name="i-lucide-user" />
      JSXAttribute(node) {
        const name = node.name.name;
        if ((name === "name" || name === "icon") && node.value?.type === "Literal") {
          checkAndFix(node.value, node.value.value);
        }
      },

      // Targets JS/TS Object properties: { icon: "i-mdi-home" }
      Property(node) {
        const keyName = node.key.type === "Identifier" ? node.key.name : node.key.value;
        if ((keyName === "name" || keyName === "icon") && node.value.type === "Literal") {
          checkAndFix(node.value, node.value.value);
        }
      },
    };
  },
});
