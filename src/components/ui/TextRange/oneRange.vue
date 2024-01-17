<template>
  <span>
    <span class="divider">|</span>
    <span v-for="word in words">{{ word }}</span>
  </span>
</template>

<script setup>
import { inject, computed, provide } from "vue";
const props = defineProps(["text","fromWord","toWord"]);

const words = computed(function () {
  return props.text
    .replaceAll(/[\s־׃]/g, (ch) => {
      return "x" + ch + "x";
    })
    .split("x");
});
</script>

<style scoped>

.divider{
    color: blue;
    cursor: col-resize;
}

</style>