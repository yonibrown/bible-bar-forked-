<template>
  <base-editable
    :initialValue="fld.title"
    @submitValue="submitTitle"
    name="fieldTitle"
    :getDefault="defaultName"
    :disabled="!enableSelection"
    placeholder="הוסף כותרת..."
    :blankable="true"
  ></base-editable>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps(["fld"]);
const enableSelection = inject("enableSelection");
const tableEmit = inject("tableEmit");

function submitTitle(title) {
  tableEmit("changeField", { id: props.fld.id, attr: { title } });
}

function defaultName() {
  console.log("defaultName");
}
</script>
