<template>
  <div class="card" ref="cardRef">
    <slot></slot>
    <div
      class="handle"
      @mousedown="startResize"
      :style="{ bottom: -yAddition + 'px' }"
      ref="handleRef"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps([]);

const cardRef = ref();
const handleRef = ref();

const yAddition = ref(0);

var startY, startHeight, startAddition, initialHeight;

onMounted(function () {
  initialHeight = parseInt(
    document.defaultView.getComputedStyle(cardRef.value).height,
    10
  );
});

function startResize(evt) {
  startY = evt.clientY;
  startHeight = parseInt(
    document.defaultView.getComputedStyle(cardRef.value).height,
    10
  );

  startAddition = yAddition.value;
  document.documentElement.addEventListener("mousemove", doDrag, false);
  document.documentElement.addEventListener("mouseup", stopDrag, false);
}

function doDrag(evt) {
  var gap = evt.clientY - startY;

  console.log(startAddition, gap);
  if (startAddition + gap < 0) {
    yAddition.value = 0;
    cardRef.value.style.height = initialHeight + "px";
  } else {
    yAddition.value = startAddition + gap;
    cardRef.value.style.height = startHeight + gap + "px";
  }
}

function stopDrag() {
  console.log(yAddition.value);
  document.documentElement.removeEventListener("mousemove", doDrag, false);
  document.documentElement.removeEventListener("mouseup", stopDrag, false);
}
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem 1rem 0 1rem;
  margin: 2rem auto;
  max-width: 85%;
  /* max-height: 300px; */
  /* max-width: 40rem; */

  /* display: flex;
  flex-direction: column; */
  background-color: #f5f7fa;
  resize: vertical;
}

.handle {
  height: 0.2rem;
  margin-top: 0.8rem;
  width: 100%;
  cursor: row-resize;
  position: relative;
  background-color: bisque;
}

.handle:hover {
  background-color: #ddeafd;
}
</style>
