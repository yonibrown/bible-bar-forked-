<template>
  <div v-show="displayOptions">
    <links-menu title="סינון"></links-menu>
    <parts-menu
      @updateData="updateData"
    ></parts-menu>
  </div>
  <div class="tabs">
    <button
      v-for="tab in tabList"
      :class="{ active: (tab.name == currentTab) }"
      @click="changeTab(tab.name)"
    >
      {{ tab.title }}
    </button>
    <!-- <button :class="{active:tab=='parts'}" @click="changeTab('parts')">רשימה</button>
    <button :class="{active:tab=='categories'}" @click="changeTab('categories')">קטגוריות</button> -->
  </div>
  <parts-table
    v-show="currentTab == 'parts'"
    ref="partsTabRef"
  ></parts-table>
</template>

<script setup>
import PartsTable from "./PartsTable.vue";
import LinksMenu from "../link/LinksMenu.vue";
import PartsMenu from "./PartsMenu.vue";

import { ref, inject } from "vue";

const displayOptions = inject("displayOptions");

const partsTabRef = ref();

// tabs
const currentTab = ref("parts");
const tabList = [
  {
    name: "parts",
    title: "רשימה",
  },
  {
    name: "categories",
    title: "קטגוריות",
  },
];
function changeTab(newVal) {
  currentTab.value = newVal;
}

// load data
function updateData(data) {
  switch (data.action) {
    case "showCat":
      console.log('showCat: not yet implemented');
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
/* Style the tab */
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
