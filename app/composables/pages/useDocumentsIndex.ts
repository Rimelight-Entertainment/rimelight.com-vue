import { computed, reactive, ref, watch } from "vue";
import type { Page, PageType } from "~/types";
import { usePaginatedPages } from "./usePaginatedPages";
import { slugify } from "#shared/utils";

export interface NewDocumentState {
  title: string;
  slug: string;
}

export interface UseDocumentsIndexOptions {
  /** Initial limit for drafts fetch */
  draftsInitialLimit?: number;
  /** Initial limit for documents fetch */
  documentsInitialLimit?: number;
  /** Number of items to fetch on subsequent loads */
  nextLimit?: number;
  /** Whether to immediately fetch drafts (default: based on user role) */
  fetchDraftsImmediate?: boolean;
  /** Optional toast callback for success/error messages */
  onToast?: (options: { color: "success" | "error"; title: string; description?: string }) => void;
}

export interface UseDocumentsIndexReturn {
  /** Current user session */
  session: ReturnType<typeof useAuth>["session"];
  /** Whether user is authorized to view drafts */
  isAuthorizedForDrafts: ComputedRef<boolean>;
  /** Drafts pagination state and methods */
  drafts: ReturnType<typeof usePaginatedPages>;
  /** Published documents pagination state and methods */
  documents: ReturnType<typeof usePaginatedPages>;
  /** State for new document form */
  newDocumentState: NewDocumentState;
  /** Whether the create modal is open */
  isCreateModalOpen: Ref<boolean>;
  /** Whether currently creating a document */
  isCreating: Ref<boolean>;
  /** Submit handler for creating a new document */
  handleCreateSubmit: () => Promise<void>;
}

/**
 * Composable for managing documents index page state and logic.
 * Handles drafts, published documents, and document creation.
 *
 * @example
 * ```ts
 * const documents = useDocumentsIndex()
 *
 * // Access drafts
 * documents.drafts.allPages.value
 * documents.drafts.loadNextPage()
 *
 * // Access documents
 * documents.documents.allPages.value
 *
 * // Create document
 * documents.isCreateModalOpen.value = true
 * await documents.handleCreateSubmit()
 * ```
 */
export function useDocumentsIndex(options: UseDocumentsIndexOptions = {}): UseDocumentsIndexReturn {
  const {
    draftsInitialLimit = 10,
    documentsInitialLimit = 10,
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
    key: "documents-drafts",
    type: "Document" as PageType,
    status: "draft",
    initialLimit: draftsInitialLimit,
    nextLimit,
    immediate: fetchDraftsImmediate ?? isAuthorizedForDrafts.value,
  });

  /**
   * Published documents pagination
   */
  const documents = usePaginatedPages({
    key: "documents-published",
    type: "Document" as PageType,
    status: "published",
    initialLimit: documentsInitialLimit,
    nextLimit,
    immediate: true,
  });

  /**
   * State for new document form
   */
  const newDocumentState = reactive<NewDocumentState>({
    title: "",
    slug: "",
  });

  const isCreateModalOpen = ref(false);
  const isCreating = ref(false);

  /**
   * Auto-generate slug from title when title changes
   */
  watch(
    () => newDocumentState.title,
    (newTitle, oldTitle) => {
      const oldGeneratedSlug = slugify(oldTitle || "");
      // Only auto-update slug if it matches the old title's slug
      // (i.e., user hasn't manually edited it)
      if (!newDocumentState.slug || newDocumentState.slug === oldGeneratedSlug) {
        newDocumentState.slug = slugify(newTitle);
      }
    },
  );

  /**
   * Create a new document
   */
  const handleCreateSubmit = async (): Promise<void> => {
    isCreating.value = true;

    try {
      const createdPage = await $fetch<Page>("/api/pages", {
        method: "POST",
        body: {
          type: "Document",
          slug: newDocumentState.slug,
          title: { [locale.value]: newDocumentState.title },
          description: { [locale.value]: "" },
          content: {
            properties: {},
            blocks: [],
          },
        },
      });

      onToast?.({
        color: "success",
        title: t("pages.documents.actions.create_document.success.title"),
        description: t("pages.documents.actions.create_document.success.description"),
      });

      isCreateModalOpen.value = false;
      await navigateTo(`/documents/${createdPage.slug}/edit`);
    } catch (e: any) {
      onToast?.({
        color: "error",
        title: t("pages.documents.actions.create_document.error.title"),
        description: e.message || t("pages.documents.actions.create_document.error.description"),
      });
    } finally {
      isCreating.value = false;
    }
  };

  return {
    session,
    isAuthorizedForDrafts,
    drafts,
    documents,
    newDocumentState,
    isCreateModalOpen,
    isCreating,
    handleCreateSubmit,
  };
}
