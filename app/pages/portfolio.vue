<script setup lang="ts">
import { differenceInYears } from "date-fns"

useHead({
  title: `me.portfolio`
})

const age = differenceInYears(new Date(1997, 3, 30), new Date())

const englishProgress = ref(100)
const portugueseProgress = ref(100)
const spanishProgress = ref(50)
const romanianProgress = ref(25)
</script>

<template>
  <UContainer class="my-12">
    <UPage>
      <template #left>
        <div class="flex h-fit flex-col gap-lg border-1 border-primary-500 bg-neutral-900 p-lg">
          <div class="flex flex-col items-center justify-center gap-sm">
            <NuxtImg
              src="https://cdn.idantity.me/images/me/daniel-marchi.webp"
              alt="Daniel Marchi"
              class="h-24 w-24 rounded-full"
            />
            <h1 class="text-white">Daniel Marchi</h1>
            <UButton
              variant="ghost"
              color="neutral"
              icon="lucide:location"
              to="https://en.wikipedia.org/wiki/Curitiba"
            >
              Curitiba, Brazil
            </UButton>
            <UButton
              color="success"
              variant="ghost"
              class="gap-2"
              label="Available for new projects"
            >
              <template #leading>
                <span class="relative flex size-2">
                  <span
                    class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"
                  />
                  <span class="relative inline-flex size-2 scale-90 rounded-full bg-success" />
                </span>
              </template>
            </UButton>
            <UFieldGroup>
              <UButton
                variant="ghost"
                icon="mdi:linkedin"
                to="https://www.linkedin.com/daniel-marchi"
                :ui="{ leadingIcon: 'text-white' }"
              />
              <UButton
                variant="ghost"
                icon="mdi:github"
                to="https://www.github.com/idantitydotme"
                :ui="{ leadingIcon: 'text-white' }"
              />
            </UFieldGroup>
            <div class="flex flex-row items-center gap-sm">
              <div class="h-[8px] w-[8px] rounded-full bg-success-500" />
              <span class="text-xs text-white">Available for new projects</span>
            </div>
          </div>
          <div class="flex flex-col gap-sm">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:article-person" size="xs" />
              <h5 class="text-white">About Me</h5>
            </div>
            <USeparator />
            <ul class="text-white">
              <li>
                <span class="text-sm text-white"><strong>Name:</strong> Daniel Marchi</span>
              </li>
              <li>
                <span class="text-sm text-white"><strong>Gender:</strong> Male</span>
              </li>
              <li>
                <span class="text-sm text-white"><strong>Pronouns:</strong> He / Him</span>
              </li>
              <li>
                <span class="text-sm text-white"><strong>Nationality:</strong> Brazilian</span>
              </li>
              <li>
                <span class="text-sm text-white"><strong>Age:</strong> {{ age }}</span>
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-sm">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:translate" size="xs" />
              <h5 class="text-white">Languages</h5>
            </div>
            <USeparator />
            <ul class="flex flex-col gap-md">
              <li>
                <div class="flex flex-col gap-xs">
                  <div class="flex w-full flex-row justify-between">
                    <h6 class="text-sm text-white">English</h6>
                    <span class="text-xs text-white">Fluent</span>
                  </div>
                  <UProgress v-model="englishProgress" size="sm" />
                </div>
              </li>
              <li>
                <div class="flex flex-col gap-xs">
                  <div class="flex w-full flex-row justify-between">
                    <h6 class="text-sm text-white">Portuguese</h6>
                    <span class="text-xs text-white">Fluent</span>
                  </div>
                  <UProgress v-model="portugueseProgress" size="sm" />
                </div>
              </li>
              <li>
                <div class="flex flex-col gap-xs">
                  <div class="flex w-full flex-row justify-between">
                    <h6 class="text-sm text-white">Spanish</h6>
                    <span class="text-xs text-white">Intermediate</span>
                  </div>
                  <UProgress v-model="spanishProgress" size="sm" />
                </div>
              </li>
              <li class="hidden">
                <div class="flex flex-col gap-xs">
                  <div class="flex w-full flex-row justify-between">
                    <h6 class="text-sm text-white">Romanian</h6>
                    <span class="text-sm text-white">Basic</span>
                  </div>
                  <UProgress v-model="romanianProgress" size="sm" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <div class="flex flex-col gap-xl">
        <section class="flex flex-col gap-lg border-1 border-primary-500 bg-neutral-900 p-lg">
          <div class="flex flex-col gap-md">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:person-play" />
              <h2 class="text-white">Skills</h2>
            </div>
            <USeparator />
          </div>
          <h3>Web Development</h3>
          <RCPlaceholder class="h-12" />
          <h3>Game Development</h3>
          <RCPlaceholder class="h-12" />
          <h4 class="text-center">Design Philosophies</h4>
          <div class="flex flex-row justify-between gap-lg">
            <RCPlaceholder class="h-64 w-full" />
            <RCPlaceholder class="h-64 w-full" />
            <RCPlaceholder class="h-64 w-full" />
          </div>
        </section>
        <section class="flex flex-col gap-lg border-1 border-primary-500 bg-neutral-900 p-lg">
          <div class="flex flex-col gap-md">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:handyman" />
              <h2 class="text-white">Technologies</h2>
            </div>
            <USeparator />
          </div>
          <div class="flex flex-col gap-md">
            <h3>Web Development</h3>
            <USeparator />
          </div>
          <div class="grid grid-cols-4 gap-lg">
            <div class="flex flex-col gap-md">
              <h4>Languages & Frameworks</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:typescript-icon"
                    to="https://www.typescriptlang.org/"
                    class="justify-start"
                  >
                    Typescript
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:vue"
                    to="https://vuejs.org/"
                    class="justify-start"
                  >
                    Vue
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:nuxt-icon"
                    to="https://nuxt.com/"
                    class="justify-start"
                  >
                    Nuxt
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:tailwindcss-icon"
                    to="https://tailwindcss.com/"
                    class="justify-start"
                  >
                    Tailwind
                  </UButton>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4>Development Environment</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:webstorm"
                    to="https://www.jetbrains.com/webstorm/"
                    class="justify-start"
                  >
                    WebStorm
                  </UButton>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4>Build & Package</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:vitejs"
                    to="https://vite.dev/"
                    class="justify-start"
                  >
                    Vite
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="material-icon-theme:pnpm"
                    to="https://pnpm.io/"
                    class="justify-start"
                  >
                    pnpm
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:biomejs-icon"
                    to="https://biomejs.dev/"
                    class="justify-start"
                  >
                    Biome
                  </UButton>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4>Deployment</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:cloudflare-icon"
                    to="https://cloudflare.com/"
                    class="justify-start"
                  >
                    Cloudflare
                  </UButton>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex flex-col gap-sm">
            <h3>Game Development</h3>
            <USeparator />
          </div>
          <div class="grid grid-cols-4 gap-lg">
            <div class="flex flex-row gap-md">
              <h4>Languages & Frameworks</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:c-plusplus"
                    to="https://isocpp.org/"
                    class="justify-start"
                  >
                    C++
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:unrealengine-icon"
                    to="https://www.unrealengine.com/"
                    :ui="{ leadingIcon: 'fill-white' }"
                    class="justify-start"
                  >
                    Unreal Engine
                  </UButton>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4>Development Environment</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:rider"
                    to="https://www.jetbrains.com/rider/"
                    class="justify-start"
                  >
                    Rider
                  </UButton>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex flex-col gap-sm">
            <h3>Shared Technologies</h3>
            <USeparator />
          </div>
          <div class="grid grid-cols-4 gap-lg">
            <div class="flex flex-col gap-md">
              <h4>Data Management</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:postgresql"
                    to="https://www.postgresql.org/"
                    class="justify-start"
                  >
                    PostgreSQL
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="catppuccin:drizzle-orm"
                    to="https://orm.drizzle.team/"
                    class="justify-start"
                  >
                    Drizzle
                  </UButton>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4>Authentication</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="simple-icons:clerk"
                    to="https://clerk.com/"
                    class="justify-start"
                  >
                    Clerk
                  </UButton>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-md">
              <h4>Project Management</h4>
              <ul class="flex flex-col gap-md">
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="logos:git-icon"
                    to="https://git-scm.com/"
                    class="justify-start"
                  >
                    Git
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="simple-icons:perforce"
                    to="https://www.perforce.com/products/helix-core/"
                    class="justify-start fill-black"
                    :ui="{ leadingIcon: 'text-[#4c00ff]' }"
                  >
                    P4
                  </UButton>
                </li>
                <li>
                  <UButton
                    block
                    variant="subtle"
                    color="neutral"
                    icon="third-party:youtrack"
                    to="https://www.jetbrains.com/youtrack/"
                    class="justify-start"
                  >
                    YouTrack
                  </UButton>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section class="flex flex-col gap-lg border-1 border-primary-500 bg-neutral-900 p-lg">
          <div class="flex flex-col gap-md">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:school" />
              <h2 class="text-white">Education</h2>
            </div>
            <USeparator />
          </div>
          <UCard variant="subtle">
            <div class="flex flex-col gap-xs">
              <h3 class="text-white">Technologist of Digital Games</h3>
              <span class="text-sm text-neutral-300"
                >PUCPR - Pontifícia Universidade Católica do Paraná</span
              >
              <span class="text-xs text-neutral-400">2020 - 2022</span>
            </div>
          </UCard>
          <UCard variant="subtle">
            <div class="flex flex-col gap-xs">
              <h3 class="text-white">Bachelor of Music</h3>
              <span class="text-sm text-neutral-300">UFPR - Universidade Federal do Paraná</span>
              <span class="text-xs text-neutral-400">2018 - 2022</span>
            </div>
          </UCard>
        </section>
        <section class="flex flex-col gap-lg border-1 border-primary-500 bg-neutral-900 p-lg">
          <div class="flex flex-col gap-md">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:workspace-premium" />
              <h2 class="text-white">Certifications</h2>
            </div>
            <USeparator />
          </div>
        </section>
        <section class="flex flex-col gap-lg border-1 border-primary-500 bg-neutral-900 p-lg">
          <div class="flex flex-col gap-md">
            <div class="flex flex-row items-center gap-md">
              <UIcon name="lucide:work" />
              <h2 class="text-white">Experience</h2>
            </div>
            <USeparator />
          </div>
          <UCard variant="subtle">
            <div class="flex flex-col gap-xs">
              <h3 class="text-white">Junior Game Programmer</h3>
              <span class="text-sm text-neutral-300"
                ><a href="https://compass.uol">Compass.UOL</a></span
              >
              <span class="text-xs text-neutral-400">Nov 2022 - Mar 2023</span>
              <ul class="list-inside list-disc text-white">
                <li>
                  <span class="text-white"
                    >Development of real-time 3D virtual experiences related to E-Commerce in Unreal
                    Engine.</span
                  >
                </li>
                <li>
                  <span class="text-white">Elaboration of high-fidelity interface mockups.</span>
                </li>
                <li>
                  <span class="text-white"
                    >Project documentation and comparative analytical breakdowns for
                    stakeholders.</span
                  >
                </li>
              </ul>
            </div>
          </UCard>
          <UCard variant="subtle">
            <div class="flex flex-col gap-xs">
              <h3 class="text-white">Trainee Game Programmer</h3>
              <span class="text-sm text-neutral-300"
                ><a href="https://compass.uol">Compass.UOL</a></span
              >
              <span class="text-xs text-neutral-400">Jul 2021 - Oct 2021</span>
              <ul class="list-inside list-disc text-white">
                <li>
                  <span class="text-white"
                    >Development of real-time 3D virtual experiences related to E-Commerce in Unreal
                    Engine.</span
                  >
                </li>
              </ul>
            </div>
          </UCard>
          <UCard variant="subtle">
            <div class="flex flex-col gap-xs">
              <h3 class="text-white">Intern Game Programmer</h3>
              <span class="text-sm text-neutral-300"
                ><a href="https://compass.uol">Compass.UOL</a></span
              >
              <span class="text-xs text-neutral-400">Feb 2021 - Jun 2021</span>
              <ul class="list-inside list-disc text-white">
                <li>
                  <span class="text-white"
                    >Training exercises and problem solving activities in Unreal Engine.</span
                  >
                </li>
              </ul>
            </div>
          </UCard>
        </section>
      </div>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
