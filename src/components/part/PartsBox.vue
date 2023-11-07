<template>
  <!-- <h3>Parts</h3> -->
  <div>
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
      ></parts-line>
    </table>
  </div>
</template>

<script setup>
import { sendToServer } from "../../server.js";
import PartsLine from "./PartsLine.vue";

import { reactive, computed, ref, inject } from "vue";

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

function updateData(data){
  if (data.action == 'moveSelectedToCat'){
    moveSelectedToCat(data.newCat);
  }
}

const selectedParts = computed(function(){
  return linesRef.value.filter(function(part){
    return part.checked;
  }).map(function(part){
    return part.id;
  });
});

function moveSelectedToCat(cat){
  console.log('moveToCat',selectedParts.value,cat);
}
defineExpose({updateData});
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
  /* max-width: 85%; */
}

div {
  border: 1px solid #9aaab9;
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
