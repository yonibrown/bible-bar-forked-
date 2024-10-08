<template>
  <span class="draggable-head" @mouseover="enterHead" @mouseleave="leaveHead">
    <slot></slot>
  </span>
</template>

<script setup>
import { inject } from "vue";

const enterHead = inject("enterDraggableHead");
const leaveHead = inject("leaveDraggableHead");
</script>
