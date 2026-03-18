<script setup lang="ts">
import { h, resolveComponent, ref } from "vue"
import { getPaginationRowModel } from "@tanstack/vue-table"
import type { TableColumn } from "@nuxt/ui"
import type { Page } from "#rimelight-components/types"

definePageMeta({
  layout: "wiki"
})

const route = useRoute()
const category = ((route.params.category as string) || "characters").toLowerCase()
const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)

// Map category slug to page type
const categoryToType: Record<string, string> = {
  characters: "Character",
  locations: "Location",
  species: "Species",
  items: "Item",
  objects: "Object",
  groups: "Group",
  skills: "Skill",
  heroes: "Hero",
  series: "Series"
}

const pageType = categoryToType[category] || "Character"

useHead({
  title: `${categoryLabel} | Grand Tale Wiki`
})

const { locale } = useI18n()

// Fetch pages of this type
const {
  data: pages,
  status,
  error
} = await useApi<Page[]>("/api/pages", {
  query: {
    type: pageType,
    status: "published",
    limit: 1000,
    orderBy: "title",
    order: "asc"
  },
  key: `wiki-cat-${category}`
})

const UIcon = resolveComponent("UIcon")
const NuxtLink = resolveComponent("NuxtLink")

const columns: TableColumn<Page>[] = [
  {
    accessorFn: (row) => getLocalizedContent(row.title, locale.value),
    id: "title",
    header: "Title",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-3" }, [
        h(UIcon, {
          name: row.original.icon || "lucide:file-text",
          class: "size-5 text-grand-tale-secondary-500 flex-shrink-0"
        }),
        h(
          NuxtLink,
          {
            to: `/${row.original.slug}`,
            class:
              "font-bold text-white hover:text-grand-tale-secondary-400 uppercase transition-colors"
          },
          {
            default: () => getLocalizedContent(row.original.title, locale.value)
          }
        )
      ])
    }
  },
  {
    accessorFn: (row) => getLocalizedContent(row.description, locale.value),
    id: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = getLocalizedContent(row.original.description, locale.value)
      return h(
        "span",
        { class: "text-grand-tale-secondary-100/60 line-clamp-1 max-w-md" },
        description || "---"
      )
    }
  },
  {
    id: "actions",
    header: "",
    meta: {
      class: {
        td: "text-right"
      }
    },
    cell: ({ row }) => {
      return h(
        NuxtLink,
        {
          to: `/${row.original.slug}`,
          class:
            "inline-flex items-center gap-2 text-xs text-grand-tale-secondary-500 font-bold uppercase hover:text-grand-tale-secondary-400 transition-colors"
        },
        {
          default: () => ["Read More", h(UIcon, { name: "lucide:arrow-right", class: "size-3" })]
        }
      )
    }
  }
]

const table = useTemplateRef("table")
const globalFilter = ref("")
const pagination = ref({
  pageIndex: 0,
  pageSize: 15
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
  <div class="space-y-12">
    <section class="space-y-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-grand-tale-primary-500/10 border border-grand-tale-secondary-500/20 text-grand-tale-secondary-400 text-xs font-bold uppercase tracking-widest"
      >
        {{ pageType }}
      </div>
      <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-none">
        {{ categoryLabel }}
      </h1>
      <p class="text-xl text-grand-tale-secondary-100/60 font-light max-w-2xl leading-relaxed">
        Browse all {{ categoryLabel.toLowerCase() }} in the Grand Tale universe.
      </p>
    </section>

    <hr class="border-grand-tale-secondary-800/30" />

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex items-center justify-center p-12">
      <UIcon class="animate-spin size-8 text-grand-tale-secondary-500" name="lucide:loader-2" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 bg-error/10 border border-error/50 rounded-none">
      <p class="text-error">
        Failed to load {{ categoryLabel.toLowerCase() }}. Please try again later.
      </p>
    </div>

    <!-- Content Table -->
    <div v-else class="space-y-6">
      <div class="flex items-center gap-4">
        <UInput
          v-model="globalFilter"
          icon="lucide:search"
          placeholder="Filter articles..."
          class="max-w-xs w-full"
          variant="outline"
          color="neutral"
          :ui="{
            base: 'bg-grand-tale-primary-800/20 border-grand-tale-secondary-800/50 focus:border-grand-tale-secondary-500/50 transition-colors'
          }"
        />
      </div>

      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        :data="pages || []"
        :columns="columns"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        sticky
        class="border border-grand-tale-secondary-800/50 bg-grand-tale-primary-800/10"
        :ui="{
          thead: 'bg-grand-tale-primary-900/50 backdrop-blur-sm',
          th: 'text-grand-tale-secondary-400 font-black uppercase tracking-wider border-b border-grand-tale-secondary-800/50',
          td: 'border-b border-grand-tale-secondary-800/30'
        }"
      >
        <template #empty>
          <div class="p-12 text-center space-y-4">
            <UIcon name="lucide:inbox" class="size-16 text-grand-tale-secondary-500/50 mx-auto" />
            <h3 class="text-xl font-bold text-white">No {{ categoryLabel }} Yet</h3>
            <p class="text-grand-tale-secondary-100/60">
              Articles in this category are currently being written.
            </p>
          </div>
        </template>
      </UTable>

      <div v-if="pages && pages.length > pagination.pageSize" class="flex justify-end pt-6">
        <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </div>
</template>
