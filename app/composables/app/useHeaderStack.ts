import { computed } from "vue";

interface HeaderLayer {
  id: string;
  height: number;
  order: number;
}

export const useHeaderStack = () => {
  // 1. Initializing (N/A)

  // 2. Refs
  const layers = useState<HeaderLayer[]>("header-layers", () => []);

  // 3. Computed
  const totalHeight = computed(() => layers.value.reduce((acc, l) => acc + l.height, 0));

  /**
   * Returns a map of ID -> Top Offset (Sum of heights of layers above)
   */
  const offsets = computed(() => {
    const map: Record<string, number> = {};
    let currentOffset = 0;

    layers.value.forEach((layer) => {
      map[layer.id] = currentOffset;
      currentOffset += layer.height;
    });

    return map;
  });

  /**
   * Returns a map of ID -> Bottom Offset (Sum of heights including this layer)
   * Useful for dropdowns/menus that need to sit flush below the header
   */
  const bottomOffsets = computed(() => {
    const map: Record<string, number> = {};
    let currentOffset = 0;

    layers.value.forEach((layer) => {
      currentOffset += layer.height;
      map[layer.id] = currentOffset;
    });

    return map;
  });

  /**
   * Returns a map of ID -> Z-Index
   * Top layers should have higher z-index than bottom layers
   */
  const zIndices = computed(() => {
    const map: Record<string, number> = {};
    layers.value.forEach((layer, index) => {
      map[layer.id] = 100 - index;
    });
    return map;
  });

  // 4. Methods
  const registerHeader = (id: string, height: number, order: number = 10) => {
    const existingLayer = layers.value.find((l) => l.id === id);
    if (existingLayer) {
      if (existingLayer.height !== height) {
        existingLayer.height = height;
      }
    } else {
      layers.value.push({ id, height, order });
      layers.value.sort((a, b) => (a.order !== b.order ? a.order - b.order : 0));
    }
  };

  const unregisterHeader = (id: string) => {
    layers.value = layers.value.filter((l) => l.id !== id);
  };

  return {
    registerHeader,
    unregisterHeader,
    totalHeight,
    offsets,
    bottomOffsets,
    zIndices,
    layers: computed(() => layers.value),
  };
};
