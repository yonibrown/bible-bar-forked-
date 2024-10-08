<template>
  <draggable-head v-if="tableProps.reorderFields && enableSelection">
    <span class="head">
      <slot></slot>
    </span>
  </draggable-head>
  <slot v-else></slot>
</template>

<script setup>
import { inject } from "vue";

const tableProps = inject("tableProps");
const enableSelection = inject("enableSelection");
</script>

<style scoped>
.head {
  cursor: grab;
}
</style>
