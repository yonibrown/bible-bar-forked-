<template>
  <span v-if="field.name == 'name'">{{ line.name }}</span>
  <span v-else>
    {{ line.description }}
  </span>
</template>

<script setup>
const props = defineProps(["line", "field"]);
</script>
