<template>
  <div>
    <base-scrollable>
      <table>
        <tr class="resprt-header">
          <td v-show="displayOptions"></td>
          <td v-for="fld in tableFields">
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
          </td>
        </tr>
        <parts-line
          ref="linesRef"
          class="resprt-part"
          v-for="prt in filteredParts"
          :prt="prt"
          :key="prt.id"
          :checkAll="checkAllRef"
        ></parts-line>
      </table>
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
import PartsLine from "./PartsLine.vue";
import {  computed, ref, inject, watch } from "vue";
import { sendToServer } from "../../server.js";

const displayOptions = inject("displayOptions");
const elementAttr = inject("elementAttr");

const researchId = { res: elementAttr.value.res };
const parts = ref([]);
const links = inject("links");
const changeAttr = inject("changeAttr");
const linesRef = ref([]);

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

const sortField = ref(elementAttr.value.sort);
const ascending = ref(elementAttr.value.ordering == "ASC");

function changeSort(newField) {
  if (sortField.value == newField) {
    ascending.value = !ascending.value;
    parts.value.reverse();
  } else {
    ascending.value = true;
    if (sortField.value == "src") {
      sortField.value = "col";
      parts.value.sort(function (a, b) {
        return a.col_sort_key > b.col_sort_key ? 1 : -1;
      });
    } else {
      sortField.value = "src";
      parts.value.sort(function (a, b) {
        return a.src_sort_key > b.src_sort_key ? 1 : -1;
      });
    }
  }
  changeAttr({
    sort: sortField.value,
    ordering: ascending.value?'ASC':'DESC',
  });
}

// load data
loadResearchParts();

async function loadResearchParts() {
  const data = {
    type: "research",
    oper: "get_prt_list",
    id: researchId,
    prop: {
      sort: sortField.value,
      ordering: ascending.value?'ASC':'DESC',
    },
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

<style scoped>
.resprt-header {
  background-color: #ebebeb;
  user-select: none;
}

.resprt-header td {
  background-color: #ebebeb;
  padding: 2px 0 5px 0;
  /* border-bottom: 2px solid #e9e9e9; */
  font-size: 70%;
  position: sticky;
  top: 0;
  /* cursor: pointer; */
}

table {
  background-color: #e9e9e9;
  text-align: justify;
  width: 100%;
  /* max-width: 85%; */
}

.sortingField {
  font-weight: bold;
}
</style>
