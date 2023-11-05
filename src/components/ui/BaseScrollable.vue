<template>
  <div ref="scrollable">
    <slot> </slot>
  </div>
</template>

<script setup>
import { provide,ref ,inject,watch} from "vue";

const scrollable = ref(null);
var scrollTop = 0;

function scrollIn(elm) {
  if (elm != null){
    scrollTop = elm.offsetTop - scrollable.value.offsetTop;
    // elm.classList.add("scrollable-anchor");
  }
  scrollable.value.scrollTop = scrollTop;
  // console.log(scrollable.value.offsetTop);
}
provide("scrollIn", scrollIn);

const positionVersion = inject("positionVersion");
watch(positionVersion,function(){
  console.log('position changed');
  // const elm = scrollable.value.getElementsByClassName("scrollable-anchor");
  // console.log(elm);
  scrollIn();
});

// when scrolled: save new scrollTop
</script>

<style scoped>
div {
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 15px;
  border: 1px solid #9aaab9;
  background-color: white;
  text-align: justify;
  margin: 15px auto;
}
</style>
