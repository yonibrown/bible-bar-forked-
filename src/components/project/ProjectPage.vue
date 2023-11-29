<template>
  <div>
    <section>
      <base-card>
        <div>
          <span class="title">
            Project {{ project.id }}: {{ project.attr.name }}
          </span>
          <span class="menu-buttons">
            <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
            <menu-button type="add" @click="openNewElement"></menu-button>
            <menu-button type="close"></menu-button>
          </span>
        </div>
      </base-card>
      <element-list :elements="elements" ref="listRef"></element-list>
    </section>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import ElementList from "./ElementList.vue";
import {  ref } from "vue";
import { newProjectData } from "./dataStore.js";

const props = defineProps(["id"]);

const { project, prjMethods, elements } = newProjectData(props.id);

const listRef = ref();

prjMethods.loadProject();

// link methods
function openNewElement() {
  listRef.value.openNewElement();
}
</script>

<style scoped>
.menu-buttons {
  float: left;
}
.title {
  cursor: default;
  /* float: right; */
  font-weight: bold;
  font-size: 1.5em;
  margin: 0.83em 0;
}
</style>
