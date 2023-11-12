<template>
  <parts-menu
    v-show="displayOptions"
    :elementAttr="elementAttr"
    @updateData="updateData"
  ></parts-menu>
  <div class="parts-box">
    <table>
      <tr class="resprt-header">
        <td v-show="displayOptions"></td>
        <td :class="categoryClass" @dblclick="changeSort('col')">
          קטגוריה
          <i v-show="categoryAscending" class="fa fa-arrow-up"></i>
          <i v-show="categoryDescending" class="fa fa-arrow-down"></i>
        </td>
        <td :class="verseClass" @dblclick="changeSort('src')">
          פסוק
          <i v-show="verseAscending" class="fa fa-arrow-up"></i>
          <i v-show="verseDescending" class="fa fa-arrow-down"></i>
        </td>
        <td>טקסט</td>
      </tr>
      <parts-line
        ref="linesRef"
        class="resprt-part"
        v-for="prt in parts"
        :prt="prt"
        :key="prt.id"
        :checkAll="checkAllRef"
      ></parts-line>
    </table>
  </div>
  <span v-show="displayOptions">
    <span>בחר הכל:</span>
    <input
      type="checkbox"
      v-model="checkAllRef"
      :indeterminate="checkPartial"
    />
  </span>
</template>

<script setup>
import PartsMenu from "./PartsMenu.vue";
import PartsLine from "./PartsLine.vue";
import { sendToServer } from "../../server.js";

import { reactive, computed, ref, inject, watch } from "vue";

const displayOptions = inject("displayOptions");
const props = defineProps(["elementAttr"]);

const changeAttr = inject("changeAttr");

const parts = ref([]);
const linesRef = ref([]);

const researchId = { res: props.elementAttr.res };

const attr = reactive({
  sort: props.elementAttr.sort, // src/sol/pos
  ordering: props.elementAttr.ordering,
});

loadResearchParts();

async function loadResearchParts() {
  const data = {
    type: "research",
    oper: "get_prt_list",
    id: researchId,
    prop: {
      sort: attr.sort,
      ordering: attr.ordering,
    },
  };

  const obj = await sendToServer(data);
  parts.value = obj.data;
}

const verseClass = computed(function () {
  return attr.sort == "src" ? "sortingField" : "";
});
const categoryClass = computed(function () {
  return attr.sort == "col" ? "sortingField" : "";
});
const verseAscending = computed(function () {
  return (attr.sort == "src") & (attr.ordering == "ASC");
});
const verseDescending = computed(function () {
  return (attr.sort == "src") & (attr.ordering == "DESC");
});
const categoryAscending = computed(function () {
  return (attr.sort == "col") & (attr.ordering == "ASC");
});
const categoryDescending = computed(function () {
  return (attr.sort == "col") & (attr.ordering == "DESC");
});
function changeSort(newField) {
  if (attr.sort == newField) {
    attr.ordering = attr.ordering == "ASC" ? "DESC" : "ASC";
    parts.value.reverse();
  } else {
    attr.ordering = "ASC";
    if (attr.sort == "src") {
      attr.sort = "col";
      parts.value.sort(function (a, b) {
        return a.col_sort_key > b.col_sort_key ? 1 : -1;
      });
    } else {
      attr.sort = "src";
      parts.value.sort(function (a, b) {
        return a.src_sort_key > b.src_sort_key ? 1 : -1;
      });
    }
  }
  changeAttr({
    sort: attr.sort,
    ordering: attr.ordering,
  });
}

function updateData(data) {
  switch (data.action) {
    case "moveSelectedToCat":
      moveSelectedToCat(data.newCat);
      break;
    case "duplicate":
      duplicateSelected();
      break;
  }
}

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
  const data = {
    type: "research",
    oper: "update_parts",
    id: researchId,
    prop: {
      partList: selectedParts.value,
      updAttr: { collection_id: cat },
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

.parts-box {
  border: 1px solid #9aaab9;
  width: 100%;
  /* max-width: fit-content; */
  /* max-height: inherit; */
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 15px auto;
}

.sortingField {
  font-weight: bold;
}
</style>
