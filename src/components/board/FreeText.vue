<template>
  <base-editable
    :initialValue="text"
    @submitValue="submitText"
    name="fieldValue"
    :getDefault="defaultName"
    :disabled="!editMode"
    placeholder="הוסף טקסט..."
    :blankable="true"
  ></base-editable>
</template>

<script setup>
import { computed, inject } from "vue";
const props = defineProps(["line", "fldId"]);

const editMode = inject("editMode");

const fldContent = computed(function () {
  if (!props.line.newLine) {
    return props.line.content(props.fldId);
  }
});

const text = computed(function () {
  if (fldContent.value) {
    return fldContent.value.val;
  }
  return "";
});

function submitText(text) {
  const content = { text };
  if (fldContent.value) {
    fldContent.value.changeAttr(content);
  } else {
    props.line.addContent({ field: props.fldId, content });
  }
}

function defaultName() {
  console.log("defaultName");
}
</script>
