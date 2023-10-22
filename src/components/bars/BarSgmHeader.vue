<template>
  <div class="bar_sgm_header" :div="segment.div" :style="{ width: segment.width }">{{ segment.name }}</div>
</template>

<script setup>
const props = defineProps(['segment']);
</script>

<style scoped>
.bar_sgm_header {
  /*    height: 100%;*/
  float: right;
}
</style>