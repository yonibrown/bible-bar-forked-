<template>
  <base-menu>
    <span>סוג:</span>
    <select v-model="type">
      <option value="choose">בחר</option>
      <option value="bar">ציר</option>
      <option value="text">טקסט</option>
      <option value="parts">רשימה</option>
      <option value="notes">הערות</option>
    </select>
    <input
      type="submit"
      value="פתח"
      @click="submitElement"
      :disabled="!displaysubmitElement"
    />
  </base-menu>
</template>

<script setup>
import { ref, computed, inject } from "vue";

const type = ref("choose");
const displaysubmitElement = computed(function () {
  return type.value != "choose";
});

const createElement = inject("createElement");

function submitElement() {
  const attr = {
    type: type.value,
  };
  createElement(attr);
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>
