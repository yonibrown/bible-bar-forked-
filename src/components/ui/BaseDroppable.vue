<template>
  <span
    @drop="onDrop"
    @dragover.prevent
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    class="drop-list"
    ref="dropPool"
  >
    <slot></slot>
  </span>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps([
  "data",
  "drop",
  "dragStruct",
  "dragEnter",
  "dragLeave",
]);

const dropPool = ref(null);

function onDrop(evt) {
  onDragLeave();
  const dropList = evt.target.closest(".drop-list");

  // check the element is dropped in the correct list
  if (dropList != dropPool.value) {
    return;
  }

  const dragData = {};
  props.dragStruct.forEach(function (dragField) {
    dragData[dragField] = evt.dataTransfer.getData(dragField);
  });

  props.drop(dragData, props.data);
}

var enterCounter = 0;
function onDragEnter() {
  enterCounter++;
  if (props.dragEnter) {
    props.dragEnter();
  }
}

function onDragLeave() {
  enterCounter--;
  if (enterCounter == 0 && props.dragLeave) {
    props.dragLeave();
  }
}
</script>
