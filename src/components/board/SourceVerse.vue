<template>
  <verse-range
    v-if="range"
    :part="range"
    :editable="editMode"
    @changeValue="(newVal) => updateRange(newVal)"
  ></verse-range>
</template>

<script setup>
import VerseRange from "../sequence/VerseRange.vue";
import { computed, inject } from "vue";
const props = defineProps(["line", "fldId"]);

const editMode = inject("editMode");

const range = computed(function () {
  if (fldContent.value) {
    return fldContent.value.val;
  }
  return "";
});

function updateRange( newVal) {
    console.log('updateRange',range.value, newVal);
  //   part.changeAttr(newVal);
}

const fldContent = computed(function () {
  if (!props.line.newLine) {
    return props.line.content(props.fldId);
  }
});

function submitText(newVal) {
  if (fldContent.value) {
    fldContent.value.changeAttr({ text: newVal });
  } else {
    props.line.addContent({ field: props.fldId, text: newVal });
  }
}
</script>
