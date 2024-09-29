<template>
  <div
    class="scrollable"
    ref="scrollable"
    @scrollend="saveOffset"
    :class="{ 'hilight-div': hilightDiv }"
  >
    <slot> </slot>
  </div>
</template>

<script setup>
import { provide, ref, inject, watch } from "vue";

const props = defineProps(["hilightDiv"]);
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
// //   return initialHeight ;
// // });

watch(yAddition, function (newVal) {
  //   // height.value = initialHeight + newVal;
  scrollable.value.style.height = initialHeight + newVal + "px";
});
const activateResizable = inject("activateResizable");
activateResizable();
</script>

<style scoped>
.scrollable {
  overflow-x: hidden;
  overflow-y: scroll;
  /* max-height: 150px; */
  height: 150px;
  /* padding: 15px; */
  border: 1px solid #9aaab9;
  background-color: white;
  text-align: justify;
  /* margin: 15px auto; */
  margin: 0 auto 5px auto;
  width: 100%;
}

.hilight-div {
  background-color: rgb(254, 255, 198);
}
</style>
