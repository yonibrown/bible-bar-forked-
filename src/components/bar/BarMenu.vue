<template>
  <base-menu>
    <input type="checkbox" v-model="openInSameElement" />
    <span>פתח טקסט בחלון קבוע</span>
  </base-menu>
</template>

<script setup>
import { ref } from "vue";
const openInSameElement = ref(true);

defineExpose({ openInSameElement });
</script>
