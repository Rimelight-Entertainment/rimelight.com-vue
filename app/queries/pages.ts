import { defineQueryOptions } from "@pinia/colada";

import { type Page } from "#rimelight-components/types";

export const PAGE_QUERY_KEYS = {
  all: ["pages"] as const,
  lists: () => [...PAGE_QUERY_KEYS.all, "list"] as const,
  details: () => [...PAGE_QUERY_KEYS.all, "detail"] as const,
  detail: (idOrSlug: string) => [...PAGE_QUERY_KEYS.details(), idOrSlug] as const,
  byId: (id: string) => [...PAGE_QUERY_KEYS.details(), "id", id] as const,
  bySlug: (slug: string) => [...PAGE_QUERY_KEYS.details(), "slug", slug] as const,
  byAuthor: (authorId: string) => [...PAGE_QUERY_KEYS.lists(), { authorId }] as const,
};

export const pageBySlugQuery = defineQueryOptions((slug: MaybeRefOrGetter<string>) => {
  const s = toValue(slug);
  return {
    key: PAGE_QUERY_KEYS.bySlug(s),
    query: () => $api<Page>(`/api/pages/find/${s}`),
  };
});
