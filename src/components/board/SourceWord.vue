<template>
  <text-range
    :part="part"
    :disabled="!editMode"
    @changeValue="updateRange"
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
  console.log('part',fldContent.value);
  if (fldContent.value) {
    return fldContent.value.val;
  }
});

function updateRange(content) {
  if (fldContent.value) {
    console.log('updateRange update',fldContent.value,content);
    fldContent.value.changeAttr(content);
  } else {
    console.log('updateRange add',props.line,content);
    props.line.addContent({ field: props.fldId, content });
  }
}
</script>
