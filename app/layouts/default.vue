<script setup lang="ts">
import ConstructionBanner from "~/components/navigation/ConstructionBanner.vue"
</script>

<template>
  <div>
    <RLConstructionBanner />
    <RLAppHeader />
    <UMain class="bg-offwhite">
      <slot />
    </UMain>
    <RLAppFooter />
  </div>
</template>

<style scoped></style>
