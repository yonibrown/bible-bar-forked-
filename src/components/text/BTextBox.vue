<template>
  <div>sourceId:{{ element.sourceId }}</div>
  <div>fromPart:{{ element.fromPart }}</div>
  <div>toPart:{{ element.toPart }}</div>
</template>

<script setup>
import { inject } from "vue";
const element = inject("element");
</script>

<style scoped></style>
