<template>
  <span v-if="isRange">{{ verseRange }}</span>
  <!-- <span v-else>{{ oneVerse }}</span> -->
  <verse-editable
    v-else
    :initial-value="oneVerse"
    placeholder="פסוק"
    :seqIndex="seqIndex"
    :initPosition="part.src_from_position"
    :disabled="!enableSelection"
    @submitValue="updateVerse"
  ></verse-editable>
</template>

<script setup>
import VerseEditable from "./VerseEditable.vue";
import { inject, computed, provide } from "vue";

const props = defineProps(["part"]);
const enableSelection = inject("enableSelection");

const isRange = computed(function () {
  return props.part.src_from_name == props.part.src_to_name;
});

const oneVerse = computed(function () {
  return props.part.src_from_name.replaceAll(",", " ");
});

const verseRange = computed(function () {
  return (
    props.part.src_from_name.replaceAll(",", " ") +
    " - " +
    props.part.src_to_name.replaceAll(",", " ")
  );
});

function updateVerse(newVal) {
  console.log("updateVerse", newVal);
}
</script>
