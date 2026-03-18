<script setup lang="ts">
const { strapiApiBase } = useRuntimeConfig().public
const {
  data: productsResult,
  pending,
  error
} = await useApi<any>("/api/products?populate=*", {
  baseURL: strapiApiBase as string
})

const products = computed(() => {
  if (!productsResult.value?.data) return []
  return productsResult.value.data.map((p: any) => ({
    id: p.documentId || p.id,
    title: p.Title,
    description: p.Description,
    price: p.Price,
    image: p.Image?.url
      ? p.Image.url.startsWith("http")
        ? p.Image.url
        : `${strapiApiBase}${p.Image.url}`
      : "/images/placeholders/placeholder_header_store.jpg"
  }))
})

definePageMeta({
  title: "Store",
  layout: "store"
})

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- Header -->
    <div class="flex flex-col gap-4 text-center max-w-2xl mx-auto">
      <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Our <span class="text-primary-500">Store</span>
      </h1>
      <p class="text-xl text-gray-500 dark:text-gray-400">
        Premium digital goods and official merchandise from Rimelight Entertainment.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="i in 8" :key="i" class="flex flex-col gap-4">
        <USkeleton class="aspect-square w-full rounded-2xl" />
        <USkeleton class="h-6 w-3/4" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-1/2" />
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-24 gap-4 bg-gray-50 dark:bg-gray-900 rounded-3xl"
    >
      <UIcon name="lucide:alert-circle" class="size-16 text-red-500" />
      <div class="text-center">
        <p class="text-2xl font-bold">Failed to load products</p>
        <p class="text-gray-500">Please make sure the Strapi server is running.</p>
      </div>
      <UButton color="neutral" icon="lucide:refresh-cw" @click="() => {}">Try Again</UButton>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/store/${product.id}`"
        class="group relative flex flex-col gap-4"
      >
        <!-- Image Container -->
        <div
          class="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 group-hover:shadow-xl group-hover:ring-primary-500/50"
        >
          <NuxtImg
            :src="product.image"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt=""
            loading="lazy"
          />

          <!-- Quick Add Overlay (aesthetic) -->
          <div
            class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center"
          >
            <span class="text-white font-bold text-sm">View Details</span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1">
          <div class="flex items-start justify-between gap-2">
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-500 transition-colors"
            >
              {{ product.title }}
            </h3>
            <span class="text-lg font-black text-primary-600">${{ product.price }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">
            {{ product.description }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="!pending && !error && products.length === 0" class="text-center py-24">
      <UIcon name="lucide:shopping-bag" class="size-16 text-gray-300 mx-auto" />
      <h2 class="mt-4 text-2xl font-bold">No products found</h2>
      <p class="text-gray-500">Check back later for new arrivals.</p>
    </div>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>
