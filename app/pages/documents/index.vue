<script lang="ts" setup>
import { useDocumentsIndex } from "rimelight-components/composables";

/* region State */
const { permissions } = useAuth();
const { t, locale } = useI18n();
const toast = useToast();

const docIndex = useDocumentsIndex({
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
  title: t("pages.documents.meta.title"),
});

useSeoMeta({
  title: t("pages.documents.meta.title"),
  ogTitle: t("pages.documents.meta.title"),
  description: t("pages.documents.meta.description"),
  ogDescription: t("pages.documents.meta.description"),
});
/* endregion */
</script>

<template>
  <UPage>
    <UContainer>
      <UPageHeader
        :title="t('pages.documents.meta.title')"
        :description="t('pages.documents.meta.description')"
        :ui="{
          title: 'text-black',
          description: 'text-neutral-500',
        }"
      >
        <template #links>
          <UButton
            v-if="permissions.documents.canCreate.value"
            icon="lucide:plus"
            :label="t('pages.documents.actions.create_document.label')"
            @click="docIndex.isCreateModalOpen.value = true"
            :ui="{
              base: 'text-white bg-primary-500 hover:bg-primary-600'
            }"
          />
        </template>
      </UPageHeader>
      <UPageBody>
        <!-- Drafts -->
        <div
          v-if="docIndex.isAuthorizedForDrafts && docIndex.drafts.initialStatus.value === 'pending' && !docIndex.drafts.allPages.value.length"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>

        <UAlert
          v-else-if="docIndex.isAuthorizedForDrafts && docIndex.drafts.initialStatus.value === 'error'"
          color="error"
          variant="subtle"
          icon="lucide:alert-circle"
          :title="t('pages.documents.drafts.error.title')"
          :description="t('pages.documents.drafts.error.description')"
          :actions="[
            {
              label: t('error.retry'),
              color: 'primary',
              variant: 'solid',
              icon: 'lucide:rotate-ccw',
              onClick: () => {
                docIndex.drafts.refresh()
              }
            }
          ]"
        />

        <RCSection
          v-else-if="docIndex.isAuthorizedForDrafts"
          :level="2"
          :title="t('pages.documents.drafts.title')"
          :description="t('pages.documents.drafts.description')"
          :rc="{
            title: 'text-black',
            description: 'text-neutral-500',
          }"
        >

          <div v-if="docIndex.drafts.allPages.value.length" class="flex flex-col gap-md">
            <div
              v-for="(doc, index) in docIndex.drafts.allPages.value"
              :key="doc.slug"
            >
              <NuxtLink
                :to="`/documents/${doc.slug}/edit`"
              >
                <div class="flex flex-col gap-xs">
                  <span class="text-primary-500 hover:text-primary-600">{{ getLocalizedContent(doc.title, locale) }}</span>
                  <span class="text-sm text-neutral-500">{{ doc.updatedAt ? useDateFormat(doc.updatedAt, 'DD/MM/YYYY').value : '' }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <UEmpty
            v-else-if="permissions.documents.canCreate.value"
            variant="naked"
            icon="lucide:file-text"
            :title="t('pages.documents.drafts.empty.title')"
            :description="t('pages.documents.drafts.empty.description')"
            :actions="[
              {
                label: t('pages.documents.drafts.empty.actions.create'),
                color: 'primary',
                variant: 'solid',
                icon: 'lucide:plus',
                onClick: () => {
                  docIndex.isCreateModalOpen.value = true
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
            v-if="docIndex.drafts.hasMore.value && docIndex.drafts.allPages.value.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              :disabled="docIndex.drafts.isFetchingMore.value"
              :loading="docIndex.drafts.isFetchingMore.value"
              color="primary"
              icon="lucide:arrow-down"
              :label="t('pages.documents.load_more')"
              size="lg"
              variant="solid"
              @click="docIndex.drafts.loadNextPage"
            />
          </div>
          <USeparator
            v-else-if="docIndex.drafts.allPages.value.length > 0 && !docIndex.drafts.hasMore.value && docIndex.drafts.hasLoadedNextPage.value"
            :ui="{ label: 'text-muted' }"
            class="py-12"
            :label="t('pages.documents.end_of_list')"
          />
        </RCSection>

        <!-- Documents -->
        <div
          v-if="docIndex.documents.initialStatus.value === 'pending' && !docIndex.documents.allPages.value.length"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <USkeleton class="col-span-full h-64 rounded-none md:h-80 lg:h-96" />
          <USkeleton v-for="i in 3" :key="i" class="h-96 rounded-none" />
        </div>

        <UAlert
          v-else-if="docIndex.documents.initialStatus.value === 'error'"
          color="error"
          variant="subtle"
          icon="lucide:alert-circle"
          :title="t('pages.documents.documents.error.title')"
          :description="t('pages.documents.documents.error.description')"
          :actions="[
            {
              label: t('error.retry'),
              color: 'primary',
              variant: 'solid',
              icon: 'lucide:rotate-ccw',
              onClick: () => {
                docIndex.documents.refresh()
              }
            }
          ]"
        />

        <RCSection
          v-else
          :level="2"
          :title="t('pages.documents.documents.title')"
          :description="t('pages.documents.documents.description')"
          :rc="{
            title: 'text-black',
            description: 'text-neutral-500',
          }"
        >
          <div v-if="docIndex.documents.allPages.value.length" class="flex flex-col gap-md">
            <div
              v-for="(doc, index) in docIndex.documents.allPages.value"
              :key="doc.slug"
            >
              <NuxtLink
                :to="`/documents/${doc.slug}/edit`"
              >
                <div class="flex flex-col gap-xs">
                  <span class="text-primary-500 hover:text-primary-600">{{ getLocalizedContent(doc.title, locale) }}</span>
                  <span class="text-sm text-neutral-500">{{ doc.updatedAt ? useDateFormat(doc.updatedAt, 'DD/MM/YYYY').value : '' }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <UEmpty
            v-else-if="permissions.documents.canCreate.value"
            variant="naked"
            icon="lucide:file-text"
            :title="t('pages.documents.documents.empty.title')"
            :description="t('pages.documents.documents.empty.description')"
            :actions="[
              {
                label: t('pages.documents.documents.empty.actions.create'),
                color: 'primary',
                variant: 'solid',
                icon: 'lucide:plus',
                onClick: () => {
                  docIndex.isCreateModalOpen.value = true
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
            v-if="docIndex.documents.hasMore.value && docIndex.documents.allPages.value.length > 0"
            class="col-span-full flex justify-center py-8"
          >
            <UButton
              :disabled="docIndex.documents.isFetchingMore.value"
              :loading="docIndex.documents.isFetchingMore.value"
              color="primary"
              icon="lucide:arrow-down"
              :label="t('pages.documents.documents.load_more')"
              size="lg"
              variant="solid"
              @click="docIndex.documents.loadNextPage"
            />
          </div>
          <USeparator
            v-else-if="docIndex.documents.allPages.value.length > 0 && !docIndex.documents.hasMore.value && docIndex.documents.hasLoadedNextPage.value"
            :ui="{ label: 'text-muted' }"
            class="py-12"
            :label="t('pages.documents.documents.end_of_list')"
          />
        </RCSection>
      </UPageBody>
    </UContainer>
  </UPage>

  <!-- Create Document Modal -->
  <UModal :open="docIndex.isCreateModalOpen.value" @update:open="docIndex.isCreateModalOpen.value = $event" :title="t('pages.documents.actions.create_document.modal.title')">
    <template #body>
      <div class="flex flex-col gap-sm">
        <UFormField :label="t('pages.documents.actions.create_document.modal.fields.title.title')" required>
          <UInput v-model="docIndex.newDocumentState.title" autofocus :placeholder="t('pages.documents.actions.create_document.modal.fields.title.placeholder')" />
        </UFormField>
        <UFormField :label="t('pages.documents.actions.create_document.modal.fields.slug.title')" :help="t('pages.documents.actions.create_document.modal.fields.slug.help')" required>
          <UInput v-model="docIndex.newDocumentState.slug" :placeholder="t('pages.documents.actions.create_document.modal.fields.slug.placeholder')" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-sm">
        <UButton
          color="error"
          :label="t('pages.documents.actions.create_document.modal.actions.cancel')"
          variant="ghost"
          @click="docIndex.isCreateModalOpen.value = false"
        />
        <UButton
          :loading="docIndex.isCreating.value"
          color="primary"
          :label="t('pages.documents.actions.create_document.modal.actions.submit')"
          @click="docIndex.handleCreateSubmit"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>
