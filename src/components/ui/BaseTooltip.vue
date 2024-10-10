<template>
  <span class="element" @mouseover="enterElement" @mouseleave="leaveElement">
    <slot></slot>
    <span class="tooltip" v-show="hoverElement">{{ text }}</span>
  </span>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["text"]);

const hoverElement = ref(false);
function enterElement() {
  console.log("enter element");
  hoverElement.value = true;
}
function leaveElement() {
  console.log("leave element");
  hoverElement.value = false;
}
</script>

<style scoped>
.tooltip {
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 1;
  transition: opacity 0.3s;
}
</style>
