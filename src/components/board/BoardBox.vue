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
  <ContextMenu ref="fieldMenuRef" :model="fieldMenuData">
    <template #item="{ item }">
      <div class="context">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </template>
  </ContextMenu>
</template>

<script setup>
import ContextMenu from "primevue/contextmenu";
import { ordering } from "../../general.js";

import { inject, computed, ref } from "vue";

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

const fieldMenuData = computed(function () {
  const addArr = [
    {
      label: "טקסט חופשי",
      icon: "fa fa-align-right",
      command: () => {
        addField("FreeText");
      },
    },
    {
      label: "טווח פסוקים",
      icon: "fa fa-book",
      command: () => {
        addField("SourceVerse");
      },
    },
  ];

  if (
    focusFieldIdx.value >= 0 &&
    boardFields.value[focusFieldIdx.value].type == "SourceVerse"
  ) {
    addArr.push({ separator: true });
    addArr.push({
      label: "מילים מתוך פסוק",
      icon: "fa fa-file-text-o",
      command: () => {
        addField("SourceWord");
      },
    });
  }

  const arr = [
    { label: "מחק עמודה", icon: "fa fa-close", command: deleteField },
    { label: "הוסף", icon: "fa fa-plus", items: addArr },
  ];

  if (
    focusFieldIdx.value >= 0 &&
    boardFields.value[focusFieldIdx.value].type == "SourceWord"
  ) {
    arr.push({ separator: true });
    arr.push({
      label: "הצג פסוק שלם",
    });
  }

  return arr;
});

const focusFieldIdx = ref(-1);
function openFieldMenu(attr) {
  focusFieldIdx.value = attr.idx;
  fieldMenuRef.value.show(event);
}

function addField(fieldType) {
  element.value.addField({
    position: ordFields.nextPos(focusFieldIdx.value),
    fieldType,
    openingField: boardFields.value[focusFieldIdx.value],
  });
}

function deleteField() {
  boardFields.value[focusFieldIdx.value].delete();
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

<style scoped>
.context {
  padding: 8px;
  cursor: default;
}
.context > span {
  margin: 10px;
}
</style>
