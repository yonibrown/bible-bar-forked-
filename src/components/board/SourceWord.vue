<template>
  <text-range
    :part="part"
    :disabled="!editMode"
    @changeValue="(newVal) => updateRange(part, newVal)"
  ></text-range>
</template>

<script setup>
import TextRange from "../ui/TextRange/TextRange.vue";
import { computed, inject, ref } from "vue";
const props = defineProps(["line", "fldId"]);

const editMode = inject("editMode");

const fldContent = computed(function () {
  if (!props.line.newLine) {
    return props.line.content(props.fldId);
  }
});

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
