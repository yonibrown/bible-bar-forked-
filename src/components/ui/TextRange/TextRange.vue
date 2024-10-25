<template>
  <span v-if="part">
    <one-range
      v-if="oneVerse"
      :text="part.src_from_text"
      :fromWord="part.src_from_word"
      :toWord="part.src_to_word"
    ></one-range>
    <span v-else>
      <one-range
        :text="part.src_from_text"
        :fromWord="part.src_from_word"
      ></one-range>
      ...
      <one-range :text="part.src_to_text" :toWord="part.src_to_word"></one-range
    ></span>
  </span>
</template>

<script setup>
import OneRange from "./internal/OneRange.vue";
import { computed, provide } from "vue";
const props = defineProps(["part", "editMode", "displayWholeVerse"]);

const emit = defineEmits(["changeValue"]);

const oneVerse = computed(function () {
  return props.part.src_from_position == props.part.src_to_position;
});

function changeValue(newVal) {
  emit("changeValue", newVal);
}
provide("changeValue", changeValue);

provide(
  "editMode",
  computed(function () {
    return props.editMode;
  })
);
provide(
  "displayWholeVerse",
  computed(function () {
    return props.displayWholeVerse;
  })
);
</script>
