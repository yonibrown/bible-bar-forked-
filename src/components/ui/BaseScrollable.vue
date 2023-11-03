<template>
  <div ref="scrollable">
    <slot> </slot>
  </div>
</template>

<script setup>
import { provide,ref } from "vue";

const scrollable = ref(null);

function scrollIn(elm) {
  scrollable.value.scrollTop = elm.offsetTop - scrollable.value.offsetTop;
}
provide("scrollIn", scrollIn);
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
