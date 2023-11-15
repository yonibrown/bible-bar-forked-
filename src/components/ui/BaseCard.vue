<template>
  <div class="card" :style="{}" ref="cardRef">
    <slot></slot>
    <div
      class="resizer"
      @mousedown="initResize"
      :style="{ bottom: yGap+'px' }"
      ref="handleRef"
    ></div>
  </div>
</template>

<script setup>
import { ref,onMounted } from "vue";
const props = defineProps([]);

const cardRef = ref();
const handleRef = ref();
const yGap = ref(0);

var startX, startY, startWidth, startHeight,startGap;
onMounted(function(){
  // console.log(cardRef,handleRef);
  // console.log(handleRef.value.offsetTop);
  // startY = handleRef.value.offsetTop;
  startHeight = parseInt(
    document.defaultView.getComputedStyle(cardRef.value).height,
    10
  );
});
function initResize(evt) {
  console.log("initResize");
  console.log(startY,startHeight);
  // startX = evt.clientX;
  startY = evt.clientY;
  // startWidth = parseInt(
  //   document.defaultView.getComputedStyle(cardRef.value).width,
  //   10
  // );
  startHeight = parseInt(
    document.defaultView.getComputedStyle(cardRef.value).height,
    10
  );
  startGap = yGap.value;
  console.log(startY,startHeight);
  document.documentElement.addEventListener("mousemove", doDrag, false);
  document.documentElement.addEventListener("mouseup", stopDrag, false);
}

function doDrag(evt) {
  console.log(evt.clientY);
  var gap = startY - evt.clientY ;

  yGap.value = startGap + gap ;
  /* cardRef.value.style.width = (startWidth + evt.clientX - startX) + 'px' */
  cardRef.value.style.height = startHeight - gap + "px";
}

function stopDrag(evt) {
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
  max-height: 300px;
  /* max-width: 40rem; */

  /* display: flex;
  flex-direction: column; */
  background-color: #f5f7fa;
  resize: vertical;
}

.resizer {
  height: 0.2rem;
  margin-top: 0.8rem;
  width: 100%;
  cursor: row-resize;
  position: relative;
  background-color: bisque;
}

.resizer:hover {
  background-color: #ddeafd;
}
</style>
