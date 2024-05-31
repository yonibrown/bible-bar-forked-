<template>
  <base-menu>
    <span>טקסט:</span>
    <select>
      <option value="1_1" selected="selected">נוסח המסורה</option>
    </select>
    <span style="display: inline">
      <span>מקטע:</span>
      <sequence-key
      ></sequence-key>
      <span>עד</span>
      <sequence-key
      ></sequence-key>
    </span>
  </base-menu>
</template>

<script setup>
import SequenceKey from "./SequenceKey.vue";

import { computed, provide, inject, ref } from "vue";

</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>
