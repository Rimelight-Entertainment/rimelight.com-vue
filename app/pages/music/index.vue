<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `me.music`
})
</script>

<template>
  <UContainer>
    <UPage class="py-12">
      <RCSection :level="1" :title="t('page_music_title')">
        <RCSection :level="2" :title="t('page_music_section_mixes_title')">
          <IDAudioPlayer
            imageSrc="https://placehold.co/512x512"
            image-alt="Placeholder"
            audioSrc="https://cdn.idantity.me/music/Bishu%20-%20ikari.mp3"
          />
        </RCSection>
      </RCSection>
      <template #right>
        <div class="flex flex-col gap-md">
          <RCSection :level="3" :title="t('page_music_section_playlists_title')">
            <iframe
              data-testid="embed-iframe"
              style="border-radius: 12px"
              src="https://open.spotify.com/embed/playlist/29kSyAiwnDXM59KoGEUAN9?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <iframe
              data-testid="embed-iframe"
              style="border-radius: 12px"
              src="https://open.spotify.com/embed/playlist/1fK0wAI02tDpmpkZ53cTmF?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <iframe
              data-testid="embed-iframe"
              style="border-radius: 12px"
              src="https://open.spotify.com/embed/playlist/0b7hixI5M1VQwD47KYWABj?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <iframe
              data-testid="embed-iframe"
              style="border-radius: 12px"
              src="https://open.spotify.com/embed/playlist/271UvSiUmd238ZYkNi5U57?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </RCSection>
        </div>
      </template>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
