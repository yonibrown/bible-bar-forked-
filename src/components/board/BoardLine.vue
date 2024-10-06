<template>
  <spec-line>
    <template #text="{id}">
      <span>{{ getValue(id) }}</span>
    </template> 
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";

const props = defineProps(["line"]);

function getValue(id){
  return props.line.find(function(fld){
    return fld.id == id;
  }).val;
}
</script>

<style scoped>
</style>
