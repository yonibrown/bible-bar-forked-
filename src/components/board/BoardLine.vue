<template>
  <spec-line>
    <template #col1>
      <span>{{ line.col1 }}</span>
    </template>
    <template #col2>
      <span>{{ line.col2 }}</span>
    </template>
    <template #col3>
      <span>{{ line.col3 }}</span>
    </template>
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";

const props = defineProps(["line"]);
</script>

<style scoped>
</style>
