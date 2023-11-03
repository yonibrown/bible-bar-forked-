<template>
  <div
    @drop="onDrop"
    @dragover.prevent
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    class="drop-list"
    ref="dropPool"
  >
    <slot></slot>
  </div>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps([
  "data",
  "drop",
  "list",
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

function onDragEnter() {
    if (props.dragEnter){
        props.dragEnter();
    }
}

function onDragLeave() {
    if (props.dragLeave){
        props.dragLeave();
    }
}
</script>
