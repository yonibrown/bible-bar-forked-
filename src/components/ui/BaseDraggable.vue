<template>
  <span
    :draggable="dragAllowed"
    @dragstart="startDrag($event)"
    @mousedown="startMouse($event)"
    @mouseup="onMouseup"
  >
    <slot> </slot>
  </span>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["data"]);

const dragAllowed = ref(false);

function startMouse(evt) {
  if (evt.target.closest(".draggable-head")) {
    dragAllowed.value = true;
  }
}

// window.addEventListener("mouseup", function () {
//   dragAllowed.value = false;
// });
function onMouseup() {
  dragAllowed.value = false;
}

function startDrag(evt) {
  dragAllowed.value = false;
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";

  for (const field in props.data) {
    evt.dataTransfer.setData(field, props.data[field]);
  }
}
</script>
