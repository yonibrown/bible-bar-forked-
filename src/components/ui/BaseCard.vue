<template>
  <div class="card" :class="{ cardResizable: resizable }" ref="cardRef">
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
import { ref, provide } from "vue";
const props = defineProps(["resizable"]);

const cardRef = ref();
const handleRef = ref();

const yAddition = ref(0);
provide("yAddition", yAddition);

var startY, startHeight, startAddition;
var initialHeight = null;

function startResize(evt) {
  startY = evt.clientY;
  startHeight = getCardHeight();
  if (!initialHeight){
    initialHeight = startHeight;
  }

  startAddition = yAddition.value;
  document.documentElement.addEventListener("mousemove", doDrag, false);
  document.documentElement.addEventListener("mouseup", stopDrag, false);
}

function doDrag(evt) {
  var gap = evt.clientY - startY;

  if (startAddition + gap < 0) {
    yAddition.value = 0;
    cardRef.value.style.height = initialHeight + "px";
  } else {
    yAddition.value = startAddition + gap;
    cardRef.value.style.height = startHeight + gap + "px";
  }
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
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 85%;
  position: relative;
  background-color: #f5f7fa;
}

.handle {
  height: 0.2rem;
  width: 100%;
  cursor: row-resize;
  position: absolute;
  bottom: 0;
  /* background-color: bisque; */
}

.handle:hover {
  background-color: #ddeafd;
}
</style>
