<script setup lang="ts">
import type { Page } from "#rimelight-components/types";

definePageMeta({
  layout: 'grand-tale'
});

const route = useRoute();
const category = (route.params.category as string) || 'characters';
const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

// Map category slug to page type
const categoryToType: Record<string, string> = {
  'characters': 'Character',
  'locations': 'Location',
  'species': 'Species',
  'items': 'Item',
  'skills': 'Skill',
  'heroes': 'Hero'
};

const pageType = categoryToType[category];

useHead({
  title: `${categoryLabel} | Grand Tale Wiki`,
});

// Fetch pages of this type
const { data: pages, status, error } = await useApi<Page[]>('/api/pages', {
  query: {
    type: pageType,
    status: 'published',
    limit: 100,
    orderBy: 'title',
    order: 'asc'
  },
  key: `wiki-${category}`
});
</script>

<template>
  <div class="py-20">
    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Wiki Sidebar -->
        <div class="lg:col-span-1">
          <RLWikiSidebar />
        </div>

        <!-- Category Content -->
        <main class="lg:col-span-3 space-y-12">
          <section class="space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest">
              {{ pageType }}
            </div>
            <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">{{ categoryLabel }}</h1>
            <p class="text-xl text-primary-100/60 font-light max-w-2xl leading-relaxed">
              Browse all {{ categoryLabel.toLowerCase() }} in the Grand Tale universe.
            </p>
          </section>

          <hr class="border-primary-800/30" />

          <!-- Loading State -->
          <div v-if="status === 'pending'" class="flex items-center justify-center p-12">
            <UIcon class="animate-spin size-8 text-primary-500" name="i-heroicons-arrow-path" />
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 bg-error/10 border border-error/50 rounded-none">
            <p class="text-error">Failed to load {{ categoryLabel.toLowerCase() }}. Please try again later.</p>
          </div>

          <!-- Empty State -->
          <UEmpty v-else-if="!pages || pages.length === 0" 
            icon="i-lucide-inbox"
            :title="`No ${categoryLabel} Yet`"
            :description="`Articles in this category are currently being written.`"
          />

          <!-- Pages Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink 
              v-for="page in pages" 
              :key="page.id" 
              :to="`/${page.slug}`"
              class="group"
            >
              <UCard class="bg-primary-800/10 border-primary-800/50 hover:bg-primary-500/5 hover:border-primary-500/50 transition-all h-full">
                <div class="space-y-3">
                  <div class="flex items-start justify-between gap-4">
                    <h3 class="text-lg font-bold text-white group-hover:text-primary-400 uppercase line-clamp-2">
                      {{ getLocalizedContent(page.title, 'en') }}
                    </h3>
                    <UIcon v-if="page.icon" :name="page.icon" class="size-5 text-primary-500 flex-shrink-0" />
                  </div>
                  <p v-if="page.description" class="text-sm text-primary-100/60 line-clamp-3 leading-relaxed">
                    {{ getLocalizedContent(page.description, 'en') }}
                  </p>
                  <div class="flex items-center gap-2 text-xs text-primary-500 font-bold uppercase">
                    Read More
                    <UIcon name="i-lucide-arrow-right" class="size-3" />
                  </div>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </main>
      </div>
    </UContainer>
  </div>
</template>
