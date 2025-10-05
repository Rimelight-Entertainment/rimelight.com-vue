<script setup lang="ts"></script>

<template>
  <header>
    <UContainer>
      <RLLayoutBox
        direction="horizontal"
        padding="sm"
        align-items="center"
        justify-content="between"
      >
        <RLLayoutBox class="hidden sm:block">
          <slot name="left" />
        </RLLayoutBox>
        <RLLayoutBox class="hidden sm:block">
          <slot name="center" />
        </RLLayoutBox>
        <RLLayoutBox class="hidden sm:block">
          <slot name="right" />
        </RLLayoutBox>
        <RLLayoutBox class="sm:hidden">
          <slot name="collapsed-left" />
        </RLLayoutBox>
        <RLLayoutBox class="sm:hidden">
          <slot name="collapsed-center" />
        </RLLayoutBox>
        <RLLayoutBox class="sm:hidden">
          <slot name="collapsed-right" />
        </RLLayoutBox>
      </RLLayoutBox>
    </UContainer>
  </header>
</template>

<style scoped></style>
