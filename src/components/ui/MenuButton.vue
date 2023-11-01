<template>
  <div class="fa" :class="faClass"></div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["type"]);

const faClass = computed(function(){
    switch (props.type) {
    case "close":
      return "fa-close";
    case "options":
      return "fa-bars";
    default:
      return null;
  }
});
</script>

<style scoped>
div {
  cursor: default;
  /* float: left; */
  color: rgb(146, 146, 146);
  margin-right: 6px;
  padding: 4px;
  position: relative;
}
div:hover {
  color: black;
  background-color: rgb(223, 228, 235);
}
</style>