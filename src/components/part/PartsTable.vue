<template>
  <base-table
    :enableSelection="displayOptions"
    :tableFields="tableFields"
    :sortField="sortAttr.sort"
    @changeSortField="changeSortField"
    :ascending="sortAttr.ordering == 'ASC'"
    @reverseTable="reverseTable"
    :lines="filteredParts"
    lineComponent="parts-line"
    ref="tableRef"
  >
  </base-table>
</template>

<script setup>
import BaseTable from "../ui/BaseTable.vue";
import { computed, ref, inject,provide } from "vue";
import { sendToServer } from "../../server.js";

const displayOptions = inject("displayOptions");
const elementAttr = inject("elementAttr");

const researchId = inject("researchId");

const parts = ref([]);
const links = inject("links");
const changeAttr = inject("changeAttr");
const tableRef = ref([]);

// table properties
const tableFields = [
  {
    name: "col",
    title: "קטגוריה",
    sortable: true,
    fit: true,
  },
  {
    name: "src",
    title: "פסוק",
    sortable: true,
    fit: true,
  },
  {
    name: "text",
    title: "טקסט",
    sortable: false,
    fit: false,
  },
];
const sortAttr = ref({
  sort: elementAttr.value.sort,
  ordering: elementAttr.value.ordering,
});
function reverseTable() {
  sortAttr.value.ordering = sortAttr.value.ordering == "DESC" ? "ASC" : "DESC";
  parts.value.reverse();
  changeAttr(sortAttr.value);
}
function changeSortField(newField) {
  sortAttr.value.ordering = "ASC";
  sortAttr.value.sort = newField;
  parts.value.sort(function (a, b) {
    return a.sort_key[newField] > b.sort_key[newField] ? 1 : -1;
  });
  changeAttr(sortAttr.value);
}

// load data
loadResearchParts();

async function loadResearchParts() {
  const data = {
    type: "research",
    oper: "get_prt_list",
    id: researchId,
    prop: sortAttr.value,
  };

  const obj = await sendToServer(data);
  parts.value = obj.data;
}

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

async function moveSelectedToCat(cat) {
  const data = {
    type: "research",
    oper: "update_parts",
    id: researchId,
    prop: {
      partList: tableRef.value.selectedLines,
      updAttr: cat,
    },
  };

  const obj = await sendToServer(data);
  loadResearchParts();
}

const createElement = inject("createElement");
async function duplicateSelected() {
  const data = {
    type: "research",
    oper: "duplicate",
    id: researchId,
    prop: {
      partList: tableRef.value.selectedLines,
    },
  };

  const obj = await sendToServer(data);
  createElement({
    type: "parts",
    res: obj.data.new_res_id,
  });
}

defineExpose({ moveSelectedToCat, duplicateSelected });
</script>
