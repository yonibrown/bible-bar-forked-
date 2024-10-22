<template>
  <spec-table
    :enableSelection="editMode"
    :tableFields="tableFields"
    :sortField="sortAttr.sort"
    @changeSortField="changeSortField"
    @changeField="changeField"
    :ascending="sortAttr.ordering == 'ASC'"
    @reverseTable="reverseTable"
    :lines="filteredParts"
    lineComponent="parts-line"
    ref="tableRef"
  >
  </spec-table>
</template>

<script setup>
import { computed, ref, inject } from "vue";

const editMode = inject("editMode");
const partsListMode = inject("partsListMode");
const elementAttr = inject("elementAttr");
const element = inject("element");

const research = inject("research");

const links = inject("links");
const changeAttr = inject("changeAttr");
const tableRef = ref([]);

const parts = computed(function () {
  if (!research.value || !research.value.parts) {
    return [];
  }
  return research.value.parts;
});

// table properties
const tableFields = computed(function () {
  return [
    {
      id: 0,
      type: "col",
      title: "קטגוריה",
      sortable: true,
      display: true,
      widthPct: element.value.partsWidth(0),
    },
    {
      id: 1,
      type: "src",
      title: "פסוק",
      sortable: true,
      display: partsListMode.value == "segment",
      widthPct: element.value.partsWidth(1),
    },
    {
      id: 2,
      type: "text",
      title: "טקסט",
      sortable: false,
      display: partsListMode.value == "segment",
    },
  ];
});

const sortAttr = ref({
  sort: elementAttr.value.sort,
  ordering: elementAttr.value.ordering,
});

function reverseTable() {
  sortAttr.value.ordering = sortAttr.value.ordering == "DESC" ? "ASC" : "DESC";
  //   parts.value.reverse();
  changeAttr(sortAttr.value);
}

function changeSortField(newField) {
  sortAttr.value.ordering = "ASC";
  sortAttr.value.sort = newField;
  //   parts.value.sort(function (a, b) {
  //     return a.sort_key[newField] > b.sort_key[newField] ? 1 : -1;
  //   });
  changeAttr(sortAttr.value);
}

function changeField({ id, attr }) {
  changeAttr({
    field_id: id,
    ...attr,
  });
}

// load data
// loadResearchParts();

// function loadResearchParts() {
//   research.value.loadParts(sortAttr.value);
// }

// filter parts
const filteredParts = computed(function () {
  // todo: add filters
  return parts.value;
  if (links.value.length == 0) {
    return parts.value;
  }
  return parts.value.filter(function (prt) {
    return filteringCols.value.includes(prt.col);
  });
});

const filteringCols = computed(function () {
  const arr = [];
  links.value.forEach(function (link) {
    link.categories.forEach(function (cat) {
      if (cat.res == elementAttr.value.res && cat.display) {
        arr.push(cat.col);
      }
    });
  });
  return arr;
});

async function moveSelectedToCat(cat) {
  await research.value.updateParts(tableRef.value.selectedLines, cat);
}

const createElement = inject("createElement");
async function duplicateSelected() {
  const newRes = await research.value.duplicate(tableRef.value.selectedLines);
  createElement({
    type: "parts",
    res: newRes.id.res,
  });
}

function removeSelected() {
  research.value.deleteParts(tableRef.value.selectedLines);
}

// const hilightTable = ref(false);
// function enterTable() {
//   hilightTable.value = true;
// }
// function leaveTable() {
//   hilightTable.value = false;
// }
// function addToTable(data) {
//   research.value.newPart({
//     project_id: project.value.id,
//     element_id: data.dispElmId,
//   });
// }

defineExpose({ moveSelectedToCat, duplicateSelected, removeSelected });
</script>
