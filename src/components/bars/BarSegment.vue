<template>
  <div class="bar_segment" :style="{width:segment.width, backgroundColor:segment.color}"></div>
</template>

<script setup>
const props = defineProps(['segment']);
</script>

<style scoped>
.bar_segment {
  height: 100%;
  float: right;
  position: relative;
}
</style>