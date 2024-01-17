<template>
  <one-range
    v-if="oneVerse"
    :text="fromText"
    :fromWord="fromWord"
    :toWord="toWord"
  ></one-range>
  <span v-else>
    <one-range :text="fromText" :fromWord="fromWord"></one-range> ...
    <one-range :text="toText" :toWord="toWord"></one-range
  ></span>
</template>

<script setup>
import OneRange from "./TextRange/oneRange.vue";
import { inject, computed, provide } from "vue";
const props = defineProps([
  "fromPosition",
  "fromText",
  "fromWord",
  "toPosition",
  "toText",
  "toWord",
]);

const oneVerse = computed(function () {
  return props.fromPosition == props.toPosition;
});
</script>
