<template>
  <spec-line>
    <template #FreeText="{ id }">
      <free-text :line="line" :fldId="id"></free-text>
    </template>
    <template #SourceVerse="{ id }">
      <source-verse :line="line" :fldId="id"></source-verse>
    </template>
  </spec-line>
</template>

<script setup>
import FreeText from "./FreeText.vue";
import SourceVerse from "./SourceVerse.vue";

const props = defineProps(["line"]);
</script>

<style scoped></style>
