import { computed, type Ref, shallowRef, watch } from "vue";
import { type Page } from "~/types";

export function usePageEditor(page: Ref<Page>, maxHistorySize: number = 100) {
  // 1. Initializing (N/A)

  // 2. Refs
  const history = shallowRef<string[]>([]); // Store as JSON strings for clean snapshots
  const future = shallowRef<string[]>([]);
  // Store the state as it was when it was last "captured" or loaded
  let lastCapturedState = JSON.stringify(page.value);
  // Watch for changes in properties, title, and blocks
  let isPaused = false;

  // 3. Computed
  const canUndo = computed(() => history.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  // 4. Methods
  const captureSnapshot = () => {
    const currentSnapshot = JSON.stringify(page.value);

    // Only push if the state actually changed to avoid "empty" undo steps
    if (currentSnapshot === lastCapturedState) return;

    future.value = [];
    const newHistory = [...history.value, lastCapturedState];
    if (newHistory.length > maxHistorySize) newHistory.shift();
    history.value = newHistory;

    lastCapturedState = currentSnapshot;
  };

  const undo = () => {
    if (history.value.length === 0) return;

    const currentState = JSON.stringify(page.value);
    future.value = [currentState, ...future.value];

    const previousStateString = history.value[history.value.length - 1]!;
    lastCapturedState = previousStateString; // Update last captured to the one we are moving to

    page.value = JSON.parse(previousStateString);

    const newHistory = [...history.value];
    newHistory.pop();
    history.value = newHistory;
  };

  const redo = () => {
    if (future.value.length === 0) return;

    const currentState = JSON.stringify(page.value);
    history.value = [...history.value, currentState];
    lastCapturedState = currentState;

    const nextStateString = future.value[0]!;
    page.value = JSON.parse(nextStateString);
    lastCapturedState = nextStateString;

    const newFuture = [...future.value];
    newFuture.shift();
    future.value = newFuture;
  };

  const save = () => {
    return JSON.parse(JSON.stringify(page.value));
  };

  const pauseHistory = () => {
    console.log("[usePageEditor] History paused");
    isPaused = true;
  };

  const resumeHistory = () => {
    console.log("[usePageEditor] History resumed");
    isPaused = false;
  };

  const resetHistory = () => {
    history.value = [];
    future.value = [];
    lastCapturedState = JSON.stringify(page.value);
  };

  // 5. Watch
  watch(
    [() => page.value.properties, () => page.value.title, () => page.value.blocks],
    () => {
      if (isPaused) {
        console.log("[usePageEditor] Skipping auto-snapshot - history is paused");
        return;
      }
      // We might want to debounce this so typing in a text field
      // doesn't create 50 history states
      captureSnapshot();
    },
    { deep: true },
  );

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    save,
    captureSnapshot,
    resetHistory,
    pauseHistory,
    resumeHistory,
  };
}
