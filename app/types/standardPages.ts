import { definePageDefinition } from "#utils/cms";

export const DOCUMENT_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.document",
  properties: {
    meta: {
      label: { en: "Document Metadata" },
      defaultOpen: true,
      fields: {
        category: {
          defaultValue: { en: "Policy" },
          label: { en: "Category" },
          type: "enum",
          options: [{ en: "Policy" }, { en: "Other" }],
        },
        readingTime: { defaultValue: 5, label: { en: "Est. Reading Time" }, type: "number" },
      },
    },
  },
});

export const BLOG_POST_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.blogPost",
  properties: {
    meta: {
      label: { en: "Post Metadata" },
      defaultOpen: true,
      fields: {
        category: {
          defaultValue: { en: "News" },
          label: { en: "Category" },
          type: "enum",
          options: [],
        },
        readingTime: { defaultValue: 5, label: { en: "Est. Reading Time" }, type: "number" },
      },
    },
  },
});
