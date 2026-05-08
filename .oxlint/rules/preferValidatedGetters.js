import { defineRule } from "oxlint";

/**
 * Rule: prefer-validated-getters
 *
 * Rationale:
 * Using getQuery or readBody without validation bypasses type safety and can
 * lead to runtime errors if the input doesn't match expectations.
 * Nuxt provides getValidatedQuery and readValidatedBody to ensure inputs
 * match a schema (e.g., Zod).
 *
 * Incorrect:
 * const query = getQuery(event)
 * const body = await readBody(event)
 *
 * Correct:
 * const query = await getValidatedQuery(event, schema)
 * const body = await readValidatedBody(event, schema)
 */
export const preferValidatedGetters = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce usage of validated getters (getValidatedQuery, readValidatedBody) in Nuxt event handlers.",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
    messages: {
      preferValidatedQuery:
        "Use getValidatedQuery(event, schema) instead of getQuery(event) for better type safety.",
      preferValidatedBody:
        "Use readValidatedBody(event, schema) instead of readBody(event) for better type safety.",
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        // Handle getQuery -> getValidatedQuery
        if (node.callee.type === "Identifier" && node.callee.name === "getQuery") {
          context.report({
            node,
            messageId: "preferValidatedQuery",
          });
        }

        // Handle readBody/getBody -> readValidatedBody
        if (
          node.callee.type === "Identifier" &&
          (node.callee.name === "readBody" || node.callee.name === "getBody")
        ) {
          context.report({
            node,
            messageId: "preferValidatedBody",
          });
        }
      },
    };
  },
});
