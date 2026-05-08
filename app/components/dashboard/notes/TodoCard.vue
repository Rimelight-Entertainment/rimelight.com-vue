<script setup lang="ts">
import type { Todo } from "#shared/db";
import { useRC } from "~/composables";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface TodoCardProps {
  todo: Todo;
  rc?: {
    root?: string;
  };
}

const { todo, rc: rcProp } = defineProps<TodoCardProps>();

const { rc } = useRC("TodoCard", rcProp);
/*endregion */

/* region Emits */
export interface TodoCardEmits {
  toggle: [completed: boolean];
  archive: [];
  restore: [];
  delete: [];
}

const emit = defineEmits<TodoCardEmits>();
/* endregion */

/* region Slots */
export interface TodoCardSlots {}

const slots = defineSlots<TodoCardSlots>();
/* endregion */

/* region Styles */
const todoCardStyles = tv({
  slots: {
    root: "group flex items-center justify-between gap-sm p-xs rounded-lg hover:bg-muted/50 transition-colors",
    contentWrapper: "flex items-start gap-sm flex-1",
    checkWrapper: "pt-0.5",
    checkIcon: "w-4 h-4 text-dimmed",
    textWrapper: "flex flex-col gap-0",
    titleClass: "text-sm transition-all",
    descriptionClass: "text-xs text-dimmed transition-all",
    actionsWrapper: "flex items-center gap-xs transition-opacity",
  },
  variants: {
    isArchived: {
      true: {
        root: "opacity-60",
      },
    },
    completed: {
      true: {
        titleClass: "line-through text-dimmed",
        descriptionClass: "line-through",
      },
    },
  },
});

const {
  root,
  contentWrapper,
  checkWrapper,
  checkIcon,
  textWrapper,
  titleClass,
  descriptionClass,
  actionsWrapper,
} = todoCardStyles();
type TodoCardVariants = VariantProps<typeof todoCardStyles>;
/* endregion */

/* region State */
// const state1 = ref()
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Meta */
defineOptions({
  name: "TodoCard",
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
  <div :class="root({ class: rc.root, isArchived: todo.isArchived })">
    <div :class="contentWrapper()">
      <div :class="checkWrapper()">
        <template v-if="!todo.isArchived">
          <UCheckbox
            :model-value="todo.completed"
            @update:model-value="(val: boolean | 'indeterminate') => emit('toggle', val === true)"
          />
        </template>
        <template v-else>
          <UIcon
            :name="todo.completed ? 'lucide:check-circle-2' : 'lucide:circle'"
            :class="checkIcon()"
          />
        </template>
      </div>
      <div :class="textWrapper()">
        <span :class="titleClass({ completed: todo.completed })">
          {{ todo.title }}
        </span>
        <span v-if="todo.description" :class="descriptionClass({ completed: todo.completed })">
          {{ todo.description }}
        </span>
      </div>
    </div>

    <div :class="[actionsWrapper(), { 'opacity-0 group-hover:opacity-100': !todo.isArchived }]">
      <template v-if="!todo.isArchived">
        <UButton
          icon="lucide:archive"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="emit('archive')"
        />
      </template>
      <template v-else>
        <UButton
          icon="lucide:rotate-ccw"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="emit('restore')"
        />
        <UButton
          icon="lucide:trash-2"
          size="xs"
          variant="ghost"
          color="error"
          @click="emit('delete')"
        />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
