<template>
  <spec-line>
    <template #col1>
      <div>{{ line.col1 }}</div>
    </template>
    <template #col2>
      <div>{{ line.col2 }}</div>
    </template>
    <template #col3>
      <div>{{ line.col3 }}</div>
    </template>
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";

const props = defineProps(["line"]);
</script>

<style scoped>
div {
  resize: horizontal;
  overflow: auto;
  width: 120px;
  height: 120px;
  margin: 0px;
  padding: 0px;
  border: 1px solid black;
  display: block;
}
</style>
