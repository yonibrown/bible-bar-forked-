<template>
  <div v-show="editMode">
    <!-- <links-menu title="סינון"></links-menu> -->
    <parts-menu
      @updateData="updateData"
      :currentTab="currentTabName"
      ref="partsMenuRef"
    ></parts-menu>
  </div>
  <div ref="partsBodyRef">
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
  </div>
</template>

<script setup>
import BaseTabs from "../ui/BaseTabs.vue";
import PartsTable from "./PartsTable.vue";
import CollectionsTable from "./CollectionsTable.vue";
import ResearchLink from "./ResearchLink.vue";
// import LinksMenu from "../link/LinksMenu.vue";
import PartsMenu from "./PartsMenu.vue";
import { writeToClipboard } from "../../general.js";

import { ref, inject, provide, computed } from "vue";

const editMode = inject("editMode");

const elementAttr = inject("elementAttr");
const changeAttr = inject("changeAttr");
const project = inject("project");

const researchObjId = { res: elementAttr.value.res };
provide("researchObjId", researchObjId);

const research = computed(function () {
  return project.value.getResearch(elementAttr.value.res);
});
provide("research", research);

const partsTabRef = ref();
const colsTabRef = ref();
const partsMenuRef = ref();
const partsBodyRef = ref();

const partsListMode = computed(function () {
  if (partsMenuRef.value) {
    return partsMenuRef.value.listMode;
  }
  return null;
});
provide("partsListMode", partsListMode);

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
      research.value.newCollection(data.prop);
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
    case "upload":
      research.value.uploadParts(data.prop);
      break;
  }
}

const elmOpenText = inject("openText");
function openText(prop) {
  elmOpenText(prop, partsMenuRef.value.openInSameElement);
}
provide("openText", openText);

function copyToClipboard() {
  writeToClipboard(partsBodyRef.value.outerHTML, "html");
}

defineExpose({ copyToClipboard });
</script>
