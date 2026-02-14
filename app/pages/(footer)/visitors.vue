<script setup lang="ts">
import createGlobe from "cobe";

interface Location {
  latitude: number;
  longitude: number;
}

const myLocation = useState<Location>("location");
const globe: Ref<HTMLCanvasElement | null> = ref(null);
const phi = ref(0);
const locations = ref<Location[]>([]);

const { data, open } = useWebSocket(
  `/ws/visitors?latitude=${myLocation.value.latitude}&longitude=${myLocation.value.longitude}`,
  { immediate: false },
);
watch(data, async (newData) => {
  const rawData = typeof newData === "string" ? newData : await (newData as Blob).text();
  locations.value = JSON.parse(rawData) as Location[];
});

onMounted(() => {
  open();

  if (globe.value) {
    createGlobe(globe.value, {
      devicePixelRatio: 2,
      width: 512 * 2,
      height: 512 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 0.8,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 0.1],
      glowColor: [0.2, 0.2, 0.2],
      markers: [],
      opacity: 0.7,
      onRender(state) {
        const userLat = myLocation.value.latitude;
        const userLon = myLocation.value.longitude;

        state.markers = locations.value.map((location) => ({
          location: [location.latitude, location.longitude],
          // Check for the user's location based on coordinates
          size: userLat === location.latitude && userLon === location.longitude ? 0.1 : 0.05,
        }));
        // Rotate the globe
        state.phi = phi.value;
        phi.value += 0.01;
      },
    });
  } else {
    console.error("Canvas element 'globe' is not available on mount.");
  }
});
</script>

<template>
  <UPage>
    <UPageSection
      title="Current Visitors"
      :description="`${locations.length} ${locations.length === 1 ? 'person' : 'people'} connected.`"
    >
      <div class="flex flex-col items-center">
        <canvas ref="globe" class="h-lg w-lg align-middle" />
      </div>
    </UPageSection>
  </UPage>
</template>

<style scoped>
canvas {
  aspect-ratio: 1;
}
</style>
