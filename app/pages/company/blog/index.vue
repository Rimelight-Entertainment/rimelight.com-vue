<script lang="ts" setup>
import { useBlogIndex } from "rimelight-components/composables";

/* region State */
const { permissions } = useAuth();
const { t, locale } = useI18n();
const toast = useToast();

const blog = useBlogIndex({
  onToast: (options) => {
    toast.add({
      color: options.color,
      title: options.title,
      description: options.description,
    });
  },
});
/* endregion */

/* region Meta */
useHead({
  title: t("pages.blog.meta.title"),
  link: [
    {
      rel: "alternate",
      type: "application/atom+xml",
      title: t("pages.blog.meta.rss"),
      href: "https://rimelight.com/company/blog/rss.xml",
    },
  ],
});

useSeoMeta({
  title: t("pages.blog.meta.title"),
  ogTitle: t("pages.blog.meta.title"),
  description: t("pages.blog.meta.description"),
  ogDescription: t("pages.blog.meta.description"),
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <UPage>
    <UContainer>
      <UPageHeader :title="t('pages.blog.meta.title')" :ui="{
        title: 'text-black',
        description: 'text-neutral-500',
      }">
        <template #description>
          <div class="flex flex-col gap-md">
            {{ t('pages.blog.meta.description') }}
            <RCNewsletterSignup :title="t('app.newsletter.title')" :description="t('app.newsletter.description')" :submit="t('app.newsletter.submit')" :rc="{ label: 'text-black', description: 'text-neutral-500', button: 'text-white bg-primary-500 hover:bg-primary-600' }" />
          </div>
        </template>
        <template #links>
          <UButton
            icon="lucide:rss"
            :label="t('pages.blog.actions.rss')"
            to="/company/blog/rss.xml"
            :ui="{
              base: 'text-white bg-primary-500 hover:bg-primary-600'
            }"
          />
          <UButton
            v-if="permissions.blog.canCreate.value"
            icon="lucide:plus"
            :label="t('pages.blog.actions.create_post.label')"
            @click="blog.isCreateModalOpen.value = true"
            :ui="{
              base: 'text-white bg-primary-500 hover:bg-primary-600'
            }"
          />
        </template>
      </UPageHeader>
      <UPageBody>
        <!-- Drafts -->
        <div
          v-if="blog.isAuthorizedForDrafts && blog.drafts.initialStatus.value === 'pending' && !blog.drafts.allPages.value.length"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>

        <UAlert
          v-else-if="blog.isAuthorizedForDrafts && blog.drafts.initialStatus.value === 'error'"
          color="error"
          variant="subtle"
          icon="lucide:alert-circle"
          :title="t('pages.blog.drafts.error.title')"
          :description="t('pages.blog.drafts.error.description')"
          :actions="[
            {
              label: t('error.retry'),
              color: 'primary',
              variant: 'solid',
              icon: 'lucide:rotate-ccw',
              onClick: () => {
                blog.drafts.refresh()
              }
            }
          ]"
        />

        <RCSection
          v-else-if="blog.isAuthorizedForDrafts"
          :level="2"
          :title="t('pages.blog.drafts.title')"
          :description="t('pages.blog.drafts.description')"
          :rc="{
            title: 'text-black',
            description: 'text-neutral-500',
          }"
        >
          <UBlogPosts v-if="blog.drafts.allPages.value.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
              v-for="(post, index) in blog.drafts.allPages.value"
              :key="post.slug"
              variant="naked"
              :image="{
                src: post.banner?.src || '/images/placeholders/placeholder_home_projects_grand-tale.png',
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246,
              }"
              :title="getLocalizedContent(post.title, locale)"
              :description="getLocalizedContent(post.description, locale)"
              :authors="[]"
              :badge="{
                label: t('common.types.' + post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0',
              }"
              :date="post.postedAt ? useDateFormat(post.postedAt, 'DD/MM/YYYY').value : ''"
              :orientation="index === 0 ? 'horizontal' : 'vertical'"
              :to="`/company/blog/${post.slug}/edit`"
              :ui="{
                image: 'object-center object-cover',
                badge: 'text-primary-500',
                date: 'text-neutral-500',
                title: 'text-black',
                description: 'text-neutral-500'
               }"
              :class="[index === 0 && 'col-span-full']"
            />
          </UBlogPosts>

          <UEmpty
            v-else-if="permissions.blog.canCreate.value"
            variant="naked"
            icon="lucide:pen-tool"
            :title="t('pages.blog.drafts.empty.title')"
            :description="t('pages.blog.drafts.empty.description')"
            :actions="[
              {
                label: t('pages.blog.drafts.empty.actions.create'),
                color: 'primary',
                variant: 'solid',
                icon: 'lucide:plus',
                onClick: () => {
                  blog.isCreateModalOpen.value = true
                },
                class: 'text-white bg-primary-500 hover:bg-primary-600'
              },
            ]"
            :ui="{
              title: 'text-black',
              description: 'text-neutral-500'
            }"
          />

          <div
            v-if="blog.drafts.hasMore.value && blog.drafts.allPages.value.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              :disabled="blog.drafts.isFetchingMore.value"
              :loading="blog.drafts.isFetchingMore.value"
              color="primary"
              icon="lucide:arrow-down"
              :label="t('pages.blog.load_more')"
              size="lg"
              variant="solid"
              @click="blog.drafts.loadNextPage"
            />
          </div>
          <USeparator
            v-else-if="blog.drafts.allPages.value.length > 0 && !blog.drafts.hasMore.value && blog.drafts.hasLoadedNextPage.value"
            :ui="{ label: 'text-muted' }"
            class="py-12"
            :label="t('pages.blog.end_of_list', { list: t('common.drafts') })"
          />
        </RCSection>

        <!-- Posts -->
        <div
          v-if="blog.posts.initialStatus.value === 'pending' && !blog.posts.allPages.value.length"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>

        <UAlert
          v-else-if="blog.posts.initialStatus.value === 'error'"
          color="error"
          variant="subtle"
          icon="lucide:alert-circle"
          :title="t('pages.blog.posts.error.title')"
          :description="t('pages.blog.posts.error.description')"
          :actions="[
            {
              label: t('error.retry'),
              color: 'primary',
              variant: 'solid',
              icon: 'lucide:rotate-ccw',
              onClick: () => {
                blog.posts.refresh()
              }
            }
          ]"
        />

        <RCSection
          v-else
          :level="2"
          :title="t('pages.blog.posts.title')"
          :description="t('pages.blog.posts.description')"
          :rc="{
            title: 'text-black',
            description: 'text-neutral-500',
          }"
        >
          <UBlogPosts v-if="blog.posts.allPages.value.length" class="md:grid-cols-2 lg:grid-cols-3">
            <UBlogPost
              v-for="(post, index) in blog.posts.allPages.value"
              :key="post.slug"
              variant="naked"
              :image="{
                src: post.banner?.src || '/images/placeholders/placeholder_home_projects_grand-tale.png',
                alt: post.banner?.alt,
                width: index === 0 ? 672 : 437,
                height: index === 0 ? 378 : 246,
              }"
              :title="getLocalizedContent(post.title, locale)"
              :description="getLocalizedContent(post.description, locale)"
              :authors="[]"
              :badge="{
                label: t('common.types.' + post.type),
                color: 'primary',
                variant: 'outline',
                class: 'rounded-none p-0 ring-0',
              }"
              :date="post.postedAt ? useDateFormat(post.postedAt, 'DD/MM/YYYY').value : ''"
              :orientation="index === 0 ? 'horizontal' : 'vertical'"
              :to="`/company/blog/${post.slug}/edit`"
              :ui="{
                image: 'object-center object-cover',
                badge: 'text-primary-500',
                date: 'text-neutral-500',
                title: 'text-black',
                description: 'text-neutral-500'
               }"
              :class="[index === 0 && 'col-span-full']"
            />
          </UBlogPosts>

          <UEmpty
            v-else-if="permissions.blog.canCreate.value"
            variant="naked"
            icon="lucide:pen-tool"
            :title="t('pages.blog.posts.empty.title')"
            :description="t('pages.drafts.posts.empty.description')"
            :actions="[
              {
                label: t('pages.blog.posts.empty.actions.create'),
                color: 'primary',
                variant: 'solid',
                icon: 'lucide:plus',
                onClick: () => {
                  blog.isCreateModalOpen.value = true
                },
                class: 'text-white bg-primary-500 hover:bg-primary-600'
              },
            ]"
            :ui="{
              title: 'text-black',
              description: 'text-neutral-500'
            }"
          />

          <div
            v-if="blog.posts.hasMore.value && blog.posts.allPages.value.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              :disabled="blog.posts.isFetchingMore.value"
              :loading="blog.posts.isFetchingMore.value"
              color="primary"
              icon="lucide:arrow-down"
              :label="t('pages.blog.posts.load_more')"
              size="lg"
              variant="solid"
              @click="blog.posts.loadNextPage"
            />
          </div>
          <USeparator
            v-else-if="blog.posts.allPages.value.length > 0 && !blog.posts.hasMore.value && blog.posts.hasLoadedNextPage.value"
            :ui="{ label: 'text-muted' }"
            class="py-12"
            :label="t('pages.blog.posts.end_of_list')"
          />
        </RCSection>
      </UPageBody>
    </UContainer>
  </UPage>

  <!-- Create Post Modal -->
  <UModal :open="blog.isCreateModalOpen.value" @update:open="blog.isCreateModalOpen.value = $event" :title="t('pages.blog.actions.create_post.modal.title')">
    <template #body>
      <div class="flex flex-col gap-sm">
        <UFormField :label="t('pages.blog.actions.create_post.modal.fields.title.title')" required>
          <UInput v-model="blog.newPostState.title" autofocus :placeholder="t('pages.blog.actions.create_post.modal.fields.title.placeholder')" />
        </UFormField>
        <UFormField :label="t('pages.blog.actions.create_post.modal.fields.slug.title')" :help="t('pages.blog.actions.create_post.modal.fields.slug.help')" required>
          <UInput v-model="blog.newPostState.slug" :placeholder="t('pages.blog.actions.create_post.modal.fields.slug.placeholder')" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-sm">
        <UButton
          color="error"
          :label="t('pages.blog.actions.create_post.modal.actions.cancel')"
          variant="ghost"
          @click="blog.isCreateModalOpen.value = false"
        />
        <UButton
          :loading="blog.isCreating.value"
          color="primary"
          :label="t('pages.blog.actions.create_post.modal.actions.submit')"
          @click="blog.handleCreateSubmit"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>
