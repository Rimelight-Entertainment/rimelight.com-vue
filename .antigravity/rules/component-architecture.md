# Component Architecture

- **SFC Structure:**
  1. `<script setup lang="ts">`
  2. `<template>`
  3. `<style scoped>`
- **Naming:**
  - Folders: `kebab-case`
  - Components: `PascalCase`
  - Global Project Components: Prefix with `ID` (e.g., `IDButton`).
- **Props:** Use `defineProps<{ ... }>()` with interfaces.
- **Emits:** Use `defineEmits<{ ... }>()` with tuple syntax.
- **State:** Use `useState()` for shared state, `ref()` for local state.
