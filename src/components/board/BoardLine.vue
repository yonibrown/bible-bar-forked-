<template>
  <spec-line>
    <template #text="{id}">
      <span>{{ line[id] }}</span>
    </template> 
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";

const props = defineProps(["line"]);

// function getField(id){

// }
</script>

<style scoped>
</style>
