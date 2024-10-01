<template>
  <sortable-cell
    :idx="fldidx"
    :dragData="dragData"
    :moveElement="moveElement"
    :dragStruct="dragStruct"
  >
    <slot></slot>
  </sortable-cell>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps(["fldidx"]);
const tableEmit = inject("tableEmit");

const dragStruct = ["fieldIdx"];
function dragData(fieldIdx) {
  return { fieldIdx };
}
function moveElement(dragData, dropIdx) {
  tableEmit("reorderFields", {
    sourceIdx: +dragData.fieldIdx,
    targetIdx: dropIdx,
  });
}
</script>
