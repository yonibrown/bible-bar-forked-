<template>
  <spec-table
    :enableSelection="editMode"
    :tableFields="tableFields"
    :randomSortAvailable="true"
    :sortField="sortField"
    :ascending="ascending"
    @changeSortField="changeSortField"
    @changeField="changeField"
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
    @openFieldMenu="openFieldMenu"
  >
  </spec-table>
  <field-menu
    ref="fieldMenuRef"
    :field="focusField"
    @addField="addField"
    @deleteField="deleteField"
    @toggleDisplayWholeVerse="toggleDisplayWholeVerse"
    @changeReferenceStyle="changeReferenceStyle"
  ></field-menu>
</template>

<script setup>
import FieldMenu from "./FieldMenu.vue";
import { ordering } from "../../general.js";

import { inject, computed, ref, provide } from "vue";

const element = inject("element");
const editMode = inject("editMode");

const sortField = ref(-1);
const ascending = ref(true);
const fieldMenuRef = ref();

// fields
// --------------------------
const boardFields = computed(function () {
  return element.value.fields
    .filter(function (fld) {
      return fld.position > 0;
    })
    .sort(function (a, b) {
      return a.position - b.position;
    });
});

const tableFields = computed(function () {
  return boardFields.value.map(function (fld) {
    return {
      id: fld.id,
      type: fld.type,
      typeDesc: typeDesc(fld.type),
      title: fld.title,
      sortable: true,
      display: true,
      widthPct: fld.widthPct,
    };
  });
});

function typeDesc(type) {
  switch (type) {
    case "SourceVerse":
      return "סוג עמודה: טווח פסוקים";
    case "FreeText":
      return "סוג עמודה: טקסט חופשי";
  }
}

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

function changeField(attr) {
  element.value.setField(attr.id, attr.attr);
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

const focusFieldIdx = ref(-1);

const focusField = computed(function () {
  if (focusFieldIdx.value < 0) {
    return null;
  }
  return boardFields.value[focusFieldIdx.value];
});

function openFieldMenu(attr) {
  focusFieldIdx.value = attr.idx;
  fieldMenuRef.value.show();
}

function addField(fieldType) {
  console.log("addField", fieldType);
  element.value.addField({
    position: ordFields.nextPos(focusFieldIdx.value),
    fieldType,
    openingField: focusField.value,
  });
}

function deleteField() {
  focusField.value.delete();
}

function toggleDisplayWholeVerse() {
  focusField.value.changeAttr({
    display_whole_verse: !focusField.value.displayWholeVerse,
  });
}

function changeReferenceStyle(newVal) {
  focusField.value.changeAttr({
    reference_style: newVal,
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
