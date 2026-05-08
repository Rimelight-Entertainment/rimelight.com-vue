import { ref } from "vue";
import type { Page, PageType } from "#types";

export interface UsePaginatedPagesOptions {
  /** Unique key for the async data */
  key: string;
  /** Page type to fetch (e.g., 'BlogPost', 'Default') */
  type?: PageType;
  /** Status filter: 'draft' or 'published' */
  status: "draft" | "published";
  /** Number of items to fetch on initial load */
  initialLimit?: number;
  /** Number of items to fetch on subsequent loads */
  nextLimit?: number;
  /** Whether to immediately fetch data */
  immediate?: boolean;
}

export interface UsePaginatedPagesReturn {
  /** All fetched pages */
  allPages: Ref<Page[]>;
  /** Current offset for pagination */
  offset: Ref<number>;
  /** Whether there are more pages to fetch */
  hasMore: Ref<boolean>;
  /** Whether currently fetching more pages */
  isFetchingMore: Ref<boolean>;
  /** Whether at least one "load more" has completed */
  hasLoadedNextPage: Ref<boolean>;
  /** Status of the initial fetch ('idle' | 'pending' | 'success' | 'error') */
  initialStatus: Ref<"idle" | "pending" | "success" | "error">;
  /** Function to refresh the initial fetch */
  refresh: () => Promise<void>;
  /** Function to load the next page of results */
  loadNextPage: () => Promise<void>;
}

/**
 * Composable for handling paginated page fetching with infinite scroll support.
 * Works with any page type and status.
 *
 * @example
 * ```ts
 * const posts = usePaginatedPages({
 *   key: 'blog-posts',
 *   type: 'BlogPost',
 *   status: 'published',
 *   initialLimit: 10,
 *   nextLimit: 9,
 * })
 * ```
 */
export function usePaginatedPages(options: UsePaginatedPagesOptions): UsePaginatedPagesReturn {
  const {
    key,
    type = "Default" as PageType,
    status,
    initialLimit = 10,
    nextLimit = 9,
    immediate = true,
  } = options;

  const allPages = ref<Page[]>([]);
  const offset = ref<number>(0);
  const hasMore = ref<boolean>(true);
  const isFetchingMore = ref<boolean>(false);
  const hasLoadedNextPage = ref<boolean>(false);

  /**
   * Fetches pages from the API
   */
  const fetchPages = async (limit: number, pageOffset: number): Promise<Page[]> => {
    return await $fetch<Page[]>("/api/pages", {
      query: { type, status, limit, offset: pageOffset },
      timeout: 10000,
    });
  };

  /**
   * Initial fetch function
   */
  const fetchInitial = async (): Promise<void> => {
    const newPages = await fetchPages(initialLimit, 0);
    if (newPages) {
      allPages.value = [...newPages];
      offset.value = newPages.length;
      hasMore.value = newPages.length === initialLimit;
    }
  };

  const { status: initialStatus, refresh } = useLazyAsyncData(
    `paginated-pages-${key}-${status}`,
    fetchInitial,
    { server: false, immediate },
  );

  /**
   * Loads the next page of results
   */
  const loadNextPage = async (): Promise<void> => {
    if (!hasMore.value || isFetchingMore.value) return;

    isFetchingMore.value = true;

    try {
      const newPages = await fetchPages(nextLimit, offset.value);

      if (newPages && newPages.length > 0) {
        allPages.value.push(...newPages);
        offset.value += newPages.length;
        hasMore.value = newPages.length === nextLimit;
      } else {
        hasMore.value = false;
      }

      hasLoadedNextPage.value = true;
    } finally {
      isFetchingMore.value = false;
    }
  };

  return {
    allPages,
    offset,
    hasMore,
    isFetchingMore,
    hasLoadedNextPage,
    initialStatus,
    refresh,
    loadNextPage,
  };
}
