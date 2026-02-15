<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/company/about");
    },
  ],
});
</script>
