<template>
  <div
    class="card"
    ref="cardRef"
    :hoverDraggableHead="hoverDraggableHead && editMode"
  >
    <slot></slot>
    <div
      v-if="resizable"
      class="handle"
      @mousedown="startResize"
      ref="handleRef"
    ></div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, inject } from "vue";

const props = defineProps(["initialYAdd"]);
const emit = defineEmits(["resize"]);

const cardRef = ref();
const handleRef = ref();

const resizable = ref(false);
const yAddition = ref(0);
provide("yAddition", yAddition);

var startY, startHeight, startAddition;
var initialHeight = null;

onMounted(function () {
  if (props.initialYAdd && resizable.value) {
    yAddition.value = props.initialYAdd;

    startHeight = getCardHeight();
    if (!initialHeight) {
      initialHeight = startHeight;
    }

    cardRef.value.style.minheight = startHeight + yAddition.value + "px";
  }
});

function startResize(evt) {
  startY = evt.clientY;
  startHeight = getCardHeight();
  if (!initialHeight) {
    initialHeight = startHeight;
  }

  startAddition = yAddition.value;
  document.documentElement.addEventListener("mousemove", doDrag, false);
  document.documentElement.addEventListener("mouseup", stopDrag, false);
}

var resizeTimeout = null;
function doDrag(evt) {
  var gap = evt.clientY - startY;

  if (startAddition + gap < 0) {
    yAddition.value = 0;
    cardRef.value.style.minheight = initialHeight + "px";
  } else {
    yAddition.value = startAddition + gap;
    cardRef.value.style.minheight = startHeight + gap + "px";
  }

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    emit("resize", yAddition.value);
  }, 1000);
}

function stopDrag() {
  document.documentElement.removeEventListener("mousemove", doDrag, false);
  document.documentElement.removeEventListener("mouseup", stopDrag, false);
}

function getCardHeight() {
  return parseInt(
    document.defaultView.getComputedStyle(cardRef.value).height,
    10
  );
}

function activateResizable() {
  resizable.value = true;
}
provide("activateResizable", activateResizable);

const hoverDraggableHead = inject("hoverDraggableHead");
const editMode = inject("editMode");
</script>

<style scoped>
.card {
  /* border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: #c9d6e8; */
  /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.26); */
  /* padding: 1rem; */
  margin: 30px 20px auto;
  max-width: 97%;
  position: relative;
  /* background-color: #f5f7fa; */
}

.card[hoverDraggableHead="true"] {
  background-color: #f5f7fa;
  border: dashed lightgray;
}

.handle {
  height: 0.2rem;
  width: calc(100% - 36px);
  cursor: row-resize;
  position: absolute;
  bottom: 0;
  /* background-color: bisque; */
}

.handle:hover {
  background-color: #ddeafd;
}
</style>
