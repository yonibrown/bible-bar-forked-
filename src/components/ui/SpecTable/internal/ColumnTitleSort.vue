<template>
  <span
    v-if="fld.sortable"
    @dblclick="changeSort(fld.id)"
    :class="{ sortingField: tableProps.sortField == fld.id }"
  >
    {{ fld.title }}
    <i
      v-show="tableProps.sortField == fld.id"
      class="fa"
      :class="tableProps.ascending ? 'fa-arrow-up' : 'fa-arrow-down'"
    ></i>
  </span>
  <span v-else>
    {{ fld.title }}
  </span>
</template>

<script setup>
import { inject } from "vue";

const props = defineProps(["fld"]);

const tableProps = inject("tableProps");
const tableEmit = inject("tableEmit");

function changeSort(newField) {
  if (tableProps.sortField == newField) {
    tableEmit("reverseTable");
  } else {
    tableEmit("changeSortField", newField);
  }
}
</script>

<style scoped>
.sortingField {
  font-weight: bold;
}
</style>
