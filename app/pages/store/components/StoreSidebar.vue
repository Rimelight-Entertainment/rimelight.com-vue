<script setup lang="ts">
const categories = [
  { label: 'All Products', icon: 'lucide:grid-3x3', to: '/store' },
  { label: 'Digital Goods', icon: 'lucide:zap', to: '/store?category=digital' },
  { label: 'Merchandise', icon: 'lucide:shirt', to: '/store?category=merch' },
  { label: 'Early Access', icon: 'lucide:clock', to: '/store?category=early' },
];

const supportLinks = [
  { label: 'Shipping Policy', to: '/store/shipping' },
  { label: 'Refunds & Returns', to: '/store/returns' },
  { label: 'Contact Support', to: '/support' },
];

/* region Props */
/* endregion */

/* region Emits */
/* endregion */

/* region Slots */
/* endregion */

/* region Styles */
/* endregion */

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
  <div class="flex flex-col gap-sm p-md">
    <!-- Categories -->
    <div class="flex flex-col gap-3">
      <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 px-4">
        Browse
      </h3>
      <UNavigationMenu
        :items="categories"
        orientation="vertical"
        class="w-full"
        variant="link"
        :ui="{
          link: 'text-gray-600 dark:text-gray-400 hover:text-primary-500 px-4 py-2 font-medium transition-colors'
        }"
      />
    </div>

    <!-- Stats Card -->
    <div class="rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10 p-5 flex flex-col gap-1">
      <span class="text-xs font-bold text-primary-500/60 uppercase tracking-tight">Active Offers</span>
      <span class="text-2xl font-black text-primary-600 dark:text-primary-400">10% OFF</span>
      <p class="text-[10px] text-gray-500 leading-tight">Apply 'RIMELIGHT' at checkout for your first order.</p>
    </div>

    <!-- Support Section -->
    <div class="flex flex-col gap-3 mt-auto">
      <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 px-4">
        Help Center
      </h3>
      <div class="flex flex-col gap-1 px-4 text-sm">
        <NuxtLink
          v-for="link in supportLinks"
          :key="link.label"
          :to="link.to"
          class="text-gray-500 dark:text-gray-500 hover:text-primary-500 transition-colors py-1"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
