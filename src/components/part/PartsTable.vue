<template>
  <div>
    <base-scrollable>
      <base-table
        :enableSelection="displayOptions"
        :tableFields="tableFields"
        :sortField="sortAttr.sort"
        @changeSortField="changeSortField"
        :ascending="sortAttr.ordering == 'ASC'"
        @reverseTable="reverseTable"
      >
        <parts-line
          ref="linesRef"
          class="resprt-part"
          v-for="prt in filteredParts"
          :prt="prt"
          :key="prt.id"
          :checkAll="checkAllRef"
        ></parts-line>
      </base-table>
    </base-scrollable>
    <span v-show="displayOptions">
      <span>בחר הכל:</span>
      <input
        type="checkbox"
        v-model="checkAllRef"
        :indeterminate="checkPartial"
      />
    </span>
  </div>
</template>

<script setup>
import BaseTable from "../ui/BaseTable.vue";
import PartsLine from "./PartsLine.vue";
import { computed, ref, inject, watch } from "vue";
import { sendToServer } from "../../server.js";

const displayOptions = inject("displayOptions");
const elementAttr = inject("elementAttr");

const researchId = { res: elementAttr.value.res };
const parts = ref([]);
const links = inject("links");
const changeAttr = inject("changeAttr");
const linesRef = ref([]);

// table properties
const tableFields = [
  {
    name: "col",
    title: "קטגוריה",
    sortable: true,
  },
  {
    name: "src",
    title: "פסוק",
    sortable: true,
  },
  {
    name: "text",
    title: "טקסט",
    sortable: false,
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

const selectedParts = computed(function () {
  return linesRef.value
    .filter(function (part) {
      return part.checked;
    })
    .map(function (part) {
      return part.id;
    });
});

async function moveSelectedToCat(cat) {
  console.log(cat, selectedParts.value);
  const data = {
    type: "research",
    oper: "update_parts",
    id: researchId,
    prop: {
      partList: selectedParts.value,
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
      partList: selectedParts.value,
    },
  };

  const obj = await sendToServer(data);
  createElement({
    type: "parts",
    res: obj.data.new_res_id,
  });
}

const checkAllRef = ref(false);
const checkPartial = ref(false);
const checkState = computed(function () {
  const len = selectedParts.value.length;
  if (len == 0) {
    return "none";
  }
  if (len == linesRef.value.length) {
    return "all";
  }
  return "partial";
});
watch(checkState, function (newVal) {
  if (newVal == "all") {
    checkAllRef.value = true;
    checkPartial.value = false;
  } else {
    if (newVal == "none") {
      checkAllRef.value = false;
      checkPartial.value = false;
    } else {
      checkPartial.value = true;
    }
  }
});

defineExpose({ moveSelectedToCat, duplicateSelected });
</script>
