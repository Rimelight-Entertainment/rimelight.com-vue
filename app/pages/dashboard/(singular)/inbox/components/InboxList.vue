<script lang="ts" setup>
import { format, isToday } from "date-fns";
import { type Mail } from "#rimelight-components/types";
import { ref, watch } from "vue";

export interface InboxListProps {
  mails: Mail[];
}

const { mails } = defineProps<InboxListProps>();

const mailsRefs = ref<Element[]>([]);

const selectedMail = defineModel<Mail | null>();

watch(selectedMail, () => {
  if (!selectedMail.value) {
    return;
  }
  const ref = mailsRefs.value[selectedMail.value.id];
  if (ref) {
    ref.scrollIntoView({ block: "nearest" });
  }
});

defineShortcuts({
  arrowdown: () => {
    const index = mails.findIndex((mail) => mail.id === selectedMail.value?.id);

    if (index === -1) {
      selectedMail.value = mails[0];
    } else if (index < mails.length - 1) {
      selectedMail.value = mails[index + 1];
    }
  },
  arrowup: () => {
    const index = mails.findIndex((mail) => mail.id === selectedMail.value?.id);

    if (index === -1) {
      selectedMail.value = mails[mails.length - 1];
    } else if (index > 0) {
      selectedMail.value = mails[index - 1];
    }
  },
});
</script>

<template>
  <div class="divide-y divide-default overflow-y-auto">
    <div
      v-for="(mail, index) in mails"
      :key="index"
      :ref="
        (el) => {
          mailsRefs[mail.id] = el as Element;
        }
      "
    >
      <div
        :class="[
          mail.unread ? 'text-highlighted' : 'text-toned',
          selectedMail && selectedMail.id === mail.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5',
        ]"
        class="cursor-pointer border-l-2 p-4 text-sm transition-colors sm:px-6"
        @click="selectedMail = mail"
      >
        <div :class="[mail.unread && 'font-semibold']" class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            {{ mail.from.name }}

            <UChip v-if="mail.unread" />
          </div>

          <span>{{
            isToday(new Date(mail.date))
              ? format(new Date(mail.date), "HH:mm")
              : format(new Date(mail.date), "dd MMM")
          }}</span>
        </div>
        <p :class="[mail.unread && 'font-semibold']" class="truncate">
          {{ mail.subject }}
        </p>
        <p class="line-clamp-1 text-dimmed">
          {{ mail.body }}
        </p>
      </div>
    </div>
  </div>
</template>
