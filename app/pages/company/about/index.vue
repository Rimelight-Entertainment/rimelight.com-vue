<script setup lang="ts">
import { VideoStream } from "stream-vue"

useHead({
  title: "Home"
})

const projectsFeatures = ref([
  {
    title: "Game Developer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:gamepad-2"
  },
  {
    title: "Web Developer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:code"
  },
  {
    title: "Narrative Writer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:pen-tool"
  }
])

const projectsLinks = ref([
  {
    label: "View me on GitHub",
    color: "secondary",
    variant: "subtle",
    trailingIcon: "mdi:github",
    to: "https://github.com/idantitydotme"
  }
])

const musicFeatures = ref([
  {
    title: "DJ",
    description:
      "I'm a DJ specializing in Hyperpop, Glitchcore, and Hyperflip.",
    icon: "lucide:disc-3"
  },
  {
    title: "Guitarist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:guitar"
  },
  {
    title: "Pianist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:piano"
  }
])

const officeLinks = ref([
  {
    label: "Explore Offices",
    to: ""
  }
])
</script>

<template>
  <UPage>
    <UPageHero
      title="Rimelight Entertainment"
      description="Welcome to Rimelight Entertainment."
      headline="Tell your story."
      orientation="horizontal"
      reverse
    >
      <NuxtImg
        src="https://cdn.idantity.me/images/logos/logomark-white.webp"
        alt="idantity.me"
      />
    </UPageHero>
    <UPageSection
      title="WE ARE RIOT"
      description="Riot Games was founded in 2006 to develop, publish, and support the most player-focused games in the world. As we went from one game to many, we have expanded to over 4,500 Rioters across more than 20 offices around the world bringing a global perspective to the games we create and the characters in them. From the streets of Piltover to the Radianite labs of Alpha Earth, we are all about making games and serving the people who love them."
      :links="hiringLinks"
      orientation="horizontal"
      reverse
    >
      <ScriptYouTubePlayer ref="video" video-id="d_IFKP1Ofq0" />
    </UPageSection>
    <UPageSection
      title="WE ARE GLOBAL"
      description="Riot Games’ HQ is located in sunny Los Angeles, but we have many more offices around the globe. We’re looking for passionate gamers who are also leaders in their field to help us deliver value to players — no matter where they play."
      :links="officeLinks"
      orientation="horizontal"
    >
      <RLPlaceholder class="size-24" />
    </UPageSection>
  </UPage>
</template>

<style scoped></style>
