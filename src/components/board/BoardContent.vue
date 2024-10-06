<template>
  <base-editable
    :initialValue="getValue()"
    @submitValue="submitValue"
    name="fieldValue"
    :getDefault="defaultName"
    :disabled="!editMode"
    placeholder="הוסף טקסט..."
  ></base-editable>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps(["line", "fldId"]);

const element = inject("element");
const editMode = inject("editMode");

function getValue() {
  const fld = props.line.content.find(function (fld) {
    return fld.id == props.fldId;
  });
  if (fld) {
    return fld.text;
  }
  return "";
}

function submitValue(newVal) {
  console.log("submit value", props.line);
  element.value.setContent({
    line_id: props.line.id,
    field_id: props.fldId,
    text: newVal,
  });
}

function defaultName() {
  console.log("defaultName");
}
</script>
