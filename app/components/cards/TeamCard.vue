<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "#composables";

/* region Props */
export interface TeamCardLink {
  icon: string;
  to?: string;
  href?: string;
  target?: string;
  ariaLabel?: string;
}

export interface TeamCardProps {
  src: string;
  alt: string;
  name: string;
  role: string;
  description: string;
  links?: TeamCardLink[];
  rc?: {
    card?: string;
    image?: string;
    details?: string;
    name?: string;
    role?: string;
    badge?: string;
    badgeItem?: string;
    description?: string;
    links?: string;
    link?: string;
    footer?: string;
  };
}

const {
  src,
  alt,
  name,
  role,
  description,
  links: linksProp,
  rc: rcProp,
} = defineProps<TeamCardProps>();

const { rc } = useRC("TeamCard", rcProp);
/* endregion */

/* region Emits */
export interface TeamCardEmits {}

const emit = defineEmits<TeamCardEmits>();
/* endregion */

/* region Slots */
export interface TeamCardSlots {
  links: (props: {}) => any;
  badge?: (props: {}) => any;
}

const slots = defineSlots<TeamCardSlots>();
/* endregion */

/* region Styles */
const teamCardStyles = tv({
  slots: {
    details: "flex flex-col gap-md",
    nameClass: "text-xl font-bold",
    roleClass: "text-sm",
    descriptionClass: "text-md",
    linksClass: "flex flex-row gap-md",
  },
});

const { details, nameClass, roleClass, descriptionClass, linksClass } = teamCardStyles();
type TeamCardVariants = VariantProps<typeof teamCardStyles>;
/* endregion */

/* region State */
// const ref1 = ref(0)
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Meta */
defineOptions({
  name: "TeamCard",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <UCard :ui="{ root: ['rounded-lg overflow-hidden divide-y-0 ring-0 border-0', rc.card] }">
    <RLImage :src="src" :alt="alt" :class="rc.image" />
    <div :class="details({ class: rc.details })">
      <h3 :class="nameClass({ class: rc.name })">
        {{ name }}
      </h3>
      <slot name="badge">
        <div :class="['flex flex-wrap gap-sm', rc.badge]">
          <UBadge :class="rc.badgeItem" variant="soft">
            {{ role }}
          </UBadge>
        </div>
      </slot>
      <p :class="descriptionClass({ class: rc.description })">
        {{ description }}
      </p>
      <div v-if="linksProp?.length || slots.links" :class="linksClass({ class: rc.links })">
        <slot name="links">
          <UButton
            v-for="(link, index) in linksProp"
            :key="index"
            :icon="link.icon"
            :to="link.to"
            :href="link.href"
            :target="link.target"
            :aria-label="link.ariaLabel || link.icon"
            color="primary"
            variant="ghost"
            :class="rc.link"
          />
        </slot>
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
