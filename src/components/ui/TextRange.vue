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
import OneRange from "./TextRange/OneRange.vue";
import { computed, provide } from "vue";
const props = defineProps([
  "fromPosition",
  "fromText",
  "fromWord",
  "toPosition",
  "toText",
  "toWord",
  "disabled"
]);

const emit = defineEmits(["changeValue"]);

const oneVerse = computed(function () {
  return props.fromPosition == props.toPosition;
});

function changeValue(newVal){
  emit("changeValue",newVal);
};
provide('changeValue',changeValue);

const editDiabled = computed(function () {
  return props.disabled;
});
provide("disabled", editDiabled);
</script>
