<template>
  <spec-table
    :enableSelection="editMode"
    :tableFields="tableFields"
    :randomSortAvailable="true"
    :sortField="sortField"
    :ascending="ascending"
    @changeSortField="changeSortField"
    @resizeField="resizeField"
    @reverseTable="reverseTable"
    :lines="lines"
    lineComponent="board-line"
    ref="tableRef"
    :hilightTable="false"
    :reorderFields="true"
    @reorderFields="reorderFields"
    :storeLineWhenAdded="true"
    @addLine="addLine"
    @deleteLine="deleteLine"
    @reorderLines="reorderLines"
    @sortLines="sortLines"
    @addField="addField"
  >
  </spec-table>
</template>

<script setup>
import { ordering } from "../../general.js";

import { inject, computed, ref } from "vue";

const element = inject("element");
const editMode = inject("editMode");

const sortField = ref(-1);
const ascending = ref(true);

// fields
// --------------------------
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
      widthPct: fld.widthPct,
    };
  });
});

const ordFields = new ordering({
  getSize: function () {
    return boardFields.value.length;
  },
  getPosition: function (idx) {
    return +boardFields.value[idx].position;
  },
  setPosition: function (fld, newPosition) {
    fld.setPosition(newPosition);
  },
  getItem: function (idx) {
    return boardFields.value[idx];
  },
  setTab: function (idx, newVal) {},
  commitChanges: function () {},
});

function changeSortField(newField) {
  sortField.value = newField;
}

function reverseTable() {
  ascending.value = !ascending.value;
}

function resizeField(attr) {
  element.value.setField(attr);
}

function reorderFields(attr) {
  ordFields.move({
    source: {
      idx: attr.sourceIdx,
    },
    target: {
      idx: attr.targetIdx,
    },
  });
}

function addField(attr) {
  element.value.addField({
    position: ordFields.prevPos(attr.idx),
  });
}

// lines
// -------------------
const lines = computed(function () {
  return element.value.lines;
});

const ordLines = new ordering({
  getSize: function () {
    return lines.value.length;
  },
  getPosition: function (idx) {
    return +lines.value[idx].position;
  },
  setPosition: function (line, newPosition) {
    line.setPosition(newPosition);
  },
  getItem: function (idx) {
    return lines.value[idx];
  },
  setTab: function (idx, newVal) {},
  commitChanges: function () {},
});

function reorderLines(attr) {
  if (attr.steps) {
    ordLines.move({
      source: {
        idx: attr.sourceIdx,
      },
      steps: attr.steps,
    });
  }
}

function addLine(attr) {
  element.value.addLine({
    position: ordLines.prevPos(attr.idx),
    content: [],
  });
}

function deleteLine(line) {
  line.delete();
}

function sortLines(attr) {
  element.value.sortLines(attr);
}
</script>
