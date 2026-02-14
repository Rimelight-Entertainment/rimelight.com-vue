<script lang="ts" setup>
import type { FormError } from "#ui/types";

import { reactive, ref } from "vue";
import * as z from "zod";
import { authClient } from "~~/auth/auth-client";

const { user } = useAuth();
const { confirm } = useConfirm();
const toast = useToast();

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.url("Invalid URL").optional().or(z.literal("")),
});

const profileState = reactive({
  name: "",
  image: "",
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      profileState.name = newUser.name;
      profileState.image = newUser.image || "";
    }
  },
  { immediate: true },
);

const isUpdatingProfile = ref(false);

async function updateProfile() {
  isUpdatingProfile.value = true;
  const { error } = await authClient.updateUser({
    name: profileState.name,
    image: profileState.image || undefined,
  });

  if (error) {
    toast.add({
      title: "Profile Update Failed",
      description: error.message,
      color: "error",
      icon: "lucide:circle-x",
    });
  } else {
    toast.add({
      title: "Profile Updated",
      description: "Your profile details have been saved.",
      color: "success",
      icon: "lucide:circle-check",
    });
  }
  isUpdatingProfile.value = false;
}

const emailSchema = z.object({
  newEmail: z.email("Invalid email address"),
});
const emailState = reactive({ newEmail: "" });
const isUpdatingEmail = ref(false);

async function updateEmail() {
  isUpdatingEmail.value = true;
  const { error } = await authClient.changeEmail({
    newEmail: emailState.newEmail,
    callbackURL: "/dashboard",
  });

  if (error) {
  } else {
    emailState.newEmail = "";
  }
  isUpdatingEmail.value = false;
}

const passwordSchema = z.object({
  current: z.string().min(8, "Must be at least 8 characters"),
  new: z.string().min(8, "Must be at least 8 characters"),
});

type PasswordSchema = z.output<typeof passwordSchema>;

const passwordState = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined,
});

const validatePassword = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = [];
  if (state.current && state.new && state.current === state.new) {
    errors.push({
      name: "new",
      message: "New password must be different from current",
    });
  }
  return errors;
};

const isUpdatingPassword = ref(false);

async function updatePassword() {
  if (!passwordState.current || !passwordState.new) return;

  isUpdatingPassword.value = true;
  const { error } = await authClient.changePassword({
    currentPassword: passwordState.current,
    newPassword: passwordState.new,
    revokeOtherSessions: true,
  });

  if (error) {
    toast.add({
      title: "Password Update Failed",
      description: error.message,
      color: "error",
      icon: "heroicons:exclamation-circle",
    });
  } else {
    toast.add({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
      color: "success",
      icon: "heroicons:lock-closed",
    });
    passwordState.current = undefined;
    passwordState.new = undefined;
  }
  isUpdatingPassword.value = false;
}

const isDeleting = ref(false);

async function deleteAccount() {
  const isConfirmed = await confirm({
    title: "Delete your account?",
    description: "This action is irreversible. All your data will be permanently removed.",
    confirmLabel: "Yes, delete my account",
    cancelLabel: "Cancel",
    danger: true,
  });

  if (!isConfirmed) return;

  isDeleting.value = true;
  const { error } = await authClient.deleteUser({
    callbackURL: "/goodbye",
  });

  if (error) {
    if (error.code === "FRESH_SESSION_REQUIRED") {
      toast.add({
        title: "Security Check Required",
        description: "Please log out and log back in to delete your account.",
        color: "warning",
        icon: "heroicons:shield-check",
      });
    } else {
      toast.add({
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred.",
        color: "error",
        icon: "heroicons:exclamation-circle",
      });
    }
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-xl">
    <UPageCard
      description="Manage your public profile information."
      title="Profile Details"
      variant="soft"
    >
      <UForm
        :schema="profileSchema"
        :state="profileState"
        class="flex max-w-sm flex-col gap-md"
        @submit="updateProfile"
      >
        <UFormField label="Display Name" name="name">
          <UInput v-model="profileState.name" icon="lucide:user" />
        </UFormField>

        <UFormField label="Avatar URL" name="image">
          <UInput v-model="profileState.image" icon="lucide:image" />
        </UFormField>

        <UButton :loading="isUpdatingProfile" class="w-fit" label="Save Changes" type="submit" />
      </UForm>
    </UPageCard>

    <UPageCard
      description="Update your email address. You will need to verify the new email."
      title="Email Address"
      variant="soft"
    >
      <div class="flex flex-row items-center gap-xs text-sm">
        Current email:
        <span class="text-muted">{{ user?.email }}</span>
        <span v-if="user?.emailVerified" class="text-xs text-success">(Verified)</span>
        <span v-else class="text-xs text-warning">(Unverified)</span>
      </div>

      <UForm
        :schema="emailSchema"
        :state="emailState"
        class="flex max-w-sm flex-col gap-md"
        @submit="updateEmail"
      >
        <UFormField label="New Email" name="newEmail">
          <UInput v-model="emailState.newEmail" icon="lucide:mail" placeholder="email@domain.com" />
        </UFormField>

        <UButton :loading="isUpdatingEmail" class="w-fit" label="Update Email" type="submit" />
      </UForm>
    </UPageCard>

    <UPageCard
      description="Confirm your current password before setting a new one."
      title="Password"
      variant="soft"
    >
      <UForm
        :schema="passwordSchema"
        :state="passwordState"
        :validate="validatePassword"
        class="flex max-w-sm flex-col gap-md"
        @submit="updatePassword"
      >
        <UFormField label="Current Password" name="current">
          <UInput
            v-model="passwordState.current"
            class="w-full"
            placeholder="••••••••"
            type="password"
          />
        </UFormField>

        <UFormField label="New Password" name="new">
          <UInput
            v-model="passwordState.new"
            class="w-full"
            placeholder="••••••••"
            type="password"
          />
        </UFormField>

        <UButton
          :loading="isUpdatingPassword"
          class="w-fit"
          label="Update Password"
          type="submit"
        />
      </UForm>
    </UPageCard>

    <UPageCard
      :ui="{ root: 'bg-error/50', description: 'text-error' }"
      description="No longer want to use our service? This action is not reversible."
      title="Delete Account"
      variant="soft"
    >
      <p class="text-sm">
        This will schedule your account for deletion after 30 days and revoke all active sessions.
        Signing back in at any point during this period will cancel the scheduling.
      </p>
      <UButton
        :loading="isDeleting"
        class="w-fit"
        color="error"
        label="Delete Account"
        @click="deleteAccount"
      />
    </UPageCard>
  </div>
</template>

<style scoped></style>
