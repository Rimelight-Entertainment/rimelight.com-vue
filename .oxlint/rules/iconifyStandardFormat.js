export const iconifyStandardFormat = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce standard 'prefix:name' format for Iconify icons.",
      category: "Style",
      recommended: true
    },
    fixable: "code",
    messages: {
      useStandardFormat: "Icon '{{plugin}}' should use the 'prefix:name' format."
    }
  },

  create(context) {
    const iconRegex = /^i-([a-z0-9]+)-(.+)$/

    function checkAndFix(node, value) {
      if (typeof value !== "string") return

      const match = value.match(iconRegex)
      if (match) {
        const [full, prefix, name] = match
        const newValue = `${prefix}:${name}`

        context.report({
          node,
          messageId: "useStandardFormat",
          data: { plugin: full },
          fix(fixer) {
            // Determine the original quoting style to preserve it
            const raw = context.sourceCode.getText(node)
            const quote = raw.startsWith("'") ? "'" : raw.startsWith("`") ? "`" : '"'
            return fixer.replaceText(node, `${quote}${newValue}${quote}`)
          }
        })
      }
    }

    function isIconPropertyName(name) {
      return name === "name" || name === "icon" || name.endsWith("Icon")
    }

    return {
      // Targets Vue/JSX attributes: <Icon name="lucide:user" /> or <Button trailingIcon="i-lucide-user" />
      JSXAttribute(node) {
        const name = node.name.name
        if (isIconPropertyName(name) && node.value?.type === "Literal") {
          checkAndFix(node.value, node.value.value)
        }
      },

      // Targets JS/TS Object properties: { icon: "i-mdi-home" } or { trailingIcon: "i-lucide-user" }
      Property(node) {
        const keyName = node.key.type === "Identifier" ? node.key.name : node.key.value
        if (isIconPropertyName(keyName) && node.value.type === "Literal") {
          checkAndFix(node.value, node.value.value)
        }
      }
    }
  }
}
