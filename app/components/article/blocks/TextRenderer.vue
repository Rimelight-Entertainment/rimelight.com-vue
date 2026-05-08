<script setup lang="ts">
import {
  type RichTextContent,
  type InlineContent,
  type InlineText,
  type InlineLink,
  type InlineMention,
} from "~/types";
import { RLTextNode, RLLinkNode, RLPageMention } from "#components";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface TextRendererProps {
  content: RichTextContent;
  rc?: {
    root?: string;
  };
}

const { content, rc: rcProp } = defineProps<TextRendererProps>();

const { rc } = useRC("TextRenderer", rcProp);
/* endregion */

/* region Emits */
export interface TextRendererEmits {}

const emit = defineEmits<TextRendererEmits>();
/* endregion */

/* region Slots */
export interface TextRendererSlots {}

const slots = defineSlots<TextRendererSlots>();
/* endregion */

/* region Styles */
const textRendererStyles = tv({
  slots: {
    root: "",
  },
});

const { root } = textRendererStyles();
type TextRendererVariants = VariantProps<typeof textRendererStyles>;
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
  name: "TextRenderer",
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
/**
 * Type representing the possible values for the `is` attribute on <component>.
 * This can be a string for a native tag or the Vue component object itself.
 */
type ComponentIs = string | object;

/**
 * Determines the component or HTML tag for a given inline content element.
 * @param item The inline content object.
 * @returns The component object (LinkNode, MentionNode) or the tag name string ('span').
 */
const getTag = (item: InlineContent): ComponentIs => {
  switch (item.type) {
    case "text":
      return RLTextNode;
    case "link":
      return RLLinkNode;
    case "mention":
      return RLPageMention;
    default:
      return RLTextNode;
  }
};

/**
 * Calculates the attributes (props) for the rendered component/tag.
 * @param item The inline content object.
 * @returns An object of attributes to be spread onto the <component :is="...">.
 */
const getProps = (item: InlineContent): Record<string, any> => {
  switch (item.type) {
    case "text": {
      const textProps = item.props as InlineText["props"];
      return {
        content: textProps.content,
      };
    }
    case "link": {
      const linkProps = item.props as InlineLink["props"];
      return {
        href: linkProps.href,
        target: linkProps.target || undefined,
        content: linkProps.content,
      };
    }
    case "mention": {
      const mentionProps = item.props as InlineMention["props"];
      return {
        pageId: mentionProps.pageId,
      };
    }
    default:
      return {};
  }
};
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <template v-for="item in content" :key="item.id">
      <component :is="getTag(item)" v-bind="getProps(item)" />
    </template>
  </div>
</template>

<style scoped></style>
