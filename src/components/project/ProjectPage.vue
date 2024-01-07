<template>
  <div>
    <section>
      <base-card>
        <div>
          <!-- <span class="title">
            Project {{ project.id }}: {{ project.attr.name }}
          </span> -->
          <base-editable
            :initialValue="projectName"
            @submitValue="submitName"
            name="projectName"
            :getDefault="defaultName"
          ></base-editable>
          <span class="menu-buttons">
            <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
            <menu-button type="add" @click="openNewElement"></menu-button>
            <menu-button type="close"></menu-button>
          </span>
        </div>
      </base-card>
      <div class="tab-box">
        <div class="tab">
          <element-list :elements="elements" ref="listRef"></element-list>
        </div>
        <!-- <div class="tab">
          <element-list :elements="elements" ref="listRef"></element-list>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import ElementList from "./ElementList.vue";
import { ref, provide, computed } from "vue";
import { biProject } from "../../store/biProject.js";

const props = defineProps(["id"]);

const project = ref(new biProject(props.id));
provide("project", project);

const elements = computed(function () {
  return project.value.elements;
});
provide("elements", elements);

const links = computed(function () {
  return project.value.links;
});
provide("links", links);

const researches = computed(function () {
  return project.value.researches;
});
provide("researches", researches);

const listRef = ref();

// link methods
function openNewElement() {
  listRef.value.openNewElement();
}

// element name
function defaultName() {
  return project.value.defaultName;
}

const projectName = ref("");

function submitName(newName) {
  projectName.value = newName;
  project.value.changeName(newName);
}

project.value.loadProject().then(function () {
  projectName.value = project.value.name;
});
</script>

<style scoped>
.menu-buttons {
  float: left;
}
.title {
  cursor: default;
  /* float: right; */
  font-weight: bold;
  font-size: 1.8em;
  margin: 0.83em 0;
}

 .tab {
  overflow-y: scroll;
  overflow-x: hidden;
} 

.tab-box{
  display: flex;
  height: calc( 100vh - 250px);
}
</style>
