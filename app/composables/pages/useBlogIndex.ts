import { computed, reactive, ref, watch } from "vue";
import type { Page, PageType } from "~/types";
import { usePaginatedPages } from "./usePaginatedPages";
import { slugify } from "#shared/utils";

export interface NewPostState {
  title: string;
  slug: string;
}

export interface UseBlogIndexOptions {
  /** Initial limit for drafts fetch */
  draftsInitialLimit?: number;
  /** Initial limit for posts fetch */
  postsInitialLimit?: number;
  /** Number of items to fetch on subsequent loads */
  nextLimit?: number;
  /** Whether to immediately fetch drafts (default: based on user role) */
  fetchDraftsImmediate?: boolean;
  /** Optional toast callback for success/error messages */
  onToast?: (options: { color: "success" | "error"; title: string; description?: string }) => void;
}

export interface UseBlogIndexReturn {
  /** Current user session */
  session: ReturnType<typeof useAuth>["session"];
  /** Whether user is authorized to view drafts */
  isAuthorizedForDrafts: ComputedRef<boolean>;
  /** Drafts pagination state and methods */
  drafts: ReturnType<typeof usePaginatedPages>;
  /** Published posts pagination state and methods */
  posts: ReturnType<typeof usePaginatedPages>;
  /** State for new post form */
  newPostState: NewPostState;
  /** Whether the create modal is open */
  isCreateModalOpen: Ref<boolean>;
  /** Whether currently creating a post */
  isCreating: Ref<boolean>;
  /** Submit handler for creating a new post */
  handleCreateSubmit: () => Promise<void>;
}

/**
 * Composable for managing blog index page state and logic.
 * Handles drafts, published posts, and post creation.
 *
 * @example
 * ```ts
 * const blog = useBlogIndex()
 *
 * // Access drafts
 * blog.drafts.allPages.value
 * blog.drafts.loadNextPage()
 *
 * // Access posts
 * blog.posts.allPages.value
 *
 * // Create post
 * blog.isCreateModalOpen.value = true
 * await blog.handleCreateSubmit()
 * ```
 */
export function useBlogIndex(options: UseBlogIndexOptions = {}): UseBlogIndexReturn {
  const {
    draftsInitialLimit = 10,
    postsInitialLimit = 10,
    nextLimit = 9,
    fetchDraftsImmediate,
    onToast,
  } = options;

  const { session } = useAuth();
  const { t, locale } = useI18n();

  /**
   * Check if user is authorized to view drafts
   * (owner, member, or employee roles)
   */
  const isAuthorizedForDrafts = computed(() => {
    const role = session.value?.user?.role;
    return role === "owner" || role === "member" || role === "employee";
  });

  /**
   * Drafts pagination
   */
  const drafts = usePaginatedPages({
    key: "blog-drafts",
    type: "BlogPost" as PageType,
    status: "draft",
    initialLimit: draftsInitialLimit,
    nextLimit,
    immediate: fetchDraftsImmediate ?? isAuthorizedForDrafts.value,
  });

  /**
   * Published posts pagination
   */
  const posts = usePaginatedPages({
    key: "blog-posts",
    type: "BlogPost" as PageType,
    status: "published",
    initialLimit: postsInitialLimit,
    nextLimit,
    immediate: true,
  });

  /**
   * State for new post form
   */
  const newPostState = reactive<NewPostState>({
    title: "",
    slug: "",
  });

  const isCreateModalOpen = ref(false);
  const isCreating = ref(false);

  /**
   * Auto-generate slug from title when title changes
   */
  watch(
    () => newPostState.title,
    (newTitle, oldTitle) => {
      const oldGeneratedSlug = slugify(oldTitle || "");
      // Only auto-update slug if it matches the old title's slug
      // (i.e., user hasn't manually edited it)
      if (!newPostState.slug || newPostState.slug === oldGeneratedSlug) {
        newPostState.slug = slugify(newTitle);
      }
    },
  );

  /**
   * Create a new blog post
   */
  const handleCreateSubmit = async (): Promise<void> => {
    isCreating.value = true;

    try {
      const createdPage = await $fetch<Page>("/api/pages", {
        method: "POST",
        body: {
          type: "BlogPost",
          slug: newPostState.slug,
          title: { [locale.value]: newPostState.title },
          description: { [locale.value]: "" },
          content: {
            properties: {},
            blocks: [],
          },
        },
      });

      onToast?.({
        color: "success",
        title: t("pages.blog.actions.create_post.success.title"),
        description: t("pages.blog.actions.create_post.success.description"),
      });

      isCreateModalOpen.value = false;
      await navigateTo(`/company/blog/${createdPage.slug}/edit`);
    } catch (e: any) {
      onToast?.({
        color: "error",
        title: t("pages.blog.actions.create_post.error.title"),
        description: e.message || t("pages.blog.actions.create_post.error.description"),
      });
    } finally {
      isCreating.value = false;
    }
  };

  return {
    session,
    isAuthorizedForDrafts,
    drafts,
    posts,
    newPostState,
    isCreateModalOpen,
    isCreating,
    handleCreateSubmit,
  };
}
