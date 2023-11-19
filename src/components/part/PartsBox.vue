<template>
  <div v-show="displayOptions">
    <links-menu title="סינון"></links-menu>
    <parts-menu @updateData="updateData"></parts-menu>
  </div>
  <div class="tabs">
    <button
      v-for="tab in tabList"
      :class="{ active: tab.name == currentTab }"
      @click="changeTab(tab.name)"
    >
      {{ tab.title }}
    </button>
  </div>
  <parts-table v-show="currentTab == 'parts'" ref="partsTabRef"></parts-table>
  <collections-table
    v-show="currentTab == 'collections'"
    ref="colsTabRef"
  ></collections-table>
</template>

<script setup>
import PartsTable from "./PartsTable.vue";
import CollectionsTable from "./CollectionsTable.vue";
import LinksMenu from "../link/LinksMenu.vue";
import PartsMenu from "./PartsMenu.vue";

import { ref, inject ,provide} from "vue";

const displayOptions = inject("displayOptions");

const elementAttr = inject("elementAttr");
const researchId = { res: elementAttr.value.res };
provide('researchId',researchId);

const getResearch = inject("getResearch");
const research = getResearch(elementAttr.value.res);
provide('research',research);

const partsTabRef = ref();

// tabs
const currentTab = ref("parts");
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
function changeTab(newVal) {
  currentTab.value = newVal;
}

// load data
const newCollection = inject("newCollection");
function updateData(data) {
  switch (data.action) {
    case "newCat":
      newCollection(research,data.prop);
      break;
    case "moveSelectedToCat":
      partsTabRef.value.moveSelectedToCat(data.prop);
      break;
    case "duplicate":
      partsTabRef.value.duplicateSelected();
      break;
  }
}
</script>

<style scoped>
.tabs {
  /* overflow: hidden; */
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  width: fit-content;
}

/* Style the buttons that are used to open the tab content */
.tabs button {
  background-color: inherit;
  float: right;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 2px 16px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tabs button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tabs button.active {
  background-color: #ccc;
}
</style>
