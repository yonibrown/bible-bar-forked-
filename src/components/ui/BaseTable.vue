<template>
  <table>
    <tr class="header">
      <td v-show="enableSelection"></td>
      <td v-for="fld in tableFields">
        <span
          v-if="fld.sortable"
          @dblclick="changeSort(fld.name)"
          :class="{ sortingField: sortField == fld.name }"
        >
          {{ fld.title }}
          <i
            v-show="sortField == fld.name"
            class="fa"
            :class="ascending ? 'fa-arrow-up' : 'fa-arrow-down'"
          ></i>
        </span>
        <span v-else>{{ fld.title }}</span>
      </td>
    </tr>
    <slot></slot>
  </table>
</template>

<script setup>
const props = defineProps([
  "enableSelection",
  "tableFields",
  "sortField",
  "ascending",
]);
const emit = defineEmits(["reverseTable", "changeSortField"]);

function changeSort(newField) {
  if (props.sortField == newField) {
    emit("reverseTable");
  } else {
    emit("changeSortField", newField);
  }
}
</script>

<style scoped>
.header {
  background-color: #ebebeb;
  user-select: none;
}

.header td {
  background-color: #ebebeb;
  padding: 2px 0 5px 0;
  /* border-bottom: 2px solid #e9e9e9; */
  font-size: 70%;
  position: sticky;
  top: 0;
  /* cursor: pointer; */
}

table {
  background-color: #e9e9e9;
  text-align: justify;
  width: 100%;
  /* max-width: 85%; */
}

.sortingField {
  font-weight: bold;
}
</style>
