<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref, reactive } from "vue";
import { useToast } from "@nuxt/ui/composables/useToast";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "~/composables";

/* region Props */
export interface AddModalProps {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<AddModalProps>();

const { rc } = useRC("AddModal", rcProp);
/* endregion */

/* region Emits */
export interface AddModalEmits {}

const emit = defineEmits<AddModalEmits>();
/* endregion */

/* region Slots */
export interface AddModalSlots {}

const slots = defineSlots<AddModalSlots>();
/* endregion */

/* region Styles */
const addModalStyles = tv({
  slots: {
    root: "",
    form: "space-y-4",
    actions: "flex justify-end gap-2",
  },
});

const { root, form, actions } = addModalStyles();
type AddModalVariants = VariantProps<typeof addModalStyles>;
/* endregion */

/* region State */
const open = ref(false);
const toast = useToast();

const schema = z.object({
  name: z.string().min(2, "Too short"),
  email: z.email({ message: "Invalid email" }),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
});
/* endregion */

/* region Meta */
defineOptions({
  name: "AddModal",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })

// watch(() =>, (newValue, oldValue) => {
//
// })

// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: `New customer ${event.data.name} added`,
    color: "success",
  });
  open.value = false;
}
/* endregion */
</script>

<template>
  <UModal
    v-model:open="open"
    title="New customer"
    description="Add a new customer to the database"
    :class="root({ class: rc.root })"
  >
    <UButton label="New customer" icon="lucide:plus" />

    <template #body>
      <UForm :schema="schema" :state="state" :class="form()" @submit="onSubmit">
        <UFormField label="Name" placeholder="John Doe" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField label="Email" placeholder="john.doe@example.com" name="email">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>
        <div :class="actions()">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
          <UButton label="Create" color="primary" variant="solid" type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped></style>
