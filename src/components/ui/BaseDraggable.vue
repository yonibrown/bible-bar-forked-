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
import { provide, ref, inject } from "vue";
const props = defineProps(["data"]);

const dragAllowed = ref(false);
const editMode = inject("editMode");

function startMouse(evt) {
  if (evt.target.closest(".draggable-head") && editMode.value) {
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

const hoverHead = ref(false);
provide("hoverDraggableHead", hoverHead);

function enterHead() {
  hoverHead.value = true;
}
provide("enterDraggableHead", enterHead);

function leaveHead() {
  hoverHead.value = false;
}
provide("leaveDraggableHead", leaveHead);
</script>
