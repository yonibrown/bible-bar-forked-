<template>
  <text-range
    :fromPosition="part.src_from_position"
    :fromText="part.src_from_text"
    :fromWord="part.src_from_word"
    :toPosition="part.src_to_position"
    :toText="part.src_to_text"
    :toWord="part.src_to_word"
    :disabled="!editMode"
    @changeValue="(newVal) => updateRange(part, newVal)"
  ></text-range>
</template>

<script setup>
import TextRange from "../ui/TextRange/TextRange.vue";
import { computed, inject, ref } from "vue";
const props = defineProps(["line", "fldId"]);
console.log("SourceWord", part.value);

const editMode = inject("editMode");

// const fldContent = computed(function () {
//   if (!props.line.newLine) {
//     return props.line.content(props.fldId);
//   }
// });

const part = computed(function () {
  if (fldContent.value) {
    return fldContent.value.val;
  }
});

// function updateRange(content) {
//   if (fldContent.value) {
//     fldContent.value.changeAttr(content);
//   } else {
//     props.line.addContent({ field: props.fldId, content });
//   }
// }
</script>
