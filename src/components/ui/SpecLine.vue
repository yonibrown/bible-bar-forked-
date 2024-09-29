<template>
  <td
    v-for="(fld,fldidx) in tableFields"
    v-show="fld.display"
    @dblclick="$emit('dblclick')"
  >
    <slot :name="fld.name" :idx="fldidx"></slot>
  </td>
</template>

<script setup>
import { inject } from "vue";
const tableFields = inject("tableFields");
const emit = defineEmits(["dblclick"]);
</script>

<style scoped>
td {
  font-size: 85%;
  padding: 0 3px;
}
</style>
