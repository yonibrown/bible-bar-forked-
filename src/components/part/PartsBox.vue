<template>
  <!-- <h3>Parts</h3> -->
  <div>
    <table>
      <tr class="resprt-header">
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

import { reactive, computed, ref ,inject} from "vue";

const props = defineProps(["elementAttr"]);

const changeAttr = inject("changeAttr");

const parts = ref([]);

const researchId = { res: props.elementAttr.res };

const sort = reactive({
  field: props.elementAttr.sort, // src/sol/pos
  ascending: props.elementAttr.ordering=='ASC',
});

loadResearchParts();

async function loadResearchParts() {
  const data = {
    type: "research",
    oper: "get_prt_list",
    id: researchId,
    prop: { 
      sort:sort.field,
      ordering: sort.ascending?'ASC':'DESC'
    },
  };

  const obj = await sendToServer(data);
  parts.value = obj.data;
}

const verseClass = computed(function () {
  return sort.field == "src" ? "sortingField" : "";
});
const categoryClass = computed(function () {
  return sort.field == "col" ? "sortingField" : "";
});
const verseAscending = computed(function () {
  return (sort.field == "src") & sort.ascending;
});
const verseDescending = computed(function () {
  return (sort.field == "src") & !sort.ascending;
});
const categoryAscending = computed(function () {
  return (sort.field == "col") & sort.ascending;
});
const categoryDescending = computed(function () {
  return (sort.field == "col") & !sort.ascending;
});
function changeSort(newField) {
  if (sort.field == newField) {
    sort.ascending = !sort.ascending;
    parts.value.reverse();
  } else {
    sort.ascending = true;
    if (sort.field == "src") {
      sort.field = "col";
      parts.value.sort(function (a, b) {
        return a.col_sort_key > b.col_sort_key ? 1 : -1;
      });
    } else {
      sort.field = "src";
      parts.value.sort(function (a, b) {
        return a.src_sort_key > b.src_sort_key ? 1 : -1;
      });
    }
  }
  changeAttr({
    sort: 'src',
    ordering: 'ASC'
  });
}
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
