<script setup lang="ts">
import type { CalloutBlockProps, CalloutVariant, Block } from "~/types";
import { tv } from "../../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface CalloutBlockEditorProps extends CalloutBlockProps {
  id: string;
  rc?: {
    root?: string;
  };
}

const { id, rc: rcProp, children, variant, to, target } = defineProps<CalloutBlockEditorProps>();

const { rc } = useRC("CalloutBlockEditor", rcProp);
/* endregion */

/* region Emits */
export interface CalloutBlockEditorEmits {}

const emit = defineEmits<CalloutBlockEditorEmits>();
/* endregion */

/* region Slots */
export interface CalloutBlockEditorSlots {}

const slots = defineSlots<CalloutBlockEditorSlots>();
/* endregion */

/* region Styles */
const calloutBlockEditorStyles = tv({
  slots: {
    root: "",
    iconTrigger: "cursor-pointer hover:opacity-75 transition-opacity outline-none",
    childrenWrapper: "w-full mt-2",
    dropdownItem: "flex items-start gap-2 w-full text-left",
    itemIcon: "size-4 text-dimmed mt-0.5 shrink-0",
    itemContent: "flex flex-col gap-0.5 min-w-0",
    itemLabel: "font-medium text-sm truncate",
    itemDescription: "text-xs text-dimmed font-normal leading-snug whitespace-normal",
  },
});

const {
  root,
  iconTrigger,
  childrenWrapper,
  dropdownItem,
  itemIcon,
  itemContent,
  itemLabel,
  itemDescription,
} = calloutBlockEditorStyles();
type CalloutBlockEditorVariants = VariantProps<typeof calloutBlockEditorStyles>;
/* endregion */

/* region State */
const editorApi = inject<any>("block-editor-api");
const appConfig = useAppConfig();
const { t } = useI18n();

const variants: CalloutVariant[] = [
  "info",
  "success",
  "warning",
  "error",
  "commentary",
  "ideation",
  "source",
];

const items = computed(() => [
  variants.map((type) => {
    const config = getVariantConfig(type);
    return {
      label: t(config.title),
      icon: config.icon,
      description: t(config.tooltip),
      onSelect: () => {
        if (editorApi) {
          editorApi.updateBlockProps(id, { variant: type });
        }
      },
    };
  }),
]);

// Use a computed property to bridge vuedraggable and the central store directly
const localChildren = computed({
  get: () => children ?? [],
  set: (newChildren) => {
    if (editorApi && id) {
      const childrenCopy = JSON.parse(JSON.stringify(newChildren));
      editorApi.updateBlockProps(id, { children: childrenCopy });
    }
  },
});
/* endregion */

/* region Meta */
defineOptions({
  name: "CalloutBlockEditor",
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
function getVariantConfig(variant: CalloutVariant) {
  return (
    (appConfig.rimelightComponents as any)?.callouts?.[variant] ?? {
      icon: "lucide:alert-circle",
      title: "Callout",
      tooltip: "Callout",
    }
  );
}

function handleChildrenMutation() {
  console.log("[CalloutBlockEditor] Mutation event received (handled by setter)");
}
/* endregion */
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RLCallout :variant="variant" :to="to" :target="target">
      <template #leading="{ icon, iconClass }">
        <UDropdownMenu :items="items" :ui="{ content: 'w-64' }">
          <template #item="{ item }">
            <div :class="dropdownItem()">
              <UIcon :name="item.icon" :class="itemIcon()" />
              <div :class="itemContent()">
                <span :class="itemLabel()">{{ item.label }}</span>
                <span :class="itemDescription()">{{ item.description }}</span>
              </div>
            </div>
          </template>

          <UIcon :name="icon" :class="[iconClass, iconTrigger()]" />
        </UDropdownMenu>
      </template>
      <template #default>
        <div :class="childrenWrapper()">
          <RLBlockEditor
            v-model="localChildren"
            :container-id="id"
            @mutation="handleChildrenMutation"
            @end="handleChildrenMutation"
          />
        </div>
      </template>
    </RLCallout>
  </div>
</template>

<style scoped></style>
