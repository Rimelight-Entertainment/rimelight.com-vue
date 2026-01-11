<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui"

const appConfig = useAppConfig()
const { t } = useI18n()

const colors: AccordionItem[] = [
  {
    label: "Primary",
    icon: "lucide:swatch-book",
    slot: "primary" as const
  },
  {
    label: "Secondary",
    icon: "lucide:swatch-book",
    slot: "secondary" as const
  },
  {
    label: "Info",
    icon: "lucide:swatch-book",
    slot: "info" as const
  },
  {
    label: "Success",
    icon: "lucide:swatch-book",
    slot: "success" as const
  },
  {
    label: "Warning",
    icon: "lucide:swatch-book",
    slot: "warning" as const
  },
  {
    label: "Error",
    icon: "lucide:swatch-book",
    slot: "error" as const
  },
  {
    label: "Commentary",
    icon: "lucide:swatch-book",
    slot: "commentary" as const
  },
  {
    label: "Ideation",
    icon: "lucide:swatch-book",
    slot: "ideation" as const
  },
  {
    label: "Source",
    icon: "lucide:swatch-book",
    slot: "source" as const
  },
  {
    label: "Neutral",
    icon: "lucide:swatch-book",
    slot: "neutral" as const
  }
]

useHead({
  title: "Branding"
})

