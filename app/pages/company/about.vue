<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("about_hero_title"),
});
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
        {{ t("about_hero_title") }}
      </h1>
      <p class="text-xl md:text-2xl text-neutral-400 max-w-3xl relative z-10">
        {{ t("about_hero_description") }}
      </p>
    </section>

    <!-- Mission Section -->
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold mb-6">{{ t("about_mission_title") }}</h2>
          <p class="text-lg text-neutral-400 leading-relaxed">
            {{ t("about_mission_description") }}
          </p>
          <p class="text-lg text-neutral-400 leading-relaxed mt-4">
            Founded by passionate gamers and developers, Rimelight Entertainment is dedicated to pushing the boundaries of what is possible in interactive media. We believe in the power of stories to bring people together.
          </p>
        </div>
        <div class="bg-neutral-900/50 aspect-video rounded-xl border border-neutral-800 flex items-center justify-center">
             <UIcon name="lucide:target" class="w-24 h-24 text-primary-500/50" />
        </div>
      </div>
    </UContainer>

     <!-- Values Section -->
    <section class="bg-neutral-900/30 py-24">
       <UContainer>
        <h2 class="text-3xl font-bold mb-12 text-center">{{ t("about_values_title") }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UCard class="bg-neutral-950/50 border-neutral-800">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UIcon name="lucide:heart" class="w-6 h-6 text-primary-500" />
                        <h3 class="font-bold text-lg">Player First</h3>
                    </div>
                </template>
                <p class="text-neutral-400">Everything we do starts and ends with the player experience. We listen, we learn, and we build for our community.</p>
            </UCard>
             <UCard class="bg-neutral-950/50 border-neutral-800">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UIcon name="lucide:zap" class="w-6 h-6 text-primary-500" />
                        <h3 class="font-bold text-lg">Innovation</h3>
                    </div>
                </template>
                <p class="text-neutral-400">We are not afraid to take risks and explore new technologies to create unique and memorable experiences.</p>
            </UCard>
             <UCard class="bg-neutral-950/50 border-neutral-800">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UIcon name="lucide:users" class="w-6 h-6 text-primary-500" />
                        <h3 class="font-bold text-lg">Collaboration</h3>
                    </div>
                </template>
                <p class="text-neutral-400">Great games are built by great teams. We foster an environment of trust, respect, and open communication.</p>
            </UCard>
        </div>
       </UContainer>
    </section>

    <!-- Leadership/Team Section (Placeholder) -->
    <UContainer>
        <h2 class="text-3xl font-bold mb-12 text-center">{{ t("about_team_title") }}</h2>
         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Example Team Member -->
            <div class="flex flex-col items-center text-center">
                <div class="w-32 h-32 rounded-full bg-neutral-800 mb-4 overflow-hidden">
                    <!-- Placeholder image -->
                    <UIcon name="lucide:user" class="w-full h-full p-6 text-neutral-600" />
                </div>
                <h3 class="font-bold text-xl">Daniel Marchi</h3>
                <p class="text-primary-500">Founder & CEO</p>
            </div>
             <!-- Add more team members as needed -->
         </div>
    </UContainer>
    
    <!-- CTA -->
    <section class="px-4 py-12 text-center">
      <UContainer class="bg-primary-900/10 rounded-xl p-12 border border-primary-500/20">
          <h2 class="text-3xl font-bold mb-4">{{ t("about_join_us_title") }}</h2>
          <p class="text-lg text-neutral-400 mb-8">{{ t("about_join_us_description") }}</p>
          <UButton size="lg" to="/company/careers" icon="lucide:briefcase">View Careers</UButton>
      </UContainer>
    </section>

  </div>
</template>
