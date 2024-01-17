<template>
  <spec-table
    :enableSelection="displayOptions"
    :tableFields="tableFields"
    :sortField="sortAttr.sort"
    @changeSortField="changeSortField"
    :ascending="sortAttr.ordering == 'ASC'"
    @reverseTable="reverseTable"
    :lines="sortedParts"
    lineComponent="parts-line"
    ref="tableRef"
  >
  </spec-table>
</template>

<script setup>
import SpecTable from "../ui/SpecTable.vue";
import { computed, ref, inject } from "vue";

const displayOptions = inject("displayOptions");
const partsListMode = inject("partsListMode");
const elementAttr = inject("elementAttr");

const research = inject("research");

// const parts = ref([]);
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
      name: "col",
      title: "קטגוריה",
      sortable: true,
      fit: true,
      display: true
    },
    {
      name: "src",
      title: "פסוק",
      sortable: true,
      fit: true,
      display: partsListMode.value=="verse"
    },
    {
      name: "text",
      title: "טקסט",
      sortable: false,
      fit: false,
      display: partsListMode.value=="verse"
    },
    {
      name: "div_range",
      title: "טווח פסוקים",
      sortable: true,
      fit: true,
      display: partsListMode.value=="segment"
    },
    {
      name: "text_range",
      title: "טקסט",
      sortable: false,
      fit: false,
      display: partsListMode.value=="segment"
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

// load data
// loadResearchParts();

// function loadResearchParts() {
//   research.value.loadParts(sortAttr.value);
// }

// filter parts
const filteredParts = computed(function () {
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

// sort parts
const sortedParts = computed(function () {
  if (!filteredParts.value) {
    return [];
  }
  const arr = filteredParts.value.slice();
  arr.sort(function (a, b) {
    if (sortAttr.value.ordering == "ASC") {
      return a.sort_key[sortAttr.value.sort] > b.sort_key[sortAttr.value.sort]
        ? 1
        : -1;
    }
    return a.sort_key[sortAttr.value.sort] < b.sort_key[sortAttr.value.sort]
      ? 1
      : -1;
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

defineExpose({ moveSelectedToCat, duplicateSelected, removeSelected });
</script>
