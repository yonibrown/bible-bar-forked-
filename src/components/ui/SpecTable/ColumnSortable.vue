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
const props = defineProps(["fldidx"]);
const dragStruct = ["dispElmId", "dispElmIdx", "dispElmTab"];
function dragData(idx) {
  console.log("dragData");
}
function moveElement(dragData, dropIdx) {
  console.log("moveElement");
}
</script>
