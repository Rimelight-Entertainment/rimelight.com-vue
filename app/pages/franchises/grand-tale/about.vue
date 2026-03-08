<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

/* region State */
const { t, tm, rt } = useI18n();

const faqGroups = computed(() => {
  const groups = tm(("pages.franchises.grandTale.about.sections.faq." + "groups") as any) as any;
  return Object.entries(groups).map(([key, group]: [string, any]) => ({
    label: rt(group.title),
    questions: Object.entries(group)
      .filter(([k]) => k.startsWith("q"))
      .map(([, q]: [string, any]) => ({
        label: rt(q.question),
        content: rt(q.answer),
      })),
  }));
});

const specificationPlatforms = computed(() => {
  const platforms = tm(
    ("pages.franchises.grandTale.about.sections.specifications." + "platforms") as any,
  ) as any;
  return Object.entries(platforms).map(([key, platform]: [string, any]) => ({
    label: rt(platform.label),
    specs: platform.specs.map((s: any) => ({
      label: rt(s.label),
      value: rt(s.value),
    })),
  }));
});
/* endregion */

/* region Meta */
useHead({
  title: t("pages.franchises.grandTale.about.meta.title"),
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <UPage>
    <UPageHero
      :title="t('pages.franchises.grandTale.about.sections.hero.title')"
      :description="t('pages.franchises.grandTale.about.sections.hero.description')"
    />
    <UPageSection
      :title="t('pages.franchises.grandTale.about.sections.story.title')"
      :description="t('pages.franchises.grandTale.about.sections.story.description')"
    />
    <UPageSection
      :title="t('pages.franchises.grandTale.about.sections.characters.title')"
      :description="t('pages.franchises.grandTale.about.sections.characters.description')"
    >
      <UTabs> </UTabs>
    </UPageSection>
    <UPageSection
      :title="t('pages.franchises.grandTale.about.sections.specifications.title')"
      :description="t('pages.franchises.grandTale.about.sections.specifications.description')"
    >
      <UTabs
        :items="specificationPlatforms"
        variant="link"
        class="max-w-3xl mx-auto"
        :ui="{
          list: 'justify-center border-b border-default-200 mb-8',
          trigger: 'px-8 py-3 text-base',
        }"
      >
        <template #content="{ item }">
          <div class="space-y-4 px-4 pb-8">
            <div
              v-for="spec in item.specs"
              :key="spec.label"
              class="flex flex-col sm:flex-row sm:justify-between border-b border-default-100 pb-4 last:border-0"
            >
              <span class="text-muted font-medium">{{ spec.label }}</span>
              <span class="text-highlighted">{{ spec.value }}</span>
            </div>
          </div>
        </template>
      </UTabs>
    </UPageSection>

    <UPageSection
      :title="t('pages.franchises.grandTale.about.sections.media.title')"
      :description="t('pages.franchises.grandTale.about.sections.media.description')"
    >
    </UPageSection>

    <UPageSection
      :title="t('pages.franchises.grandTale.about.sections.faq.title')"
      :description="t('pages.franchises.grandTale.about.sections.faq.description')"
    >
      <UAccordion
        :items="faqGroups"
        type="multiple"
        class="max-w-3xl mx-auto mb-12"
        :ui="{
          trigger: 'text-lg font-bold text-highlighted py-4',
          body: 'pt-0 pb-4',
        }"
      >
        <template #body="{ item }">
          <div class="pl-4 border-l border-default-200 ml-1">
            <UAccordion
              :items="item.questions"
              type="multiple"
              :ui="{
                trigger: 'text-base font-medium text-highlighted py-3',
                body: 'text-base text-muted',
              }"
            />
          </div>
        </template>
      </UAccordion>

      <div class="max-w-3xl mx-auto text-center">
        <i18n-t
          keypath="pages.franchises.grandTale.about.sections.faq.footer"
          tag="span"
          class="text-muted text-sm"
        >
          <template #link>
            <NuxtLink
              to="/franchises/grand-tale/forums"
              class="text-grand-tale-secondary-500 font-semibold underline underline-offset-4 hover:text-primary transition-colors"
            >
              {{ t("app.header.links.community.content.forums.grand_tale") }}
            </NuxtLink>
          </template>
        </i18n-t>
      </div>
    </UPageSection>
  </UPage>
</template>
