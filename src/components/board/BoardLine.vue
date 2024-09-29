<template>
  <spec-line>
    <template #text="{idx}">
      <span>{{ line[idx] }}</span>
    </template> 
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";

const props = defineProps(["line"]);
</script>

<style scoped>
</style>
