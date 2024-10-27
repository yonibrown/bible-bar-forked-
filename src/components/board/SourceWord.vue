<template>
  <text-range
    :part="part"
    :editMode="editMode"
    @changeValue="updateRange"
    :displayWholeVerse="displayWholeVerse"
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

const displayWholeVerse = computed(function () {
  if (fldContent.value) {
    return fldContent.value.displayWholeVerse;
  }
});

function updateRange(content) {
  if (fldContent.value) {
    fldContent.value.changeAttr(content);
  } else {
    props.line.addContent({ field: props.fldId, content });
  }
}
</script>
