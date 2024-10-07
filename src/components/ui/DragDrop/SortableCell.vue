<template>
  <base-draggable :data="dragData(idx)">
    <base-droppable :data="idx" :drop="moveElement" :dragStruct="dragStruct">
      <slot></slot>
    </base-droppable>
  </base-draggable>
</template>

<script setup>
const props = defineProps(["idx", "dragData", "moveElement", "dragStruct"]);
</script>
