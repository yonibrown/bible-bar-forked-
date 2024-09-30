<template>
  <tr class="header" ref="row">
    <td v-show="enableSelection"></td>
    <td v-show="fld.display" v-for="(fld, fldidx) in tableFields">
      <column-resizer
        ref="headCell"
        :fld="fld"
        :lastField="fldidx + 1 == tableFields.length"
        @resize="(style) => resizeCell(fldidx, style)"
      >
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
      </column-resizer>
    </td>
  </tr>
</template>

<script setup>
import ColumnResizer from "./ColumnResizer.vue";
import { ref, provide, inject, onMounted } from "vue";

const emit = defineEmits(["reverseTable", "changeSortField", "resizeField"]);
const props = defineProps(["sortField", "ascending"]);

const enableSelection = inject("enableSelection");
const tableFields = inject("tableFields");

var resizeTimeout = null;
var resizeData = {};
function resizeCell(fieldIndex, style) {
  resizeData = { fieldIndex, width: style.width };
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    emit("resizeField", resizeData);
    // console.log("resize width", resizeData);
  }, 1000);
}

function changeSort(newField) {
  if (props.sortField == newField) {
    emit("reverseTable");
  } else {
    emit("changeSortField", newField);
  }
}

const row = ref();
const rowWidth = ref(0);
onMounted(function () {
  rowWidth.value = parseInt(
    document.defaultView.getComputedStyle(row.value).width,
    10
  );
});
provide("rowWidth", rowWidth);
</script>

<style scoped>
.header {
  background-color: #e4e4e4;
  user-select: none;
}

.header td {
  background-color: #e4e4e4;
  /* border-bottom: 2px solid #e9e9e9; */
  position: sticky;
  top: 0;
}

.sortingField {
  font-weight: bold;
}
td {
  padding: 2px 5px 5px 2px;
  /* border-bottom: 2px solid #e9e9e9; */
  font-size: 71%;
  /* cursor: pointer; */
}
</style>
