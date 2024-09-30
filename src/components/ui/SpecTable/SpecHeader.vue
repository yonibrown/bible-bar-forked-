<template>
  <tr class="header" ref="row">
    <td v-show="enableSelection"></td>
    <head-td
      v-for="(fld, fldidx) in tableFields"
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
    </head-td>
  </tr>
</template>

<script setup>
import HeadTd from "./HeadTd.vue";
import { computed, ref, watch, provide, inject ,onMounted} from "vue";

const emit = defineEmits(["reverseTable", "changeSortField", "resizeField"]);
const props = defineProps([
  "sortField",
  "ascending",
]);

const enableSelection = inject('enableSelection');
const tableFields = inject('tableFields');

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
</style>
