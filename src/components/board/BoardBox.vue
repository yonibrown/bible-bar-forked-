<template>
  <div>Board</div>
  <spec-table
    :enableSelection="displayOptions"
    :tableFields="tableFields"
    :sortField="sortField"
    @changeSortField="changeSortField"
    @resizeField="resizeField"
    :ascending="ascending"
    @reverseTable="reverseTable"
    :lines="lines"
    lineComponent="board-line"
    ref="tableRef"
    :hilightTable="false"
  >
  </spec-table>
</template>

<script setup>
import SpecTable from "../ui/SpecTable.vue";

import { inject, computed, ref } from "vue";

const displayOptions = inject("displayOptions");

const sortField = ref("col");
const ascending = ref(true);

const tableFields = computed(function () {
  return [
    {
      name: "col1",
      title: "כותרת",
      sortable: true,
      display: true,
      widthPct:30
    },
    {
      name: "col2",
      title: "פסוקים",
      sortable: true,
      display: true,
      widthPct:20
    },
    {
      name: "col3",
      title: "הערות",
      sortable: false,
      display: true,
    },
  ];
});

const lines = [
  {
    col1: "סיפור ירושת הכס",
    col2: "א 1 – ב 10",
  },
];

function changeSortField(newField) {
  sortField.value = newField;
}

function reverseTable() {
  ascending.value = !ascending.value;
}

function resizeField(attr) {
  console.log('resize',attr);
  // changeAttr(attr);
}

</script>
