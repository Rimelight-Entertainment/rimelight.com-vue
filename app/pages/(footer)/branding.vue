<script lang="ts" setup>
import type {AccordionItem} from "#ui/types"

const appConfig = useAppConfig()
const {t} = useI18n()

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
          :description="t('page_branding_description')"
          :level="1"
          :title="t('page_branding_title')"
        >
          <RCSection
            :level="2"
            description="The logos and variations we use in our branding."
            title="Logo"
          >
            <RCCallout variant="error">
              <p>If a color combination isn't listed, it means it shouldn't be used.</p>
              <p></p
              ></RCCallout>
            <RCSection :level="3" title="Logomark">
              <RCSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.jpg"
                    name="Logomark - Monochrome White"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.jpg"
                    name="Logomark - Monochrome White | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.jpg"
                    name="Logomark - Monochrome White | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                    name="Logomark - Monochrome White | Color Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.webp"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Monochrome Black">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.jpg"
                    name="Logomark - Monochrome Black"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.jpg"
                    name="Logomark - Monochrome Black | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.jpg"
                    name="Logomark - Monochrome Black | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.webp"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Color">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/JPEG/rimelight.com%20-%20Logomark%20-%20Color.jpg"
                    name="Logomark - Color"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/PNG/rimelight.com%20-%20Logomark%20-%20Color.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/SVG/rimelight.com%20-%20Logomark%20-%20Color.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/WEBP/rimelight.com%20-%20Logomark%20-%20Color.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/JPEG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.jpg"
                    name="Logomark - Color | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/PNG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/SVG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/WEBP/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.webp"
                  />
                </div>
              </RCSection>
            </RCSection>
            <RCSection :level="3" title="Logotype">
              <RCSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.jpg"
                    name="Logotype - Monochrome White"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.jpg"
                    name="Logotype - Monochrome White | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.jpg"
                    name="Logotype - Monochrome White | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                    name="Logotype - Monochrome White | Color Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.webp"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Monochrome Black">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.jpg"
                    name="Logotype - Monochrome Black"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.jpg"
                    name="Logotype - Monochrome Black | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.jpg"
                    name="Logotype - Monochrome Black | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.webp"
                  />
                </div>
              </RCSection>
              <RCSection :level="4" title="Color">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/JPEG/rimelight.com%20-%20Logotype%20-%20Color.jpg"
                    name="Logotype - Color"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/PNG/rimelight.com%20-%20Logotype%20-%20Color.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/SVG/rimelight.com%20-%20Logotype%20-%20Color.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/WEBP/rimelight.com%20-%20Logotype%20-%20Color.webp"
                  />
                  <RCImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/JPEG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.jpg"
                    name="Logotype - Color | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/PNG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/SVG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/WEBP/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.webp"
                  />
                </div>
              </RCSection>
            </RCSection>
          </RCSection>
          <RCSection
            :level="2"
            description="The color palette used across our branding."
            title="Colors"
          >
            <UAccordion :items="colors" type="multiple">
              <template #primary="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Primary 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Primary 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Primary 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Primary 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Primary 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#0064d7"
                    hsl="hsl(212.1 100% 42%)"
                    name="Primary 500"
                    oklch="oklch(0.5262 0.1935 257.85)"
                    rgb="rgb(0, 100, 215)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Primary 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Primary 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Primary 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Primary 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Primary 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #secondary="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Secondary 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Secondary 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Secondary 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Secondary 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Secondary 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Secondary 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Secondary 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Secondary 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Secondary 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Secondary 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Secondary 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #info="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Info 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Info 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Info 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Info 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Info 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Info 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Info 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Info 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Info 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Info 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Info 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #success="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Success 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Success 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Success 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Success 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Success 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Success 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Success 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Success 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Success 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Success 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Success 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #warning="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Warning 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Warning 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Warning 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Warning 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Warning 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Warning 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Warning 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Warning 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Warning 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Warning 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Warning 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #error="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Error 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Error 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Error 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Error 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Error 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Error 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Error 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Error 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Error 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Error 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Error 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #commentary="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Commentary 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Commentary 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Commentary 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Commentary 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Commentary 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Commentary 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Commentary 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Commentary 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Commentary 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Commentary 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Commentary 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #ideation="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Ideation 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Ideation 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Ideation 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Ideation 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Ideation 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Ideation 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Ideation 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Ideation 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Ideation 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Ideation 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Ideation 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #source="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Source 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Source 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Source 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Source 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Source 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Source 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Source 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Source 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Source 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Source 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Source 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
              <template #neutral="{ item }">
                <UPageGrid class="py-lg">
                  <RCColorSwatch
                    cmyk="cmyk(0,91,91,14)"
                    hex="#dc1414"
                    hsl="hsl(0, 83%, 47%)"
                    name="Neutral 50"
                    oklch="oklch(0.5674 0.2248 28.47)"
                    rgb="rgb(220, 20, 20)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Neutral 100"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Neutral 200"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,15,95,3)"
                    hex="#f7d10c"
                    hsl="hsl(50, 94%, 51%)"
                    name="Neutral 300"
                    oklch="oklch(0.8674 0.1769 95.55)"
                    rgb="rgb(247, 209, 12)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(98,0,82,40)"
                    hex="#03991c"
                    hsl="hsl(130, 96%, 31%)"
                    name="Neutral 400"
                    oklch="oklch(0.593 0.1928 143.76)"
                    rgb="rgb(3, 153, 28)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(79,78,0,37)"
                    hex="#2223a1"
                    hsl="hsl(240, 65%, 38%)"
                    name="Neutral 500"
                    oklch="oklch(0.3639 0.1934 271.16)"
                    rgb="rgb(34, 35, 161)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Neutral 600"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Neutral 700"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Neutral 800"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(18,85,0,39)"
                    hex="#7f189b"
                    hsl="hsl(287, 73%, 35%)"
                    name="Neutral 900"
                    oklch="oklch(0.449 0.2 317.37)"
                    rgb="rgb(127, 24, 155)"
                  />
                  <RCColorSwatch
                    cmyk="cmyk(0,55,95,0)"
                    hex="#ff740d"
                    hsl="hsl(26, 100%, 53%)"
                    name="Neutral 950"
                    oklch="oklch(0.7147 0.1927 47.59)"
                    rgb="rgb(255, 116, 13)"
                  />
                </UPageGrid>
              </template>
            </UAccordion>
          </RCSection>
          <RCSection
            :description="t('page_branding_section_typography_description')"
            :level="2"
            :title="t('page_branding_section_typography_title')"
          >
            <p>{{ t("page_branding_section_typography_paragraph_01") }}</p>
            <p>{{ t("page_branding_section_typography_paragraph_02") }}</p>
            <RCSection :level="3" title="Noto Sans">
              <p>
                Any sans-serif sections are rendered using the
                <ULink
                  class="font-sans"
                  target="_blank"
                  to="https://fonts.google.com/noto/specimen/Noto+Sans"
                >Noto Sans
                </ULink
                >
                font.
              </p>
              <RCSection :level="4" :title="t('page_branding_constants_font-weights')"></RCSection>
            </RCSection>
            <RCSection :level="3" title="JetBrains Mono">
              <p>
                Any monospaced sections such as code blocks are rendered using the
                <ULink class="font-mono" target="_blank" to="https://jetbrains.com/lp/mono"
                >JetBrains Mono
                </ULink
                >
                font.
              </p>
              <RCSection :level="4" :title="t('page_branding_constants_font-weights')"></RCSection>
            </RCSection>
          </RCSection>
          <RCSection
            :description="t('page_branding_section_patterns_description')"
            :level="2"
            :title="t('page_branding_section_patterns_heading')"
          >
            <RCImageSwatch/>
            <RCImageSwatch/>
            <RCImageSwatch/>
            <RCImageSwatch/>
          </RCSection>
          <RCSection
            :level="2"
            description="Callouts are used to highlight important information."
            title="Callout"
          >
            <div class="flex flex-col gap-md">
              <RCCallout variant="info"> Lorem ipsum dolor sit amet.</RCCallout>
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
                  <UButton color="primary" label="Button" variant="solid"/>
                  <UButton :loading="true" color="primary" label="Button" variant="solid"/>
                  <UButton :disabled="true" color="primary" label="Button" variant="solid"/>
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
