<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("careers_hero_title"),
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
  <div class="flex flex-col gap-16 md:gap-24 pb-24">
    <!-- Hero Section -->
    <section
      class="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 gap-6 relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none"
      />
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight relative z-10">
        {{ t("careers_hero_title") }}
      </h1>
      <p class="text-xl md:text-2xl text-neutral-400 max-w-3xl relative z-10">
        {{ t("careers_hero_description") }}
      </p>
    </section>

    <!-- Culture Section -->
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div
          class="bg-neutral-900/50 aspect-square md:aspect-video rounded-xl border border-neutral-800 flex items-center justify-center"
        >
          <!-- Placeholder for Culture Image -->
          <UIcon name="lucide:smile" class="w-24 h-24 text-primary-500/50" />
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-6">{{ t("careers_culture_title") }}</h2>
          <p class="text-lg text-neutral-400 leading-relaxed mb-6">
            {{ t("careers_culture_description") }}
          </p>
          <p class="text-neutral-400 text-lg leading-relaxed">
            We believe that the best work happens when people feel safe, supported, and inspired. At
            Rimelight, we empower our team to take ownership, experiment, and grow.
          </p>
        </div>
      </div>
    </UContainer>

    <!-- Benefits Section -->
    <section class="bg-neutral-900/30 py-24">
      <UContainer>
        <h2 class="text-3xl font-bold mb-12 text-center">{{ t("careers_benefits_title") }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UCard class="h-full border-neutral-800 bg-neutral-950/50">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="lucide:heart-pulse" class="w-6 h-6 text-primary-500" />
                <h3 class="font-bold">{{ t("careers_benefits_health_title") }}</h3>
              </div>
            </template>
            <p class="text-sm text-neutral-400">{{ t("careers_benefits_health_desc") }}</p>
          </UCard>
          <UCard class="h-full border-neutral-800 bg-neutral-950/50">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="lucide:calendar-clock" class="w-6 h-6 text-primary-500" />
                <h3 class="font-bold">{{ t("careers_benefits_time_title") }}</h3>
              </div>
            </template>
            <p class="text-sm text-neutral-400">{{ t("careers_benefits_time_desc") }}</p>
          </UCard>
          <UCard class="h-full border-neutral-800 bg-neutral-950/50">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="lucide:trending-up" class="w-6 h-6 text-primary-500" />
                <h3 class="font-bold">{{ t("careers_benefits_development_title") }}</h3>
              </div>
            </template>
            <p class="text-sm text-neutral-400">{{ t("careers_benefits_development_desc") }}</p>
          </UCard>
          <UCard class="h-full border-neutral-800 bg-neutral-950/50">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="lucide:laptop" class="w-6 h-6 text-primary-500" />
                <h3 class="font-bold">{{ t("careers_benefits_gear_title") }}</h3>
              </div>
            </template>
            <p class="text-sm text-neutral-400">{{ t("careers_benefits_gear_desc") }}</p>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- Offices Section -->
    <UContainer>
      <h2 class="text-3xl font-bold mb-12 text-center">{{ t("careers_offices_title") }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UCard class="border-neutral-800">
          <div class="h-48 bg-neutral-800 flex items-center justify-center mb-4 rounded-lg">
            <UIcon name="lucide:map-pin" class="w-12 h-12 text-primary-500" />
          </div>
          <h3 class="text-xl font-bold mb-2">Remote First</h3>
          <p class="text-neutral-400">
            We are a distributed team with flexible working hours. Work from anywhere that inspires
            you.
          </p>
        </UCard>
        <UCard class="border-neutral-800">
          <div class="h-48 bg-neutral-800 flex items-center justify-center mb-4 rounded-lg">
            <UIcon name="lucide:building-2" class="w-12 h-12 text-primary-500" />
          </div>
          <h3 class="text-xl font-bold mb-2">Headquarters</h3>
          <p class="text-neutral-400">
            Our main office is located in the heart of the creative district, offering a
            collaborative space for team gatherings.
          </p>
        </UCard>
      </div>
    </UContainer>

    <!-- Open Positions Section -->
    <section class="anchor-section scroll-mt-24" id="open-positions">
      <UContainer>
        <h2 class="text-3xl font-bold mb-12 text-center">
          {{ t("careers_open_positions_title") }}
        </h2>
        <div class="flex flex-col gap-4 max-w-4xl mx-auto">
          <!-- Placeholder for no positions -->
          <div
            class="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20"
          >
            <UIcon name="lucide:search-x" class="w-12 h-12 text-neutral-600 mb-4" />
            <p class="text-xl font-medium text-neutral-400">{{ t("careers_no_positions") }}</p>
          </div>

          <!-- Example Position (Commented out for now until real data is available)
                 <UCard class="hover:border-primary-500 transition-colors cursor-pointer border-neutral-800">
                     <div class="flex items-center justify-between">
                         <div>
                             <h3 class="text-lg font-bold">Senior Game Designer</h3>
                             <p class="text-sm text-neutral-500">Remote • Design • Full-time</p>
                         </div>
                         <UIcon name="lucide:arrow-right" class="w-5 h-5 text-neutral-400" />
                     </div>
                 </UCard>
                 -->
        </div>
      </UContainer>
    </section>
  </div>
</template>
