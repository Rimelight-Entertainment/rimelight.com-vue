export const preferValidatedGetters = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce usage of validated getters (getValidatedQuery, readValidatedBody) in Nuxt event handlers.",
      category: "Best Practices",
      recommended: true
    },
    schema: [],
    messages: {
      preferValidatedQuery:
        "Use getValidatedQuery(event, schema) instead of getQuery(event) for better type safety.",
      preferValidatedBody:
        "Use readValidatedBody(event, schema) instead of readBody(event) for better type safety."
    }
  },

  create(context) {
    return {
      CallExpression(node) {
        // Handle getQuery -> getValidatedQuery
        if (node.callee.type === "Identifier" && node.callee.name === "getQuery") {
          context.report({
            node,
            messageId: "preferValidatedQuery"
          })
        }

        // Handle readBody/getBody -> readValidatedBody
        if (
          node.callee.type === "Identifier" &&
          (node.callee.name === "readBody" || node.callee.name === "getBody")
        ) {
          context.report({
            node,
            messageId: "preferValidatedBody"
          })
        }
      }
    }
  }
}
