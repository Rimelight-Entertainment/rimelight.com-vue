<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";
import { useI18n } from "vue-i18n";

/* region Props */
export interface PageSurroundProps {
  pageType: string;
  previousTitle?: string;
  previousDescription?: string;
  previousTo?: string;
  nextTitle?: string;
  nextDescription?: string;
  nextTo?: string;
  rc?: {
    grid?: string;
    card?: string;
    cardContent?: string;
    headingGroup?: string;
    button?: string;
    typeLabel?: string;
    infoGroup?: string;
    title?: string;
    description?: string;
  };
}

const {
  pageType,
  previousTitle,
  previousDescription,
  previousTo,
  nextTitle,
  nextDescription,
  nextTo,
  rc: rcProp,
} = defineProps<PageSurroundProps>();

const { rc } = useRC("PageSurround", rcProp);
/* endregion */

/* region Emits */
export interface PageSurroundEmits {}

const emit = defineEmits<PageSurroundEmits>();
/* endregion */

/* region Slots */
export interface PageSurroundSlots {}

const slots = defineSlots<PageSurroundSlots>();
/* endregion */

/* region Styles */
const pageSurroundStyles = tv({
  slots: {
    grid: "grid grid-cols-1 gap-8 sm:grid-cols-2",
    cardClass:
      "group block h-full bg-transparent hover:bg-elevated/50 focus-visible:outline-primary",
    cardContent: "flex flex-col gap-md",
    cardContentEnd: "items-end",
    headingGroup: "flex flex-col gap-xs",
    headingGroupEnd: "items-end",
    buttonClass: "w-fit text-md rounded-full text-primary group-hover:text-highlighted",
    typeLabel: "text-muted",
    infoGroup: "flex flex-col gap-sm",
    infoGroupEnd: "items-end gap-xs",
    title: "text-primary text-sm group-hover:text-highlighted",
    titleEnd: "text-right",
    description: "text-toned text-xs",
    descriptionEnd: "text-right",
  },
});

const {
  grid,
  cardClass,
  cardContent,
  cardContentEnd,
  headingGroup,
  headingGroupEnd,
  buttonClass,
  typeLabel,
  infoGroup,
  infoGroupEnd,
  title,
  titleEnd,
  description,
  descriptionEnd,
} = pageSurroundStyles();
type PageSurroundVariants = VariantProps<typeof pageSurroundStyles>;
/* endregion */

/* region State */
const { t } = useI18n();
/* endregion */

/* region Meta */
defineOptions({
  name: "PageSurround",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <div :class="grid({ class: rc.grid })">
    <div>
      <ULink v-if="previousTitle" :to="previousTo" class="h-full">
        <UCard variant="soft" :class="cardClass({ class: rc.card })">
          <div :class="cardContent({ class: rc.cardContent })">
            <div :class="headingGroup({ class: rc.headingGroup })">
              <UButton
                variant="outline"
                icon="lucide:arrow-left"
                :class="buttonClass({ class: rc.button })"
              />
              <span :class="typeLabel({ class: rc.typeLabel })">
                {{ t("navigation_previous") }}
                {{ t(pageType) }}
              </span>
            </div>
            <div :class="infoGroup({ class: rc.infoGroup })">
              <p :class="title({ class: rc.title })">
                {{ previousTitle }}
              </p>
              <p :class="description({ class: rc.description })">
                {{ previousDescription }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
    <div>
      <ULink v-if="nextTitle" :to="nextTo" class="h-full">
        <UCard variant="soft" :class="cardClass({ class: rc.card })">
          <div :class="[cardContent({ class: rc.cardContent }), cardContentEnd()]">
            <div :class="[headingGroup({ class: rc.headingGroup }), headingGroupEnd()]">
              <UButton
                variant="outline"
                icon="lucide:arrow-right"
                :class="buttonClass({ class: rc.button })"
              />
              <span :class="typeLabel({ class: rc.typeLabel })">
                {{ t("navigation_next") }}
                {{ t(pageType) }}
              </span>
            </div>
            <div :class="[infoGroup({ class: rc.infoGroup }), infoGroupEnd()]">
              <p :class="[title({ class: rc.title }), titleEnd()]">
                {{ nextTitle }}
              </p>
              <p :class="[description({ class: rc.description }), descriptionEnd()]">
                {{ nextDescription }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
  </div>
</template>

<style scoped></style>
