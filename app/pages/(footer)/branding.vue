<script lang="ts" setup>
import mainCss from "~/assets/css/main.css?raw";

const appConfig = useAppConfig();
const { t } = useI18n();

useHead({
  title: "Branding",
});

useSeoMeta({
  title: "Branding",
  ogTitle: "Branding",
  description: `Branding guidelines and assets for ${appConfig.title}.`,
  ogDescription: `Branding guidelines and assets for ${appConfig.title}.`,
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
  <UContainer>
    <UPage>
      <UPageBody>
        <RLSection
          :description="t('page_branding_description')"
          :level="1"
          :title="t('page_branding_title')"
        >
          <RLSection
            :level="2"
            description="The logos and variations we use in our branding."
            title="Logo"
          >
            <RLCallout variant="error">
              <p>If a color combination isn't listed, it means it shouldn't be used.</p>
              <p></p
            ></RLCallout>
            <RLSection :level="3" title="Logomark">
              <RLSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.jpg"
                    name="Logomark - Monochrome White"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.jpg"
                    name="Logomark - Monochrome White | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Transparent%20Background.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.jpg"
                    name="Logomark - Monochrome White | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Inverted%20Background.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                    name="Logomark - Monochrome White | Color Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20White/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.webp"
                  />
                </div>
              </RLSection>
              <RLSection :level="4" title="Monochrome Black">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.jpg"
                    name="Logomark - Monochrome Black"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.jpg"
                    name="Logomark - Monochrome Black | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Transparent%20Background.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.jpg"
                    name="Logomark - Monochrome Black | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Monochrome%20Black/WEBP/rimelight.com%20-%20Logomark%20-%20Monochrome%20Black%20-%20Inverted%20Background.webp"
                  />
                </div>
              </RLSection>
              <RLSection :level="4" title="Color">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/JPEG/rimelight.com%20-%20Logomark%20-%20Color.jpg"
                    name="Logomark - Color"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/PNG/rimelight.com%20-%20Logomark%20-%20Color.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/SVG/rimelight.com%20-%20Logomark%20-%20Color.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/WEBP/rimelight.com%20-%20Logomark%20-%20Color.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/JPEG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.jpg"
                    name="Logomark - Color | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/PNG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/SVG/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logomark/Color/WEBP/rimelight.com%20-%20Logomark%20-%20Color%20-%20Transparent%20Background.webp"
                  />
                </div>
              </RLSection>
            </RLSection>
            <RLSection :level="3" title="Logotype">
              <RLSection :level="4" title="Monochrome White">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.jpg"
                    name="Logotype - Monochrome White"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.jpg"
                    name="Logotype - Monochrome White | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Transparent%20Background.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.jpg"
                    name="Logotype - Monochrome White | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Inverted%20Background.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                    name="Logotype - Monochrome White | Color Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20White/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.webp"
                  />
                </div>
              </RLSection>
              <RLSection :level="4" title="Monochrome Black">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.jpg"
                    name="Logotype - Monochrome Black"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.jpg"
                    name="Logotype - Monochrome Black | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Transparent%20Background.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.jpg"
                    name="Logotype - Monochrome Black | Inverted Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Monochrome%20Black/WEBP/rimelight.com%20-%20Logotype%20-%20Monochrome%20Black%20-%20Inverted%20Background.webp"
                  />
                </div>
              </RLSection>
              <RLSection :level="4" title="Color">
                <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/JPEG/rimelight.com%20-%20Logotype%20-%20Color.jpg"
                    name="Logotype - Color"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/PNG/rimelight.com%20-%20Logotype%20-%20Color.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/SVG/rimelight.com%20-%20Logotype%20-%20Color.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/WEBP/rimelight.com%20-%20Logotype%20-%20Color.webp"
                  />
                  <RLImageSwatch
                    jpg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/JPEG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.jpg"
                    name="Logotype - Color | Transparent Background"
                    png="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/PNG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.png"
                    svg="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/SVG/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.svg"
                    webp="https://cdn.rimelight.com/Images/Branding/Logo/Logotype/Color/WEBP/rimelight.com%20-%20Logotype%20-%20Color%20-%20Transparent%20Background.webp"
                  />
                </div>
              </RLSection>
            </RLSection>
          </RLSection>
          <RLSection
            :level="2"
            description="The color palette used across our branding."
            title="Colors"
          >
            <RLColorPalette :css="mainCss" />
          </RLSection>
          <RLSection
            :level="2"
            title="Typography"
            description="The font families and styles used in our branding."
          >
            <RLFontPalette :css="mainCss" />
          </RLSection>
          <RLSection
            :description="t('page_branding_section_patterns_description')"
            :level="2"
            :title="t('page_branding_section_patterns_heading')"
          >
            <RLImageSwatch />
            <RLImageSwatch />
            <RLImageSwatch />
            <RLImageSwatch />
          </RLSection>
          <RLSection
            :level="2"
            description="Callouts are used to highlight important information."
            title="Callout"
          >
            <div class="flex flex-col gap-md">
              <RLCallout variant="info"> Lorem ipsum dolor sit amet.</RLCallout>
              <RLCallout variant="success">Lorem ipsum dolor sit amet.</RLCallout>
              <RLCallout variant="warning">Lorem ipsum dolor sit amet.</RLCallout>
              <RLCallout variant="error">Lorem ipsum dolor sit amet.</RLCallout>
              <RLCallout variant="commentary">Lorem ipsum dolor sit amet.</RLCallout>
              <RLCallout variant="ideation">Lorem ipsum dolor sit amet.</RLCallout>
              <RLCallout variant="source">Lorem ipsum dolor sit amet.</RLCallout>
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
                  <UButton color="primary" label="Button" variant="solid" />
                  <UButton :loading="true" color="primary" label="Button" variant="solid" />
                  <UButton :disabled="true" color="primary" label="Button" variant="solid" />
                </div>
              </div>
            </div>
          </RLSection>
        </RLSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
