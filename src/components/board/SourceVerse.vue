<template>
  <verse-range
    :part="part"
    :editable="editMode"
    @changeValue="(newVal) => updateRange(newVal)"
    :referenceStyle="referenceStyle"
  ></verse-range>
</template>

<script setup>
import VerseRange from "../sequence/VerseRange.vue";
import { computed, inject } from "vue";
const props = defineProps(["line", "fldId"]);

const editMode = inject("editMode");
const element = inject("element");

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

const referenceStyle = computed(function () {
  return element.value.getField(props.fldId).referenceStyle;
});

function updateRange(content) {
  if (fldContent.value) {
    fldContent.value.changeAttr(content);
  } else {
    props.line.addContent({ field: props.fldId, content });
  }
}
</script>
