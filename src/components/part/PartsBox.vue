<template>
  <div v-show="displayOptions">
    <links-menu title="סינון"></links-menu>
    <parts-menu
      @updateData="updateData"
      :currentTab="currentTabName"
      ref="partsMenuRef"
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
  <research-link v-show="currentTabName == 'markers'"></research-link>
</template>

<script setup>
import BaseTabs from "../ui/BaseTabs.vue";
import PartsTable from "./PartsTable.vue";
import CollectionsTable from "./CollectionsTable.vue";
import ResearchLink from "./ResearchLink.vue";
import LinksMenu from "../link/LinksMenu.vue";
import PartsMenu from "./PartsMenu.vue";

import { ref, inject, provide, computed } from "vue";

const displayOptions = inject("displayOptions");

const elementAttr = inject("elementAttr");
const changeAttr = inject("changeAttr");

const researchObjId = { res: elementAttr.value.res };
provide("researchObjId", researchObjId);

const resMethods = inject("resMethods");
const research = computed(function () {
  return resMethods.getResearch(elementAttr.value.res);
});
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
  {
    name: "markers",
    title: "תצוגה",
  },
];
const currentTabName = ref(elementAttr.value.tab);
function changeTab(newVal) {
  currentTabName.value = newVal;
  changeAttr({ tab: currentTabName.value });
}

const currentTabTable = computed(function () {
  if (currentTabName.value == "parts") {
    return partsTabRef.value;
  }
  return colsTabRef.value;
});

// load data
function updateData(data) {
  switch (data.action) {
    case "newCat":
      resMethods.newCollection(research.value, data.prop);
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

const elmOpenText = inject("openText");
function openText(prop) {
  elmOpenText(prop, partsMenuRef.value.openInSameElement);
}
provide("openText", openText);
</script>