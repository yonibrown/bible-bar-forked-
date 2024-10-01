<template>
  <div>Board</div>
  <div v-show="displayOptions">
    <!-- <links-menu title="סינון"></links-menu> -->
    <board-menu></board-menu>
  </div>
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
    :reorderFields="true"
    @reorderFields="reorderFields"
  >
  </spec-table>
</template>

<script setup>
import SpecTable from "../ui/SpecTable.vue";
import BoardMenu from "./BoardMenu.vue";
import { ordering } from "../../general.js";

import { inject, computed, ref } from "vue";

const element = inject("element");
const displayOptions = inject("displayOptions");

const sortField = ref("col");
const ascending = ref(true);

const boardFields = computed(function () {
  return element.value.fields.sort(function (a, b) {
    return a.position - b.position;
  });
});

const tableFields = computed(function () {
  return boardFields.value.map(function (fld) {
    return {
      id: fld.id,
      type: fld.type,
      title: fld.title,
      sortable: true,
      display: true,
      widthPct: fld.width_pct,
    };
  });
});

const lines = [
  [
    { id: 0, val: "סיפור ירושת הכס" },
    { id: 1, val: "א 1 – ב 10" },
  ],
];

const ordFields = new ordering({
  getSize: function () {
    return boardFields.value.length;
  },
  getPosition: function (idx) {
    return +boardFields.value[idx].position;
  },
  setPosition: function (parms) {
    let act = [];
    parms.forEach(function ({ idx, newVal }) {
      act.push({ elm: boardFields.value[idx], newVal });
    });
    act.forEach(function ({ elm, newVal }) {
      elm.position = newVal;
    });
  },
  setTab: function (idx, newVal) {
    boardFields.value[idx].tab = newVal;
  },
  saveElmList: saveFields,
});

function changeSortField(newField) {
  sortField.value = newField;
}

function reverseTable() {
  ascending.value = !ascending.value;
}

function resizeField(attr) {
  console.log("resize", attr);
  // changeAttr(attr);
}

function reorderFields(attr) {
  console.log("reorderFields", attr);
  // element.value.setFieldPosition({ id: 0, newPos: 3 });
  // changeAttr(attr);
  ordFields.move(
    {
      idx: attr.sourceIdx,
    },
    {
      idx: attr.targetIdx,
    }
  );
}

function saveFields() {
  console.log("saveFields");
}
</script>
