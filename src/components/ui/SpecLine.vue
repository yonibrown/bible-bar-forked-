<template>
  <td
    v-for="fld in tableFields"
    :class="{ 'fit-column': fld.fit }"
    @dblclick="$emit('dblclick')"
  >
    <slot :name="fld.name"></slot>
  </td>
</template>

<script setup>
import { inject } from "vue";
const tableFields = inject("tableFields");
</script>

<style scoped>
td {
  font-size: 85%;
  padding: 0 3px;
}

.fit-column {
  width: 1px;
  white-space: nowrap;
}
</style>
