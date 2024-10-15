<template>
  <verse-range
    :part="part"
    :editable="editMode"
    @changeValue="(newVal) => updateRange(newVal)"
  ></verse-range>
</template>

<script setup>
import VerseRange from "../sequence/VerseRange.vue";
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

function updateRange(newVal) {
  console.log("updateRange", fldContent.value, newVal);
  if (fldContent.value) {
    fldContent.value.changeAttr(newVal);
  }
}

function submitText(newVal) {
  if (fldContent.value) {
    fldContent.value.changeAttr({ text: newVal });
  } else {
    props.line.addContent({ field: props.fldId, text: newVal });
  }
}
</script>
