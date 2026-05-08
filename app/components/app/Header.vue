<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface HeaderProps {
  contain?: boolean;
  rc?: {
    root?: string;
    container?: string;
    left?: string;
    center?: string;
    right?: string;
    collapsedLeft?: string;
    collapsedCenter?: string;
    collapsedRight?: string;
  };
}

const { contain = true, rc: rcProp } = defineProps<HeaderProps>();

const { rc } = useRC("Header", rcProp);
/* endregion */

/* region Emits */
export interface HeaderEmits {}

const emit = defineEmits<HeaderEmits>();
/* endregion */

/* region Slots */
export interface HeaderSlots {
  left: (props: {}) => any;
  center: (props: {}) => any;
  right: (props: {}) => any;
  "collapsed-left": (props: {}) => any;
  "collapsed-center": (props: {}) => any;
  "collapsed-right": (props: {}) => any;
}

const slots = defineSlots<HeaderSlots>();
/* endregion */

/* region Styles */
const headerStyles = tv({
  slots: {
    root: "h-(--ui-header-height)",
    container: "h-full flex flex-row items-center p-sm",
    left: "hidden lg:flex flex-none items-center justify-start",
    center: "hidden lg:flex flex-1 items-center justify-center",
    right: "hidden lg:flex flex-none items-center justify-end",
    collapsedLeft: "flex lg:hidden flex-1 items-center justify-start",
    collapsedCenter: "flex lg:hidden flex-none items-center justify-center",
    collapsedRight: "flex lg:hidden flex-1 items-center justify-end",
  },
  variants: {
    contain: {
      false: {
        container: "max-w-none",
      },
    },
  },
});

const { root, container, left, center, right, collapsedLeft, collapsedCenter, collapsedRight } =
  headerStyles({ contain });
type HeaderVariants = VariantProps<typeof headerStyles>;
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
  name: "Header",
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
  <header :class="root({ class: rc.root })">
    <UContainer :class="container({ class: rc.container })">
      <div :class="left({ class: rc.left })">
        <slot name="left" />
      </div>
      <div :class="center({ class: rc.center })">
        <slot name="center" />
      </div>
      <div :class="right({ class: rc.right })">
        <slot name="right" />
      </div>
      <div :class="collapsedLeft({ class: rc.collapsedLeft })">
        <slot name="collapsed-left" />
      </div>
      <div :class="collapsedCenter({ class: rc.collapsedCenter })">
        <slot name="collapsed-center" />
      </div>
      <div :class="collapsedRight({ class: rc.collapsedRight })">
        <slot name="collapsed-right" />
      </div>
    </UContainer>
  </header>
</template>

<style scoped></style>
