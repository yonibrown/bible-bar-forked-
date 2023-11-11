<template>
  <option :value="col.id" :disabled="isResTitle">
    {{ name }}
  </option>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["col"]);

const isResTitle = computed(function () {
  return props.col.id == 0;
});
const name = computed(function () {
  if (isResTitle.value) {
    return props.col.name;
  }
  return "--" + props.col.name;
});
</script>
