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
import { inject } from 'vue';
const props = defineProps(["fldidx"]);
const tableEmit = inject('tableEmit');

const dragStruct = ["dispElmId", "dispElmIdx", "dispElmTab"];
function dragData(idx) {
//   console.log("dragData");
}
function moveElement(dragData, dropIdx) {
  tableEmit("reorderFields", { id: 0, newPos: 3 });
  console.log("moveElement");
}
</script>
