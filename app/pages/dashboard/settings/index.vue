<script lang="ts" setup>
import type { FormSubmitEvent } from "#ui/types";
import * as z from "zod";

const fileRef = ref<HTMLInputElement>();

const profileSchema = z.object({
  name: z.string().min(2, "Too short"),
  email: z.string().email("Invalid email"),
  username: z.string().min(2, "Too short"),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileSchema = z.output<typeof profileSchema>;

const profile = reactive<Partial<ProfileSchema>>({
  name: "Benjamin Canac",
  email: "ben@nuxtlabs.com",
  username: "benjamincanac",
  avatar: undefined,
  bio: undefined,
});
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  toast.add({
    title: "Success",
    description: "Your settings have been updated.",
    icon: "lucide:check",
    color: "success",
  });
  console.log(event.data);
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  profile.avatar = URL.createObjectURL(input.files[0]!);
}

function onFileClick() {
  fileRef.value?.click();
}
</script>

<template>
  <UForm id="settings" :schema="profileSchema" :state="profile" @submit="onSubmit">
    <UPageCard
      class="mb-4"
      description="These informations will be displayed publicly."
      orientation="horizontal"
      title="Profile"
      variant="naked"
    >
      <UButton
        class="w-fit lg:ms-auto"
        color="neutral"
        form="settings"
        label="Save changes"
        type="submit"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        class="flex items-start justify-between gap-4 max-sm:flex-col"
        description="Will appear on receipts, invoices, and other communication."
        label="Name"
        name="name"
        required
      >
        <UInput v-model="profile.name" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        class="flex items-start justify-between gap-4 max-sm:flex-col"
        description="Used to sign in, for email receipts and product updates."
        label="Email"
        name="email"
        required
      >
        <UInput v-model="profile.email" autocomplete="off" type="email" />
      </UFormField>
      <USeparator />
      <UFormField
        class="flex items-start justify-between gap-4 max-sm:flex-col"
        description="Your unique username for logging in and your profile URL."
        label="Username"
        name="username"
        required
      >
        <UInput v-model="profile.username" autocomplete="off" type="username" />
      </UFormField>
      <USeparator />
      <UFormField
        class="flex justify-between gap-4 max-sm:flex-col sm:items-center"
        description="JPG, GIF or PNG. 1MB Max."
        label="Avatar"
        name="avatar"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar :alt="profile.name" :src="profile.avatar" size="lg" />
          <UButton color="neutral" label="Choose" @click="onFileClick" />
          <input
            ref="fileRef"
            accept=".jpg, .jpeg, .png, .gif"
            class="hidden"
            type="file"
            @change="onFileChange"
          />
        </div>
      </UFormField>
      <USeparator />
      <UFormField
        :ui="{ container: 'w-full' }"
        class="flex items-start justify-between gap-4 max-sm:flex-col"
        description="Brief description for your profile. URLs are hyperlinked."
        label="Bio"
        name="bio"
      >
        <UTextarea v-model="profile.bio" :rows="5" autoresize class="w-full" />
      </UFormField>
    </UPageCard>
  </UForm>
</template>

<style scoped></style>
