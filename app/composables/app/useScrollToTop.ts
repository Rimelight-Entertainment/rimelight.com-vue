import { computed, onMounted, onUnmounted } from "vue";
import { defaultDocument, defaultWindow } from "#utils";

export const useScrollToTop = () => {
  // 1. Initializing (N/A)

  // 2. Refs
  const scrollPercentage = useState("scroll-percentage", () => 0);
  const minScrollThreshold = 15;

  // 3. Computed
  const isVisible = computed(() => scrollPercentage.value >= minScrollThreshold);

  // 4. Methods
  function updatePageScroll() {
    if (!defaultWindow || !defaultDocument) {
      return;
    }

    const scrollY = defaultWindow.scrollY;
    const maxScroll = defaultDocument.body.scrollHeight - defaultWindow.innerHeight;

    if (maxScroll <= 0) {
      scrollPercentage.value = 0;
      return;
    }

    scrollPercentage.value = Math.min((scrollY / maxScroll) * 100, 100);
  }

  function scrollToTop() {
    if (!defaultWindow) return;

    defaultWindow.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // 5. Lifecycle
  if (import.meta.client) {
    onMounted(() => {
      if (!defaultWindow) return;
      defaultWindow.addEventListener("scroll", updatePageScroll, { passive: true });
      updatePageScroll();
    });

    onUnmounted(() => {
      if (!defaultWindow) return;
      defaultWindow.removeEventListener("scroll", updatePageScroll);
    });
  }

  return {
    scrollPercentage,
    isVisible,
    scrollToTop,
  };
};
