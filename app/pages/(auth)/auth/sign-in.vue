<script setup lang="ts">
useHead({
  title: "Sign In"
})

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <RCAuthSignInForm
    :rc="{
      label: 'text-black',
      description: 'text-neutral-500',
      rememberCheckboxIndicator:
        'data-[state=checked]:bg-primary-500 data-[state=checked]:text-white',
      rememberText: 'text-black',
      submit: 'text-white bg-primary-500 hover:bg-primary-600'
    }"
  />
</template>
