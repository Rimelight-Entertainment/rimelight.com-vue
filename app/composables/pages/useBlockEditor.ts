import { type Ref, computed, ref, shallowRef } from "vue";
import { v7 as uuidv7 } from "uuid";
import type { Block } from "#types";

/**
 * Helper: Recursively finds the parent array and index of a block by ID.
 */
function findBlockLocation(
  blocks: Block[],
  id: string,
): { parentArray: Block[]; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (!block) continue;

    if (block.id === id) {
      return { parentArray: blocks, index: i };
    }

    // Since the children property only exists on certain block types,
    // we use the type guard established in the previous step.
    if ("children" in block.props && Array.isArray(block.props.children)) {
      // Recursion: TS knows block.props.children is Block[] here.
      const result = findBlockLocation(block.props.children as Block[], id);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Helper: Recursively regenerates IDs for a block and its children.
 * This is crucial to prevent duplicate keys in the DOM which kills focus.
 */
function regenerateIds(block: Block): void {
  block.id = uuidv7();

  // 💡 FIX: Apply the type guard to ensure 'children' property exists on 'props'.
  // This satisfies TypeScript that we are only accessing 'children' on container blocks.
  if ("children" in block.props && Array.isArray(block.props.children)) {
    // TypeScript now knows block.props.children is safe to access and iterate over (as Block[])

    // We can remove the redundant ': Block[]' cast here since the guard is strong enough,
    // but the following is also safe and clear:
    block.props.children.forEach((child: Block) => regenerateIds(child));
  }
  // No need for an 'else' block, as blocks without children simply terminate the recursion here.
}

function createDefaultBlock(type: Block["type"]): Block {
  const id = uuidv7();
  switch (type) {
    case "SectionBlock":
      return {
        id,
        type: "SectionBlock",
        props: {
          level: 2,
          title: "New Section",
          children: [],
        },
      };
    case "ParagraphBlock":
      return {
        id,
        type: "ParagraphBlock",
        props: {
          text: [],
        },
      };
    case "CalloutBlock":
      return {
        id,
        type: "CalloutBlock",
        props: {
          variant: "info",
          children: [],
        },
      };
    case "ImageBlock":
      return {
        id,
        type: "ImageBlock",
        props: {
          src: "https://placehold.co/600x400",
          alt: "Placeholder Image",
        },
      };

    default:
      return {
        id,
        type: "ParagraphBlock",
        props: { text: [] },
      } as Block;
  }
}

export function useBlockEditor(
  initialBlocks: Ref<Block[]>,
  { maxHistorySize = 100, onMutation }: { maxHistorySize?: number; onMutation?: () => void } = {},
) {
  // 1. Initializing (N/A)

  // 2. Refs
  const history = shallowRef<Block[][]>([]);
  const future = shallowRef<Block[][]>([]);
  const committedBlocks = ref<Block[]>(JSON.parse(JSON.stringify(initialBlocks.value)));

  // 3. Computed
  // ✅ CORRECT: canUndo is true if there is a state *in the history stack* to revert to.
  const canUndo = computed(() => history.value.length > 0);

  // ✅ CORRECT: canRedo is true if there is a state *in the future stack* to advance to.
  const canRedo = computed(() => future.value.length > 0);

  // 4. Methods
  /**
   * Captures the current state of initialBlocks, adds it to the history,
   * and clears the future stack.
   */
  /**
   * Captures the state *before* a mutation, adds it to the history,
   * and clears the future stack.
   */
  const captureSnapshot = () => {
    const snapshot: Block[] = JSON.parse(JSON.stringify(initialBlocks.value));

    // 1. Clear the future stack (new action invalidates undone states)
    future.value = [];

    // 💡 FIX 1: Force a new history array reference when pushing
    const newHistory = [...history.value, snapshot];

    // Enforce the size limit
    if (newHistory.length > maxHistorySize) {
      // Remove the oldest entry
      newHistory.shift();
    }

    // 3. Assign the new array to the ref
    history.value = newHistory;
  };

  /**
   * Central wrapper to execute any block mutation while managing history.
   * This is called by mutations (updateBlockProps, removeBlock, etc.)
   */
  const executeMutation = (mutationFn: () => void) => {
    if (onMutation) {
      onMutation(); // This triggers the Page-level snapshot
    } else {
      captureSnapshot(); // Fallback to internal block-only history
    }
    mutationFn();
  };

  // --- Core Undo/Redo Functions ---

  const undo = () => {
    if (history.value.length === 0) return;

    const currentState: Block[] = JSON.parse(JSON.stringify(initialBlocks.value));
    future.value = [currentState, ...future.value];

    const previousState = history.value[history.value.length - 1];

    if (previousState) {
      initialBlocks.value.splice(0, initialBlocks.value.length, ...previousState);

      const newHistory = [...history.value];
      newHistory.pop();
      history.value = newHistory;
    }
  };

  const redo = () => {
    if (future.value.length === 0) return;

    const currentState: Block[] = JSON.parse(JSON.stringify(initialBlocks.value));

    // 💡 FIX: Check size limit *after* pushing to history during redo.
    // If the history stack is full, we must discard the oldest item BEFORE adding the new one.
    let newHistory = [...history.value, currentState];

    // Enforce size limit on history before continuing
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    history.value = newHistory;

    const nextState = future.value[0];

    if (nextState) {
      initialBlocks.value.splice(0, initialBlocks.value.length, ...nextState);

      const newFuture = [...future.value];
      newFuture.shift();
      future.value = newFuture;
    }
  };

  // --- Refactored Block Mutation Methods ---

  // 💡 All public mutation methods must now call executeMutation()

  const updateBlockProps = (id: string, newProps: Record<string, any>) => {
    console.log(
      "[useBlockEditor] updateBlockProps called for ID:",
      id,
      "Keys:",
      Object.keys(newProps),
    );
    if (newProps.children) {
      console.log("[useBlockEditor] Updating children. Count:", newProps.children.length);
    }
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id);
      if (!loc) {
        console.warn("[useBlockEditor] Block not found for update:", id);
        return;
      }

      const oldBlock = loc.parentArray[loc.index];
      if (!oldBlock) return;

      // CRITICAL FIX: Instead of creating a new block object (which causes Vue to remount),
      // we mutate the existing block's props in place to preserve component instance
      Object.assign(oldBlock.props, newProps);

      console.log("[useBlockEditor] Block props updated in place:", {
        id: oldBlock.id,
        type: oldBlock.type,
        childrenCount: (oldBlock.props as any).children?.length,
      });
    });
  };

  const removeBlock = (id: string) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id);
      if (!loc) return;
      loc.parentArray.splice(loc.index, 1);
    });
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id);
      if (!loc) return;

      const { parentArray, index } = loc;
      const newIndex = index + direction;

      if (newIndex >= 0 && newIndex < parentArray.length) {
        // Alternative: Accessing by index [0] to get the movedBlock.
        const movedBlock = parentArray.splice(index, 1)[0];

        // We still need to confirm it's not undefined because the type of the result
        // of array access might be Block | undefined if the array is Block[].
        if (movedBlock) {
          parentArray.splice(newIndex, 0, movedBlock);
        }
      }
    });
  };

  const duplicateBlock = (id: string) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id);
      if (!loc) return;

      const original = loc.parentArray[loc.index];
      const clone: Block = JSON.parse(JSON.stringify(original));
      regenerateIds(clone);

      loc.parentArray.splice(loc.index + 1, 0, clone);
    });
  };

  const insertBlock = (
    newBlockType: Block["type"],
    targetId: string | null = null,
    position: "before" | "after" = "after",
  ) => {
    executeMutation(() => {
      const newBlock = createDefaultBlock(newBlockType);

      if (!targetId) {
        initialBlocks.value.push(newBlock);
        return;
      }

      const loc = findBlockLocation(initialBlocks.value, targetId);
      if (!loc) return;

      const { parentArray, index } = loc;
      const insertIndex = position === "after" ? index + 1 : index;
      parentArray.splice(insertIndex, 0, newBlock);
    });
  };

  const commitChanges = (): Block[] => {
    // 1. Take a deep copy of the current working state (initialBlocks)
    const committedSnapshot: Block[] = JSON.parse(JSON.stringify(initialBlocks.value));

    // 2. Update the internal ref
    committedBlocks.value = committedSnapshot;

    // 3. Return the snapshot for immediate use (e.g., passing to an API call)
    return committedSnapshot;
  };

  /**
   * Relocates a block from its current position to a new position.
   * Used for cross-container drag and drop operations.
   *
   * @param blockId - The ID of the block to relocate
   * @param targetContainerId - The ID of the target container block (null for root level)
   * @param targetIndex - The index within the target container where the block should be inserted
   */
  const relocateBlock = (
    blockId: string,
    targetContainerId: string | null,
    targetIndex: number,
  ) => {
    console.log("[useBlockEditor] relocateBlock called:", {
      blockId,
      targetContainerId,
      targetIndex,
    });

    executeMutation(() => {
      // 1. Find and remove the block from its current location
      const sourceLoc = findBlockLocation(initialBlocks.value, blockId);
      if (!sourceLoc) {
        console.warn("[useBlockEditor] Block not found for relocation:", blockId);
        return;
      }

      const block = sourceLoc.parentArray[sourceLoc.index];
      if (!block) {
        console.warn("[useBlockEditor] Block is undefined at location");
        return;
      }

      // Remove from source
      sourceLoc.parentArray.splice(sourceLoc.index, 1);
      console.log("[useBlockEditor] Block removed from source, now inserting at target");

      // 2. Find the target container
      let targetArray: Block[];

      if (targetContainerId === null) {
        // Target is root level
        targetArray = initialBlocks.value;
      } else {
        // Target is a container block
        const targetLoc = findBlockLocation(initialBlocks.value, targetContainerId);
        if (!targetLoc) {
          console.warn("[useBlockEditor] Target container not found:", targetContainerId);
          // Put block back at source location if target not found
          sourceLoc.parentArray.splice(sourceLoc.index, 0, block);
          return;
        }

        const targetBlock = targetLoc.parentArray[targetLoc.index];
        if (!targetBlock || !("children" in targetBlock.props)) {
          console.warn("[useBlockEditor] Target block does not have children prop");
          sourceLoc.parentArray.splice(sourceLoc.index, 0, block);
          return;
        }

        targetArray = targetBlock.props.children as Block[];
      }

      // 3. Insert at target position (clamp index to valid range)
      const safeIndex = Math.max(0, Math.min(targetIndex, targetArray.length));
      targetArray.splice(safeIndex, 0, block);

      console.log("[useBlockEditor] Block relocated successfully:", {
        blockId,
        targetContainerId,
        targetIndex: safeIndex,
        newTargetLength: targetArray.length,
      });
    });
  };

  return {
    // Mutations
    updateBlockProps,
    removeBlock,
    moveBlock,
    duplicateBlock,
    insertBlock,
    relocateBlock,
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    // State
    committedBlocks: committedBlocks,
    commitChanges: commitChanges,
  };
}
