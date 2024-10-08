<template>
  <spec-line>
    <template #text="{ id }">
      <board-content :line="line" :fldId="id"></board-content>
    </template>
  </spec-line>
</template>

<script setup>
import BoardContent from "./BoardContent.vue";

const props = defineProps(["line"]);
</script>

<style scoped></style>