useSeoMeta({
  title: "Branding",
  ogTitle: "Branding",
  description: `Branding guidelines and assets for ${appConfig.title}.`,
  ogDescription: `Branding guidelines and assets for ${appConfig.title}.`
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageBody>
        <RCSection
          :level="1"
          :title="t('page_branding_title')"
          :description="t('page_branding_description')"
        >
          <RCSection
            :level="2"
            title="Logo"
            description="The logos and variations we use in our branding."
          >
            <RCCallout variant="error">
              <p>If a color combination isn't listed, it means it shouldn't be used.</p>
              <p></p
            ></RCCallout>
            <RCSection :level="3" title="Logomark">
              <RCSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    name="Logomark - Monochrome White"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.svg"
                  />
                  <RCImageSwatch
                    name="Logomark - Monochrome White | Transparent Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.svg"
                  />
                  <RCImageSwatch
                    name="Logomark - Monochrome White | Inverted Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.svg"
                  />
                  <RCImageSwatch
                    name="Logomark - Monochrome White | Color Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.svg"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Monochrome Black">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    name="Logomark - Monochrome Black"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.svg"
                  />
                  <RCImageSwatch
                    name="Logomark - Monochrome Black | Transparent Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.svg"
                  />
                  <RCImageSwatch
                    name="Logomark - Monochrome Black | Inverted Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.svg"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Color">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    name="Logomark - Color"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/JPEG/rimelight.com%20-%20Logomark%20-%20Color.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/PNG/rimelight.com%20-%20Logomark%20-%20Color.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/WEBP/rimelight.com%20-%20Logomark%20-%20Color.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/SVG/rimelight.com%20-%20Logomark%20-%20Color.svg"
                  />
                  <RCImageSwatch
                    name="Logomark - Color | Transparent Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/JPEG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/PNG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/WEBP/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/SVG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.svg"
                  />
                </div>
              </RCSection>
            </RCSection>
            <RCSection :level="3" title="Logotype">
              <RCSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    name="Logotype - Monochrome White"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.svg"
                  />
                  <RCImageSwatch
                    name="Logotype - Monochrome White | Transparent Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.svg"
                  />
                  <RCImageSwatch
                    name="Logotype - Monochrome White | Inverted Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.svg"
                  />
                  <RCImageSwatch
                    name="Logotype - Monochrome White | Color Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.svg"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Monochrome Black">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    name="Logotype - Monochrome Black"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.svg"
                  />
                  <RCImageSwatch
                    name="Logotype - Monochrome Black | Transparent Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.svg"
                  />
                  <RCImageSwatch
                    name="Logotype - Monochrome Black | Inverted Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.svg"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Color">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    name="Logotype - Color"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/JPEG/rimelight.com%20-%20Logotype%20-%20Color.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/PNG/rimelight.com%20-%20Logotype%20-%20Color.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/WEBP/rimelight.com%20-%20Logotype%20-%20Color.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/SVG/rimelight.com%20-%20Logotype%20-%20Color.svg"
                  />
                  <RCImageSwatch
                    name="Logotype - Color | Transparent Background"
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/JPEG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.jpg"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/PNG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.png"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/WEBP/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.webp"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/SVG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.svg"
                  />
                </div>
              </RCSection>
            </RCSection>
          </RCSection>
          <RCSection
            :level="2"
            title="Colors"
            description="The color palette used across our branding."
          >
            <UAccordion type="multiple" :items="colors">
              <template #primary="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Primary 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Primary 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Primary 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Primary 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Primary 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Primary 500"
                    hex="#0064d7"
                    rgb="rgb(0, 100, 215)"
                    hsl="hsl(212.1 100% 42%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.5262 0.1935 257.85)"
                  />
                  <RCColorSwatch
                    name="Primary 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Primary 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Primary 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Primary 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Primary 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #secondary="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Secondary 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Secondary 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Secondary 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Secondary 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Secondary 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Secondary 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Secondary 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Secondary 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Secondary 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Secondary 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Secondary 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #info="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Info 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Info 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Info 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Info 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Info 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Info 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Info 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Info 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Info 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Info 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Info 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #success="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Success 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Success 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Success 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Success 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Success 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Success 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Success 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Success 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Success 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Success 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Success 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #warning="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Warning 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Warning 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Warning 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Warning 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Warning 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Warning 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Warning 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Warning 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Warning 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Warning 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Warning 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #error="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Error 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Error 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Error 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Error 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Error 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Error 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Error 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Error 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Error 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Error 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Error 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #commentary="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Commentary 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Commentary 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Commentary 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Commentary 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Commentary 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Commentary 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Commentary 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Commentary 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Commentary 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Commentary 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Commentary 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #ideation="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Ideation 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Ideation 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Ideation 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Ideation 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Ideation 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Ideation 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Ideation 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Ideation 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Ideation 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Ideation 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Ideation 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #source="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Source 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Source 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Source 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Source 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Source 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Source 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Source 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Source 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Source 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Source 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Source 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
              <template #neutral="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    name="Neutral 50"
                    hex="#dc1414"
                    rgb="rgb(220, 20, 20)"
                    hsl="hsl(0, 83%, 47%)"
                    cmyk="cmyk(0,91,91,14)"
                    oklch="oklch(0.5674 0.2248 28.47)"
                  />
                  <RCColorSwatch
                    name="Neutral 100"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Neutral 200"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                  <RCColorSwatch
                    name="Neutral 300"
                    hex="#f7d10c"
                    rgb="rgb(247, 209, 12)"
                    hsl="hsl(50, 94%, 51%)"
                    cmyk="cmyk(0,15,95,3)"
                    oklch="oklch(0.8674 0.1769 95.55)"
                  />
                  <RCColorSwatch
                    name="Neutral 400"
                    hex="#03991c"
                    rgb="rgb(3, 153, 28)"
                    hsl="hsl(130, 96%, 31%)"
                    cmyk="cmyk(98,0,82,40)"
                    oklch="oklch(0.593 0.1928 143.76)"
                  />
                  <RCColorSwatch
                    name="Neutral 500"
                    hex="#2223a1"
                    rgb="rgb(34, 35, 161)"
                    hsl="hsl(240, 65%, 38%)"
                    cmyk="cmyk(79,78,0,37)"
                    oklch="oklch(0.3639 0.1934 271.16)"
                  />
                  <RCColorSwatch
                    name="Neutral 600"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Neutral 700"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Neutral 800"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Neutral 900"
                    hex="#7f189b"
                    rgb="rgb(127, 24, 155)"
                    hsl="hsl(287, 73%, 35%)"
                    cmyk="cmyk(18,85,0,39)"
                    oklch="oklch(0.449 0.2 317.37)"
                  />
                  <RCColorSwatch
                    name="Neutral 950"
                    hex="#ff740d"
                    rgb="rgb(255, 116, 13)"
                    hsl="hsl(26, 100%, 53%)"
                    cmyk="cmyk(0,55,95,0)"
                    oklch="oklch(0.7147 0.1927 47.59)"
                  />
                </UPageGrid>
              </template>
            </UAccordion>
          </RCSection>
          <RCSection
            :level="2"
            :title="t('page_branding_section_typography_title')"
            :description="t('page_branding_section_typography_description')"
          >
            <p>{{ t("page_branding_section_typography_paragraph_01") }}</p>
            <p>{{ t("page_branding_section_typography_paragraph_02") }}</p>
            <RCSection :level="3" title="Noto Sans">
              <p>
                Any sans-serif sections are rendered using the
                <ULink
                  to="https://fonts.google.com/noto/specimen/Noto+Sans"
                  target="_blank"
                  class="font-sans"
                  >Noto Sans</ULink
                >
                font.
              </p>
              <RCSection :level="4" :title="t('page_branding_constants_font-weights')"> </RCSection>
            </RCSection>
            <RCSection :level="3" title="JetBrains Mono">
              <p>
                Any monospaced sections such as code blocks are rendered using the
                <ULink to="https://jetbrains.com/lp/mono" target="_blank" class="font-mono"
                  >JetBrains Mono</ULink
                >
                font.
              </p>
              <RCSection :level="4" :title="t('page_branding_constants_font-weights')"> </RCSection>
            </RCSection>
          </RCSection>
          <RCSection
            :level="2"
            :title="t('page_branding_section_patterns_heading')"
            :description="t('page_branding_section_patterns_description')"
          >
            <RCImageSwatch />
            <RCImageSwatch />
            <RCImageSwatch />
            <RCImageSwatch />
          </RCSection>
          <RCSection
            :level="2"
            title="Callout"
            description="Callouts are used to highlight important information."
          >
            <div class="flex flex-col gap-md">
              <RCCallout variant="info"> Lorem ipsum dolor sit amet. </RCCallout>
              <RCCallout variant="success">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="warning">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="error">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="commentary">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="ideation">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="source">Lorem ipsum dolor sit amet.</RCCallout>
              <div class="bg-default">
                <div class="flex flex-row gap-md">
                  <span class="text-dimmed">Dimmed</span>
                  <span class="text-muted">Muted</span>
                  <span class="text-toned">Toned</span>
                  <span class="text-default">Text</span>
                  <span class="text-highlighted">Highlighted</span>
                  <span class="bg-inverted text-inverted">Inverted</span>
                </div>
                <div class="flex flex-row gap-md">
                  <div class="rounded-md bg-default p-md">Default</div>
                  <div class="rounded-md bg-muted p-md">Muted</div>
                  <div class="rounded-md bg-elevated p-md">Elevated</div>
                  <div class="rounded-md bg-accented p-md">Accented</div>
                  <div class="rounded-md bg-inverted p-md text-inverted">Inverted</div>
                </div>
                <div class="flex flex-row gap-md">
                  <UButton color="primary" variant="solid" label="Button" />
                  <UButton color="primary" variant="solid" label="Button" :loading="true" />
                  <UButton color="primary" variant="solid" label="Button" :disabled="true" />
                </div>
              </div>
            </div>
          </RCSection>
        </RCSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
