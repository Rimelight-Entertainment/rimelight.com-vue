<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { strapiApiBase } = useRuntimeConfig().public;
const storeUrl = useRequestURL().origin;

const { data: productResult, pending, error } = await useApi<any>(`/api/products/${id}?populate=*`, {
  baseURL: strapiApiBase,
});

const product = computed(() => {
  if (!productResult.value?.data) return null;
  const p = productResult.value.data;
  return {
    id: p.id,
    title: p.Title,
    description: p.Description,
    price: p.Price,
    image: p.Image?.url ? (p.Image.url.startsWith('http') ? p.Image.url : `${strapiApiBase}${p.Image.url}`) : "/images/placeholders/placeholder_header_store.jpg",
    custom_field: p.custom_field || [],
  };
});

// Adapted custom fields logic from guide for Snipcart
const customFieldsBind = computed(() => {
  if (!product.value?.custom_field?.length) return {};

  return product.value.custom_field
    .map(({ title, required, options }: any) => ({
      name: title,
      required,
      options,
    }))
    .map((x: any, index: number) =>
      Object.entries(x).map(([key, value]) => ({
        [`data-item-custom${index + 1}-${key.toString().toLowerCase()}`]: value,
      }))
    )
    .reduce((acc: any, curr: any) => acc.concat(curr), [])
    .reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});
});

definePageMeta({
  layout: "store",
});

useSeoMeta({
  title: () => product.value?.title || "Product",
  description: () => product.value?.description || "",
});

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
  <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-16 py-12">
    <USkeleton class="aspect-square w-full rounded-2xl" />
    <div class="flex flex-col gap-6">
      <USkeleton class="h-10 w-3/4" />
      <USkeleton class="h-8 w-1/4" />
      <div class="flex flex-col gap-2">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-2/3" />
      </div>
      <USkeleton class="h-12 w-48" />
    </div>
  </div>

  <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start py-12">
    <!-- Image Showcase -->
    <div class="sticky top-40">
      <div class="relative group rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
        <NuxtImg
          :src="product.image"
          class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          alt=""
        />
        <div class="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-3xl"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-4">
        <UButton
          to="/store"
          variant="ghost"
          color="neutral"
          icon="lucide:chevron-left"
          class="-ml-3 w-max"
        >
          Back to Catalog
        </UButton>
        
        <div class="flex flex-col gap-2">
          <h1 class="text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
            {{ product.title }}
          </h1>
          <div class="items-center gap-4 flex">
             <span class="text-3xl font-bold text-primary-600">${{ product.price }}</span>
             <UBadge color="primary" variant="subtle" size="md">In Stock</UBadge>
          </div>
        </div>
      </div>

      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <div class="flex flex-col gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
        <!-- Buy Section -->
        <div class="flex flex-col gap-4">
          <UButton
            class="snipcart-add-item h-14 px-10 text-xl font-black rounded-2xl shadow-xl hover:shadow-primary-500/20 active:scale-95 transition-all"
            size="xl"
            icon="lucide:shopping-bag"
            :data-item-id="product.id"
            :data-item-price="product.price"
            :data-item-url="`${storeUrl}${route.fullPath}`"
            :data-item-description="product.description"
            :data-item-image="product.image"
            :data-item-name="product.title"
            v-bind="customFieldsBind"
          >
            Add to Shopping Bag
          </UButton>
          <p class="text-center text-xs text-gray-400">
            Secure checkout by Snipcart. Digital items delivered instantly.
          </p>
        </div>
        
        <!-- Features -->
        <div class="grid grid-cols-2 gap-4">
           <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <UIcon name="lucide:zap" class="size-6 text-primary-500" />
              <span class="text-sm font-semibold">Instant Access</span>
           </div>
           <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <UIcon name="lucide:shield-check" class="size-6 text-primary-500" />
              <span class="text-sm font-semibold">Buyer Protection</span>
           </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-24 gap-6">
     <UIcon name="lucide:search-x" class="size-20 text-gray-200" />
     <h2 class="text-3xl font-bold">Product not found</h2>
     <UButton to="/store" size="lg" icon="lucide:store">Return to Store</UButton>
  </div>
</template>
