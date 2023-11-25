<template>
  <div v-show="displayOptions">
    <links-menu title="סינון"></links-menu>
    <parts-menu
      @updateData="updateData"
      :currentTab="currentTabName"
    ></parts-menu>
  </div>
  <base-tabs
    :tabList="tabList"
    :currentTab="currentTabName"
    @changeTab="changeTab"
  ></base-tabs>
  <parts-table
    v-show="currentTabName == 'parts'"
    ref="partsTabRef"
  ></parts-table>
  <collections-table
    v-show="currentTabName == 'collections'"
    ref="colsTabRef"
  ></collections-table>
</template>

<script setup>
import BaseTabs from "../ui/BaseTabs.vue";
import PartsTable from "./PartsTable.vue";
import CollectionsTable from "./CollectionsTable.vue";
import LinksMenu from "../link/LinksMenu.vue";
import PartsMenu from "./PartsMenu.vue";

import { ref, inject, provide, computed } from "vue";

const displayOptions = inject("displayOptions");

const elementAttr = inject("elementAttr");
const researchObjId = { res: elementAttr.value.res };
provide("researchObjId", researchObjId);

const getResearch = inject("getResearch");
const research = getResearch(elementAttr.value.res);
provide("research", research);

const partsTabRef = ref();
const colsTabRef = ref();

// tabs
const tabList = [
  {
    name: "parts",
    title: "רשימה",
  },
  {
    name: "collections",
    title: "קטגוריות",
  },
];
const currentTabName = ref("parts");
function changeTab(newVal) {
  currentTabName.value = newVal;
}

const currentTabTable = computed(function () {
  if (currentTabName.value == "parts") {
    return partsTabRef.value;
  }
  return colsTabRef.value;
});

// load data
const newCollection = inject("newCollection");
function updateData(data) {
  switch (data.action) {
    case "newCat":
      newCollection(research, data.prop);
      break;
    case "changeCat":
      currentTabTable.value.moveSelectedToCat(data.prop);
      break;
    case "duplicate":
      currentTabTable.value.duplicateSelected();
      break;
    case "remove":
      currentTabTable.value.removeSelected();
      break;
  }
}
</script>
