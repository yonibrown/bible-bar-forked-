<template>
  <div
    class="scrollable"
    ref="scrollable"
    @scrollend="saveOffset"
  >
    <slot> </slot>
  </div>
</template>

<script setup>
import { provide, ref, inject, watch, computed } from "vue";

const scrollable = ref(null);
var scrollTop = 0;

function scrollIn(elm) {
  if (elm != null) {
    scrollTop = elm.offsetTop - scrollable.value.offsetTop;
    // elm.classList.add("scrollable-anchor");
  }
  scrollable.value.scrollTop = scrollTop;
}
provide("scrollIn", scrollIn);

const positionVersion = inject("positionVersion");
watch(positionVersion, function () {
  // const elm = scrollable.value.getElementsByClassName("scrollable-anchor");
  scrollIn();
});

// when scrolled: save new scrollTop
function saveOffset() {
  scrollTop = scrollable.value.scrollTop;
}

const initialHeight = 150;
// const height = ref(initialHeight);
const yAddition = inject("yAddition");
// // const maxHeight = computed(function () {
// //   console.log('maxHeight',initialHeight,yAddition.value);
// //   return initialHeight ;
// // });

watch(yAddition,function(newVal){
   console.log('Height',initialHeight,newVal);
//   // height.value = initialHeight + newVal;
  scrollable.value.style.height = initialHeight + newVal + "px";
});
</script>

<style scoped>
.scrollable {
  overflow-x: hidden;
  overflow-y: scroll;
  /* max-height: 150px; */
  height: 150px;
  padding: 15px;
  border: 1px solid #9aaab9;
  background-color: white;
  text-align: justify;
  margin: 15px auto;
}
</style>
